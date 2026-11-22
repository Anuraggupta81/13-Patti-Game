import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '../theme';

export const MINOR_MESSAGE = 'Minors are not allowed to play the game.';
export const CLOSE_AFTER_SECONDS = 3;

interface Props {
  onOver18: () => void;
  /** Called when the player says they are under 18, so the answer is remembered. */
  onUnder18?: () => void;
  /** The player already said they are under 18 on an earlier launch. */
  alreadyUnder18?: boolean;
  /** Closes the app. Injected so the behaviour can be tested. */
  onExit?: () => void;
}

/** First-launch screen: the player confirms they are 18 or over. */
export function AgeGateScreen({
  onOver18,
  onUnder18,
  alreadyUnder18 = false,
  onExit = () => BackHandler.exitApp(),
}: Props) {
  const [underAge, setUnderAge] = useState(alreadyUnder18);
  const [secondsLeft, setSecondsLeft] = useState(CLOSE_AFTER_SECONDS);

  // Under 18: count down, then close the app.
  useEffect(() => {
    if (!underAge) return;
    if (secondsLeft <= 0) {
      onExit();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [underAge, secondsLeft, onExit]);

  if (underAge) {
    return (
      <View style={styles.container} accessibilityLiveRegion="assertive">
        <Text style={styles.brand}>13 PATTI</Text>
        <Text style={styles.warning} accessibilityRole="alert">
          {MINOR_MESSAGE}
        </Text>
        <Text style={styles.body}>
          The app will close in {secondsLeft} second{secondsLeft === 1 ? '' : 's'}.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>13 PATTI</Text>
      <Text style={styles.title} accessibilityRole="header">
        Are you 18 or over?
      </Text>
      <Text style={styles.body}>
        This game is only for people aged 18 or over. Please confirm your age to continue.
      </Text>

      <TouchableOpacity
        style={styles.primary}
        onPress={onOver18}
        accessibilityRole="button"
        accessibilityLabel="I am over 18"
      >
        <Text style={styles.primaryText}>I am Over 18</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondary}
        onPress={() => {
          onUnder18?.();
          setUnderAge(true);
        }}
        accessibilityRole="button"
        accessibilityLabel="No, I am under 18"
      >
        <Text style={styles.secondaryText}>No, I am under 18</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: 'center' },
  brand: { color: colors.accent, letterSpacing: 3, fontWeight: '700', fontSize: 14 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 8 },
  body: { color: colors.textMuted, fontSize: 16, lineHeight: 23, marginTop: 12, marginBottom: 24 },
  warning: { color: colors.error, fontSize: 22, fontWeight: '800', marginTop: 12, lineHeight: 30 },
  primary: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryText: { color: colors.accentText, fontWeight: '800', fontSize: 17 },
  secondary: {
    marginTop: 12,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryText: { color: colors.text, fontWeight: '700', fontSize: 16 },
});
