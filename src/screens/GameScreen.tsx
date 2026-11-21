import React, { useEffect, useRef, useState } from 'react';
import {
  AppState,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { avatarById } from '../avatars';
import { arrangeCards } from '../game/arrange';
import { CATEGORY_LABEL, scoreHand } from '../game/evaluate';
import {
  HUMAN_SEAT,
  lockArrangement,
  matchWinners,
  nextRound,
  revealNextHand,
  setHumanLayout,
  swapCards,
  tickTimer,
} from '../game/engine';
import { Card, HAND_SIZE, HANDS_PER_ROUND, MatchState, SPARE_INDEX } from '../game/types';
import { saveActiveGame } from '../storage';
import { colors, radius } from '../theme';
import { AvatarBadge } from '../components/AvatarBadge';
import { CardView } from '../components/CardView';

interface Props {
  initialMatch: MatchState;
  /** Leave the table, keeping the match so it can be resumed later. */
  onSuspend: (match: MatchState) => void;
  /** Match finished; record results and return home. */
  onFinish: (match: MatchState) => void;
}

function handOf(layout: Card[], h: number): Card[] {
  return layout.slice(h * HAND_SIZE, h * HAND_SIZE + HAND_SIZE);
}

export function GameScreen({ initialMatch, onSuspend, onFinish }: Props) {
  const [match, setMatch] = useState<MatchState>(initialMatch);
  const [selected, setSelected] = useState<number | null>(null);
  const matchRef = useRef(match);
  matchRef.current = match;

  // Save whenever the game meaningfully changes (not on every timer tick).
  useEffect(() => {
    if (match.phase !== 'matchOver') saveActiveGame(match);
  }, [match.phase, match.round, match.revealed, match.layouts]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save when the app goes to the background, so the timer position is kept too.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' && matchRef.current.phase !== 'matchOver') {
        saveActiveGame(matchRef.current);
      }
    });
    return () => sub.remove();
  }, []);

  // Arrange countdown.
  useEffect(() => {
    if (match.phase !== 'arrange') return;
    const id = setInterval(() => {
      setMatch((m) => (m.phase === 'arrange' ? tickTimer(m, 1).state : m));
    }, 1000);
    return () => clearInterval(id);
  }, [match.phase, match.round]);

  // Time up: lock whatever the human has arranged.
  useEffect(() => {
    if (match.phase === 'arrange' && match.secondsLeft === 0) {
      setSelected(null);
      setMatch((m) => lockArrangement(m));
    }
  }, [match.phase, match.secondsLeft]);

  const seats = match.seats;
  const isHumanArranging = match.phase === 'arrange';

  function onTapCard(i: number) {
    if (selected === null) setSelected(i);
    else if (selected === i) setSelected(null);
    else {
      const a = selected;
      setSelected(null);
      setMatch((m) => swapCards(m, a, i));
    }
  }

  function onSuggest() {
    const layout = arrangeCards(matchRef.current.layouts[HUMAN_SEAT], 'hard');
    setSelected(null);
    setMatch((m) => setHumanLayout(m, layout));
  }

  function onShowCards() {
    setSelected(null);
    setMatch((m) => lockArrangement(m));
  }

  function onNextHand() {
    setMatch((m) => revealNextHand(m));
  }

  function onDealNext() {
    setMatch((m) => nextRound(m));
  }

  function onClose() {
    if (matchRef.current.phase === 'matchOver') onFinish(matchRef.current);
    else onSuspend(matchRef.current);
  }

  // Android back button behaves like the close (✕) button.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  });

  const humanHands = [0, 1, 2, 3].map((h) => handOf(match.layouts[HUMAN_SEAT] ?? [], h));
  const humanSpare = match.layouts[HUMAN_SEAT]?.[SPARE_INDEX];

  return (
    <View style={styles.flex}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={onClose} accessibilityLabel="Close game">
          <Text style={styles.iconText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.roundBox}>
          <Text style={styles.roundLabel}>ROUND</Text>
          <Text style={styles.roundValue}>
            {match.round} / {match.rules.rounds}
          </Text>
        </View>
        {isHumanArranging ? (
          <View style={styles.timer}>
            <Text style={styles.timerText}>⏱ {match.secondsLeft}s</Text>
          </View>
        ) : (
          <View style={styles.timerPlaceholder} />
        )}
      </View>

      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        {seats.map((seat, i) => {
          const avatar = avatarById(seat.avatarId);
          return (
            <View key={i} style={styles.scoreSeat}>
              <AvatarBadge avatar={avatar} size={48} selected={i === HUMAN_SEAT} showName={false} />
              <Text style={styles.scoreName} numberOfLines={1}>
                {seat.name}
              </Text>
              <Text style={styles.scoreValue}>{match.totalPoints[i]}</Text>
            </View>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {isHumanArranging ? (
          <>
            <Text style={styles.hint}>Tap a card, then tap another card to swap them</Text>
            {humanHands.map((hand, h) => {
              const score = scoreHand(hand);
              return (
                <View key={h} style={styles.handRow}>
                  <View style={styles.handInfo}>
                    <Text style={styles.handTitle}>Hand {h + 1}</Text>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{CATEGORY_LABEL[score.category]}</Text>
                    </View>
                  </View>
                  <View style={styles.handCards}>
                    {hand.map((card, k) => {
                      const index = h * HAND_SIZE + k;
                      return (
                        <CardView
                          key={index}
                          card={card}
                          width={60}
                          selected={selected === index}
                          onPress={() => onTapCard(index)}
                        />
                      );
                    })}
                  </View>
                </View>
              );
            })}
            {humanSpare ? (
              <View style={[styles.handRow, styles.spareRow]}>
                <View style={styles.handInfo}>
                  <Text style={styles.handTitle}>Spare</Text>
                  <Text style={styles.spareSub}>Breaks ties</Text>
                </View>
                <CardView
                  card={humanSpare}
                  width={60}
                  selected={selected === SPARE_INDEX}
                  onPress={() => onTapCard(SPARE_INDEX)}
                />
              </View>
            ) : null}
          </>
        ) : (
          <RevealView match={match} />
        )}
      </ScrollView>

      {/* Bottom actions */}
      {isHumanArranging ? (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.secondaryButton} onPress={onSuggest} accessibilityRole="button">
            <Text style={styles.secondaryText}>✨ Suggest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={onShowCards} accessibilityRole="button">
            <Text style={styles.primaryText}>Show cards</Text>
          </TouchableOpacity>
        </View>
      ) : match.phase === 'reveal' ? (
        <View style={styles.bottomBarSingle}>
          <TouchableOpacity style={styles.primaryButton} onPress={onNextHand} accessibilityRole="button">
            <Text style={styles.primaryText}>
              {match.revealed === 0 ? 'Reveal hand 1' : `Next hand`}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Round result */}
      <Modal visible={match.phase === 'roundOver'} transparent animationType="slide">
        <View style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Round {match.round} done</Text>
            {seats.map((seat, i) => (
              <View key={i} style={styles.resultRow}>
                <AvatarBadge avatar={avatarById(seat.avatarId)} size={40} showName={false} />
                <Text style={styles.resultName}>{seat.name}</Text>
                <Text style={styles.resultGain}>+{match.roundPoints[i]}</Text>
                <Text style={styles.resultTotal}>{match.totalPoints[i]}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.primaryButton} onPress={onDealNext} accessibilityRole="button">
              <Text style={styles.primaryText}>
                {match.round >= match.rules.rounds ? 'See final result' : `Deal round ${match.round + 1}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Match result */}
      <Modal visible={match.phase === 'matchOver'} transparent animationType="fade">
        <Pressable style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{resultHeadline(match)}</Text>
            {seats.map((seat, i) => (
              <View key={i} style={styles.resultRow}>
                <AvatarBadge avatar={avatarById(seat.avatarId)} size={40} showName={false} />
                <Text style={styles.resultName}>{seat.name}</Text>
                <Text style={styles.resultTotal}>{match.totalPoints[i]} pts</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.primaryButton} onPress={() => onFinish(match)}>
              <Text style={styles.primaryText}>Back to home</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function resultHeadline(match: MatchState): string {
  const winners = matchWinners(match);
  if (winners.length > 1) return 'It’s a tie!';
  const w = winners[0];
  return w === HUMAN_SEAT ? 'You win the show!' : `${match.seats[w].name} wins the show`;
}

/** Shows each player's hand for the hand being revealed. */
function RevealView({ match }: { match: MatchState }) {
  const shown = Math.max(0, match.revealed - 1);
  const winners = match.handWinners[shown] ?? [];
  const started = match.revealed > 0;
  return (
    <View>
      <View style={styles.progressRow}>
        {Array.from({ length: HANDS_PER_ROUND }).map((_, i) => (
          <View
            key={i}
            style={[styles.progressBar, i < match.revealed && styles.progressFilled]}
          />
        ))}
      </View>
      <Text style={styles.handHeader}>
        Hand {started ? shown + 1 : 1} of {HANDS_PER_ROUND}
      </Text>
      {match.seats.map((seat, s) => {
        const hand = handOf(match.layouts[s], started ? shown : 0);
        const score = scoreHand(hand);
        const isWinner = started && winners.includes(s);
        return (
          <View key={s} style={[styles.revealRow, isWinner && styles.revealWinner]}>
            <AvatarBadge avatar={avatarById(seat.avatarId)} size={44} showName={false} />
            <View style={styles.revealInfo}>
              <Text style={styles.revealName}>{seat.name}</Text>
              {started ? <Text style={styles.revealCat}>{CATEGORY_LABEL[score.category]}</Text> : null}
            </View>
            <View style={styles.revealCards}>
              {hand.map((card, k) => (
                <CardView key={k} card={card} faceDown={!started} width={42} />
              ))}
            </View>
            <Text style={styles.revealPlus}>{isWinner ? '+1' : ''}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconText: { color: colors.text, fontSize: 18, fontWeight: '700' },
  roundBox: { flex: 1 },
  roundLabel: { color: colors.accent, fontWeight: '800', letterSpacing: 2, fontSize: 12 },
  roundValue: { color: colors.text, fontWeight: '800', fontSize: 22 },
  timer: {
    backgroundColor: '#3D2F16',
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  timerText: { color: colors.gold, fontWeight: '800', fontSize: 16 },
  timerPlaceholder: { width: 4 },
  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.tableGreen,
    borderRadius: radius.md,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreSeat: { alignItems: 'center', width: 76 },
  scoreName: { color: colors.text, fontSize: 12, marginTop: 4 },
  scoreValue: { color: colors.accent, fontWeight: '800', fontSize: 16, marginTop: 2 },
  body: { padding: 16, paddingBottom: 24 },
  hint: { color: colors.textMuted, textAlign: 'center', marginBottom: 12 },
  handRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  handInfo: { flex: 1 },
  handTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 6,
  },
  tagText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  handCards: { flexDirection: 'row', gap: 6 },
  spareRow: { backgroundColor: colors.spareBg, borderColor: '#5A4520' },
  spareSub: { color: colors.spareText, marginTop: 4 },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  progressBar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.surfaceAlt },
  progressFilled: { backgroundColor: colors.accent },
  handHeader: { color: colors.text, fontWeight: '800', fontSize: 20, textAlign: 'center', marginBottom: 12 },
  revealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  revealWinner: { borderColor: colors.accent, backgroundColor: '#3D2F16' },
  revealInfo: { flex: 1, marginLeft: 10 },
  revealName: { color: colors.text, fontWeight: '700' },
  revealCat: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  revealCards: { flexDirection: 'row', gap: 4 },
  revealPlus: { color: colors.gain, fontWeight: '800', fontSize: 16, width: 34, textAlign: 'right' },
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottomBarSingle: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryText: { color: colors.accentText, fontWeight: '800', fontSize: 16 },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryText: { color: colors.text, fontWeight: '700', fontSize: 16 },
  sheetWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  sheetTitle: { color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 12 },
  resultRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  resultName: { color: colors.text, fontWeight: '700', flex: 1, marginLeft: 12 },
  resultGain: { color: colors.gain, fontWeight: '800', marginRight: 16 },
  resultTotal: { color: colors.accent, fontWeight: '800', fontSize: 16 },
});
