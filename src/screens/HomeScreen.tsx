import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AVATARS, avatarById, isAvatarUnlocked } from '../avatars';
import { Profile } from '../storage';
import { DEFAULT_RULES, Difficulty, HouseRules } from '../game/types';
import { colors, radius } from '../theme';
import { AvatarBadge } from '../components/AvatarBadge';
import { ChoiceRow } from '../components/ChoiceRow';
import { RULES_TEXT } from '../rulesText';

interface Props {
  profile: Profile;
  onStart: (rules: HouseRules) => void;
  onChangeAvatar: (avatarId: string) => void;
}

export function HomeScreen({ profile, onStart, onChangeAvatar }: Props) {
  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHouse, setShowHouse] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);
  const [rules, setRules] = useState<HouseRules>(DEFAULT_RULES);

  const avatar = avatarById(profile.avatarId);
  const winRate = profile.played ? Math.round((profile.won / profile.played) * 100) : 0;
  const nextLocked = AVATARS.find((a) => !isAvatarUnlocked(a, profile.stars));

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowAvatars(true)}
          accessibilityRole="button"
          accessibilityLabel="Change avatar"
        >
          <AvatarBadge avatar={avatar} size={56} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.muted}>Welcome back</Text>
          <Text style={styles.name}>You</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCards}>
          {['A', 'A', 'A'].map((r, i) => (
            <View
              key={i}
              style={[styles.heroCard, { transform: [{ rotate: `${(i - 1) * 12}deg` }] }]}
            >
              <Text style={[styles.heroRank, { color: i === 1 ? colors.red : '#111' }]}>{r}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.title}>13 Patti</Text>
        <Text style={styles.heroText}>
          You vs 3 cartoon rivals. Split 13 cards into four 3-card hands and win the show.
        </Text>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setShowHouse(true)}
          accessibilityRole="button"
        >
          <Text style={styles.playText}>▶  Play Now</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.section}>Your record</Text>
      <View style={styles.statRow}>
        <Stat label="Played" value={profile.played} />
        <Stat label="Won" value={profile.won} />
        <Stat label="Win rate" value={`${winRate}%`} />
      </View>

      <View style={styles.pointsCard}>
        <Text style={styles.pointsLabel}>★  Total points</Text>
        <Text style={styles.pointsValue}>{profile.totalPoints}</Text>
      </View>

      <View style={styles.starsCard}>
        <View style={styles.starsTop}>
          <Text style={styles.starsLabel}>★  Stars</Text>
          <Text style={styles.starsValue}>{profile.stars}</Text>
        </View>
        {nextLocked ? (
          <View style={styles.nextRow}>
            <AvatarBadge avatar={nextLocked} size={40} locked />
            <Text style={styles.nextText}>
              Next avatar at {nextLocked.unlockStars} stars
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.secondary} onPress={() => setShowRules(true)} accessibilityRole="button">
          <Text style={styles.secondaryText}>Rules</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondary} onPress={() => setShowHistory(true)} accessibilityRole="button">
          <Text style={styles.secondaryText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* House rules sheet */}
      <Modal visible={showHouse} transparent animationType="slide" onRequestClose={() => setShowHouse(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowHouse(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>House rules</Text>
          <Text style={styles.muted}>Set up this match your way</Text>

          <ChoiceRow
            label="Rounds"
            options={[3, 5, 7, 10]}
            value={rules.rounds}
            format={(v) => String(v)}
            onChange={(rounds) => setRules({ ...rules, rounds: rounds as HouseRules['rounds'] })}
          />
          <ChoiceRow
            label="Time to arrange"
            options={[45, 60, 90, 120]}
            value={rules.arrangeSeconds}
            format={(v) => `${v}s`}
            onChange={(arrangeSeconds) =>
              setRules({ ...rules, arrangeSeconds: arrangeSeconds as HouseRules['arrangeSeconds'] })
            }
          />
          <ChoiceRow
            label="Sweep bonus (win all 4 hands)"
            options={[0, 3, 5]}
            value={rules.sweepBonus}
            format={(v) => (v === 0 ? 'Off' : `+${v}`)}
            onChange={(sweepBonus) => setRules({ ...rules, sweepBonus: sweepBonus as HouseRules['sweepBonus'] })}
          />
          <ChoiceRow
            label="Computer players"
            options={['easy', 'medium', 'hard'] as Difficulty[]}
            value={rules.difficulty}
            format={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
            onChange={(difficulty) => setRules({ ...rules, difficulty })}
          />

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              setShowHouse(false);
              onStart(rules);
            }}
            accessibilityRole="button"
          >
            <Text style={styles.startText}>▶  Start match</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Avatar picker */}
      <Modal visible={showAvatars} transparent animationType="slide" onRequestClose={() => setShowAvatars(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowAvatars(false)} />
        <View style={[styles.sheet, { maxHeight: '80%' }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Pick your avatar</Text>
          <Text style={styles.muted}>Win matches to earn stars. Stars unlock new avatars.</Text>
          <ScrollView>
            <View style={styles.avatarGrid}>
              {AVATARS.map((a) => {
                const unlocked = isAvatarUnlocked(a, profile.stars);
                return (
                  <View key={a.id} style={styles.avatarCell}>
                    <AvatarBadge
                      avatar={a}
                      locked={!unlocked}
                      selected={profile.avatarId === a.id}
                      onPress={
                        unlocked
                          ? () => {
                              onChangeAvatar(a.id);
                              setShowAvatars(false);
                            }
                          : undefined
                      }
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Rules */}
      <Modal visible={showRules} transparent animationType="slide" onRequestClose={() => setShowRules(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowRules(false)} />
        <View style={[styles.sheet, { maxHeight: '80%' }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>How to play</Text>
          <ScrollView>
            <Text style={styles.body}>{RULES_TEXT}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.startButton} onPress={() => setShowRules(false)} accessibilityRole="button">
            <Text style={styles.startText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* History */}
      <Modal visible={showHistory} transparent animationType="slide" onRequestClose={() => setShowHistory(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowHistory(false)} />
        <View style={[styles.sheet, { maxHeight: '80%' }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Match history</Text>
          <ScrollView>
            {profile.history.length === 0 ? (
              <Text style={styles.body}>No finished matches yet.</Text>
            ) : (
              profile.history
                .slice()
                .reverse()
                .map((m, i) => (
                  <View key={i} style={styles.historyRow}>
                    <Text style={styles.historyText}>
                      {new Date(m.finishedAt).toLocaleDateString()} · {m.rounds} rounds · {m.difficulty}
                    </Text>
                    <Text style={[styles.historyResult, { color: m.placed === 'won' ? colors.gain : colors.red }]}>
                      {m.placed === 'won' ? 'Won' : m.placed === 'tied' ? 'Tied' : 'Lost'} · {m.points} pts
                    </Text>
                  </View>
                ))
            )}
          </ScrollView>
          <TouchableOpacity style={styles.startButton} onPress={() => setShowHistory(false)} accessibilityRole="button">
            <Text style={styles.startText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16, paddingTop: 48, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  muted: { color: colors.textMuted, fontSize: 13 },
  name: { color: colors.text, fontSize: 22, fontWeight: '800' },
  hero: {
    backgroundColor: colors.tableGreen,
    borderRadius: radius.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroCards: { flexDirection: 'row', height: 90, alignItems: 'center', marginBottom: 8 },
  heroCard: {
    width: 56,
    height: 80,
    backgroundColor: colors.cardFace,
    borderRadius: 8,
    marginHorizontal: -8,
    padding: 6,
  },
  heroRank: { fontSize: 18, fontWeight: '800' },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 4 },
  heroText: { color: colors.textMuted, textAlign: 'center', marginTop: 6, marginBottom: 16, lineHeight: 20 },
  playButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  playText: { color: colors.accentText, fontWeight: '800', fontSize: 17 },
  section: { color: colors.text, fontWeight: '700', fontSize: 16, marginTop: 22, marginBottom: 10 },
  statRow: { flexDirection: 'row', gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '800' },
  pointsCard: {
    marginTop: 12,
    backgroundColor: '#3D2F16',
    borderRadius: radius.md,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointsLabel: { color: colors.gold, fontWeight: '700', fontSize: 16 },
  pointsValue: { color: colors.gain, fontWeight: '800', fontSize: 18 },
  starsCard: {
    marginTop: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  starsTop: { flexDirection: 'row', justifyContent: 'space-between' },
  starsLabel: { color: colors.text, fontWeight: '700', fontSize: 16 },
  starsValue: { color: colors.accent, fontWeight: '800', fontSize: 18 },
  nextRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  nextText: { color: colors.textMuted, marginLeft: 12, flex: 1 },
  bottomRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  secondary: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: { color: colors.text, fontWeight: '700', fontSize: 16 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: 14,
  },
  sheetTitle: { color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  body: { color: colors.text, lineHeight: 22, fontSize: 15, paddingVertical: 8 },
  startButton: {
    marginTop: 16,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  startText: { color: colors.accentText, fontWeight: '800', fontSize: 17 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  avatarCell: { width: '25%', alignItems: 'center', paddingVertical: 8 },
  historyRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  historyText: { color: colors.text },
  historyResult: { fontWeight: '700', marginTop: 2 },
});
