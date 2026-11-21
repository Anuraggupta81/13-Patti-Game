import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { createMatch, HUMAN_SEAT, matchWinners } from './src/game/engine';
import { Difficulty, HouseRules, MatchState, PlayerSeat } from './src/game/types';
import {
  clearActiveGame,
  loadActiveGame,
  loadProfile,
  MatchRecord,
  Profile,
  saveActiveGame,
  saveProfile,
} from './src/storage';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { colors } from './src/theme';

type Screen = 'loading' | 'home' | 'game';

/** Stars earned for winning a match, by difficulty (from the mock-up: Easy 1, Medium 2, Hard 3). */
const STARS_FOR: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

/** The player is shown as "You". No name is asked for or stored. */
function buildSeats(avatarId: string): PlayerSeat[] {
  return [
    { name: 'You', avatarId, isHuman: true },
    { name: 'Shakti', avatarId: 'shakti', isHuman: false },
    { name: 'Shwaan', avatarId: 'shwaan', isHuman: false },
    { name: 'Mahabali', avatarId: 'mahabali', isHuman: false },
  ];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [game, setGame] = useState<MatchState | null>(null);

  // On launch: load progress, then offer to continue any unsaved game.
  useEffect(() => {
    (async () => {
      const loaded = await loadProfile();
      setProfile(loaded);
      setScreen('home');
      offerUnsavedGame();
    })();
  }, []);

  /**
   * If a game was left in progress, ask whether to continue it from the same
   * position. "Start new" discards the saved game.
   */
  function offerUnsavedGame() {
    loadActiveGame().then((saved) => {
      if (!saved) return;
      Alert.alert(
        'Unsaved game',
        'You have an unfinished game. Do you want to continue playing it from where you left off?',
        [
          { text: 'Start new', style: 'destructive', onPress: () => clearActiveGame() },
          {
            text: 'Continue',
            onPress: () => {
              setGame(saved.match);
              setScreen('game');
            },
          },
        ],
        { cancelable: false },
      );
    });
  }

  /** Play Now: if an unsaved game exists, ask first; otherwise start fresh. */
  async function startMatch(rules: HouseRules) {
    if (!profile) return;
    const saved = await loadActiveGame();
    const startFresh = () => {
      clearActiveGame();
      setGame(createMatch(rules, buildSeats(profile.avatarId), Math.random));
      setScreen('game');
    };
    if (saved) {
      Alert.alert(
        'Unsaved game',
        'You have an unfinished game. Do you want to continue it instead of starting a new one?',
        [
          { text: 'Start new', style: 'destructive', onPress: startFresh },
          {
            text: 'Continue',
            onPress: () => {
              setGame(saved.match);
              setScreen('game');
            },
          },
        ],
        { cancelable: false },
      );
      return;
    }
    startFresh();
  }

  /** Leave the table and keep the match for later. */
  function suspendGame(match: MatchState) {
    saveActiveGame(match);
    setGame(null);
    setScreen('home');
  }

  /** Match ended: record progress and history, then clear the saved game. */
  async function finishGame(match: MatchState) {
    if (!profile) return;
    const winners = matchWinners(match);
    const humanWon = winners.includes(HUMAN_SEAT);
    const tied = humanWon && winners.length > 1;
    const difficulty = match.rules.difficulty;
    const record: MatchRecord = {
      finishedAt: new Date().toISOString(),
      rounds: match.rules.rounds,
      points: match.totalPoints[HUMAN_SEAT],
      placed: tied ? 'tied' : humanWon ? 'won' : 'lost',
      difficulty,
    };
    const updated: Profile = {
      ...profile,
      played: profile.played + 1,
      won: profile.won + (humanWon ? 1 : 0),
      totalPoints: profile.totalPoints + match.totalPoints[HUMAN_SEAT],
      stars: profile.stars + (humanWon ? STARS_FOR[difficulty] : 0),
      history: [...profile.history, record].slice(-100),
    };
    await saveProfile(updated);
    await clearActiveGame();
    setProfile(updated);
    setGame(null);
    setScreen('home');
  }

  /** Shows the new avatar only once it is saved. If saving fails, the old one stays. */
  async function changeAvatar(avatarId: string): Promise<boolean> {
    if (!profile) return false;
    const updated = { ...profile, avatarId };
    const saved = await saveProfile(updated);
    if (saved) setProfile(updated);
    else Alert.alert('Could not save', 'Could not save your avatar. Please try again.');
    return saved;
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      {screen === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      )}
      {screen === 'home' && profile && (
        <HomeScreen profile={profile} onStart={startMatch} onChangeAvatar={changeAvatar} />
      )}
      {screen === 'game' && profile && game && (
        <GameScreen
          initialMatch={game}
          onSuspend={suspendGame}
          onFinish={finishGame}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
