import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
import { SetupScreen } from './src/screens/SetupScreen';
import { colors } from './src/theme';

type Screen = 'loading' | 'setup' | 'home' | 'game';

/** Stars earned for winning a match, by difficulty (from the mock-up: Easy 1, Medium 2, Hard 3). */
const STARS_FOR: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

/** The player's seat uses their chosen character name. */
function buildSeats(profile: Profile): PlayerSeat[] {
  return [
    { name: profile.characterName, avatarId: profile.avatarId, isHuman: true },
    { name: 'Shakti', avatarId: 'shakti', isHuman: false },
    { name: 'Shwaan', avatarId: 'shwaan', isHuman: false },
    { name: 'Mahabali', avatarId: 'mahabali', isHuman: false },
  ];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [setupMode, setSetupMode] = useState<'first' | 'edit'>('first');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [game, setGame] = useState<MatchState | null>(null);

  // On launch: load progress. First launch goes to setup; otherwise offer any unsaved game.
  useEffect(() => {
    (async () => {
      const loaded = await loadProfile();
      setProfile(loaded);
      if (!loaded.characterName) {
        setSetupMode('first');
        setScreen('setup');
        return;
      }
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
      setGame(createMatch(rules, buildSeats(profile), Math.random));
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

  /** Saves the character name and avatar. The new values show only once saved. */
  async function saveCharacter(characterName: string, avatarId: string) {
    if (!profile) return;
    const updated: Profile = { ...profile, characterName, avatarId };
    const saved = await saveProfile(updated);
    if (!saved) {
      Alert.alert('Could not save', 'Could not save your character. Please try again.');
      return;
    }
    setProfile(updated);
    if (setupMode === 'first') {
      setScreen('home');
      offerUnsavedGame();
    } else {
      setScreen('home');
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar style="light" />
        {screen === 'loading' && (
          <View style={styles.center}>
            <ActivityIndicator color={colors.accent} size="large" />
          </View>
        )}
        {screen === 'setup' && profile && (
          <SetupScreen
            mode={setupMode}
            initialName={profile.characterName}
            initialAvatarId={profile.avatarId}
            stars={profile.stars}
            onSave={saveCharacter}
            onCancel={() => setScreen('home')}
          />
        )}
        {screen === 'home' && profile && (
          <HomeScreen
            profile={profile}
            onStart={startMatch}
            onEditCharacter={() => {
              setSetupMode('edit');
              setScreen('setup');
            }}
          />
        )}
        {screen === 'game' && profile && game && (
          <GameScreen initialMatch={game} onSuspend={suspendGame} onFinish={finishGame} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
