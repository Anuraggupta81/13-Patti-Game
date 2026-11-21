import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { createMatch, HUMAN_SEAT, matchWinners } from './src/game/engine';
import { Difficulty, HouseRules, MatchState, PlayerSeat } from './src/game/types';
import {
  Account,
  clearActiveGame,
  getSessionUser,
  loadActiveGame,
  logout,
  MatchRecord,
  saveActiveGame,
  updateAccount,
} from './src/storage';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { colors } from './src/theme';

type Screen = 'loading' | 'login' | 'home' | 'game';

/** Stars earned for winning a match, by difficulty (from the mock-up: Easy 1, Medium 2, Hard 3). */
const STARS_FOR: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

function buildSeats(account: Account): PlayerSeat[] {
  const names = ['Shakti', 'Shwaan', 'Mahabali'];
  const rivals = ['shakti', 'shwaan', 'mahabali'];
  return [
    { name: account.username, avatarId: account.avatarId, isHuman: true },
    ...names.map((name, i) => ({ name, avatarId: rivals[i], isHuman: false })),
  ];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [account, setAccount] = useState<Account | null>(null);
  const [game, setGame] = useState<MatchState | null>(null);

  // Restore the logged-in session on launch.
  useEffect(() => {
    (async () => {
      const user = await getSessionUser();
      if (!user) {
        setScreen('login');
        return;
      }
      setAccount(user);
      setScreen('home');
      offerUnsavedGame(user);
    })();
  }, []);

  /**
   * If the player left a game in progress, ask whether to continue it from the
   * same position. "Start new" discards the saved game.
   */
  function offerUnsavedGame(user: Account) {
    loadActiveGame().then((saved) => {
      if (!saved || saved.owner !== user.username.toLowerCase()) return;
      Alert.alert(
        'Unsaved game',
        'You have an unfinished game. Do you want to continue playing it from where you left off?',
        [
          {
            text: 'Start new',
            style: 'destructive',
            onPress: () => {
              clearActiveGame();
            },
          },
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

  function onLoggedIn(user: Account) {
    setAccount(user);
    setScreen('home');
    offerUnsavedGame(user);
  }

  /** Play Now: if an unsaved game exists, ask first; otherwise start fresh. */
  async function startMatch(rules: HouseRules) {
    if (!account) return;
    const saved = await loadActiveGame();
    const startFresh = () => {
      clearActiveGame();
      setGame(createMatch(rules, buildSeats(account), Math.random));
      setScreen('game');
    };
    if (saved && saved.owner === account.username.toLowerCase()) {
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
    if (account) saveActiveGame(account.username, match);
    setGame(null);
    setScreen('home');
  }

  /** Match ended: record stats and history, then clear the saved game. */
  async function finishGame(match: MatchState) {
    if (!account) return;
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
    const updated: Account = {
      ...account,
      played: account.played + 1,
      won: account.won + (humanWon ? 1 : 0),
      totalPoints: account.totalPoints + match.totalPoints[HUMAN_SEAT],
      stars: account.stars + (humanWon ? STARS_FOR[difficulty] : 0),
      history: [...account.history, record].slice(-100),
    };
    await updateAccount(updated);
    await clearActiveGame();
    setAccount(updated);
    setGame(null);
    setScreen('home');
  }

  async function onLogout() {
    await logout();
    await clearActiveGame();
    setAccount(null);
    setGame(null);
    setScreen('login');
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      {screen === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      )}
      {screen === 'login' && <LoginScreen onLoggedIn={onLoggedIn} />}
      {screen === 'home' && account && (
        <HomeScreen account={account} onStart={startMatch} onLogout={onLogout} />
      )}
      {screen === 'game' && account && game && (
        <GameScreen
          account={account}
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
