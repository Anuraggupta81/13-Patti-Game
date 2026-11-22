import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createMatch, HUMAN_SEAT, matchWinners } from './src/game/engine';
import { Difficulty, HouseRules, MatchState, PlayerSeat } from './src/game/types';
import {
  clearActiveGame,
  loadActiveGame,
  loadConsent,
  loadProfile,
  MatchRecord,
  Profile,
  saveActiveGame,
  saveConsent,
  saveProfile,
  DEFAULT_PROFILE,
  resetProgress,
} from './src/storage';
import {
  Consent,
  needsAgeConfirmation,
  needsLegalAcceptance,
  NO_CONSENT,
  withAdultConfirmed,
  withLegalAccepted,
} from './src/legal/consent';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { LegalConsentScreen } from './src/screens/LegalConsentScreen';
import { AgeGateScreen } from './src/screens/AgeGateScreen';
import { colors } from './src/theme';
import { RIVALS } from './src/avatars';
import { DEFAULT_DISPLAY, DisplayContext } from './src/display';
import { PrefKey } from './src/components/SettingsSheet';

type Screen = 'loading' | 'legal' | 'age' | 'setup' | 'home' | 'game';

/** Stars earned for winning a match, by difficulty (from the mock-up: Easy 1, Medium 2, Hard 3). */
const STARS_FOR: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

/** The player's seat uses their chosen character name. */
function buildSeats(profile: Profile): PlayerSeat[] {
  return [
    { name: profile.characterName, avatarId: profile.avatarId, isHuman: true },
    ...RIVALS.map((r) => ({ name: r.name, avatarId: r.avatarId, isHuman: false })),
  ];
}

/**
 * First-launch order: Privacy Notice and Terms (once per legal version),
 * then the over-18 check (once), then the character setup (once).
 * After that the player goes straight to the home screen.
 */
function firstScreenFor(consent: Consent, profile: Profile): Screen {
  if (needsLegalAcceptance(consent)) return 'legal';
  if (needsAgeConfirmation(consent)) return 'age';
  if (!profile.characterName) return 'setup';
  return 'home';
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [setupMode, setSetupMode] = useState<'first' | 'edit'>('first');
  const [consent, setConsent] = useState<Consent>(NO_CONSENT);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [game, setGame] = useState<MatchState | null>(null);

  // On launch: load consent and progress, then show the first screen that is still needed.
  useEffect(() => {
    (async () => {
      const [loadedConsent, loadedProfile] = await Promise.all([loadConsent(), loadProfile()]);
      const current = loadedConsent ?? NO_CONSENT;
      setConsent(current);
      setProfile(loadedProfile);
      setSetupMode('first');
      const next = firstScreenFor(current, loadedProfile);
      setScreen(next);
      if (next === 'home') offerUnsavedGame();
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

  /** Player accepted the Privacy Notice and Terms. Saved once per legal version. */
  async function acceptLegal() {
    const updated = withLegalAccepted(consent, new Date());
    const saved = await saveConsent(updated);
    if (!saved) {
      Alert.alert('Could not save', 'Could not save your choice. Please try again.');
      return;
    }
    setConsent(updated);
    setScreen(firstScreenFor(updated, profile!));
  }

  /** Player confirmed they are over 18. Saved once. */
  async function confirmOver18() {
    const updated = withAdultConfirmed(consent, new Date());
    const saved = await saveConsent(updated);
    if (!saved) {
      Alert.alert('Could not save', 'Could not save your choice. Please try again.');
      return;
    }
    setConsent(updated);
    setScreen(firstScreenFor(updated, profile!));
  }

  /** Play Now: if an unsaved game exists, ask first; otherwise start fresh. */
  async function startMatch(rules: HouseRules) {
    if (!profile) return;
    const saved = await loadActiveGame();
    const startFresh = () => {
      clearActiveGame();
      // Remember the rules, so the home screen can show them next time.
      saveProfile({ ...profile, lastRules: rules }).then((ok) => ok && setProfile({ ...profile, lastRules: rules }));
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

  /** Asks first, because reset cannot be undone. */
  function askResetProgress() {
    Alert.alert(
      'Reset progress?',
      'This closes any game in progress and clears your stats, stars, history, saved game and character. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: confirmReset },
      ],
      { cancelable: true },
    );
  }

  /** Clears the game in progress and all progress, then starts again from character setup. */
  async function confirmReset() {
    const ok = await resetProgress();
    if (!ok) {
      Alert.alert('Could not reset', 'Could not reset your progress. Please try again.');
      return;
    }
    setProfile(DEFAULT_PROFILE);
    setGame(null);
    setSetupMode('first');
    setScreen('setup');
  }

  /** Saves one setting (sound, display or feedback) to the device profile. */
  async function setPref(key: PrefKey | 'soundOn', on: boolean) {
    if (!profile) return;
    const updated: Profile = { ...profile, [key]: on };
    const saved = await saveProfile(updated);
    if (saved) setProfile(updated);
    else Alert.alert('Could not save', 'Could not save your setting. Please try again.');
  }

  const setSound = (on: boolean) => setPref('soundOn', on);

  const display = profile
    ? { fourColour: profile.fourColour, largeCards: profile.largeCards, hapticsOn: profile.hapticsOn }
    : DEFAULT_DISPLAY;

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
    setScreen('home');
    if (setupMode === 'first') offerUnsavedGame();
  }

  return (
    <SafeAreaProvider>
      <DisplayContext.Provider value={display}>
      <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar style="light" />
        {screen === 'loading' && (
          <View style={styles.center}>
            <ActivityIndicator color={colors.accent} size="large" />
          </View>
        )}
        {screen === 'legal' && <LegalConsentScreen onAccept={acceptLegal} />}
        {screen === 'age' && <AgeGateScreen onOver18={confirmOver18} />}
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
            soundOn={profile.soundOn}
            onToggleSound={setSound}
            onResetProgress={askResetProgress}
            onPref={setPref}
            onStart={startMatch}
            onEditCharacter={() => {
              setSetupMode('edit');
              setScreen('setup');
            }}
          />
        )}
        {screen === 'game' && profile && game && (
          <GameScreen
            initialMatch={game}
            soundOn={profile.soundOn}
            onToggleSound={setSound}
            autoAdvance={profile.autoAdvance}
            hapticsOn={profile.hapticsOn}
            onSuspend={suspendGame}
            onFinish={finishGame}
          />
        )}
      </SafeAreaView>
      </DisplayContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
