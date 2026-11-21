import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AVATARS, isAvatarUnlocked } from '../avatars';
import { loginOrCreate, Account } from '../storage';
import { colors, radius } from '../theme';
import { AvatarBadge } from '../components/AvatarBadge';

interface Props {
  onLoggedIn: (account: Account) => void;
}

export function LoginScreen({ onLoggedIn }: Props) {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [avatarId, setAvatarId] = useState(AVATARS[0].id);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = username.trim().length >= 2 && /^\d{4}$/.test(pin) && !busy;

  async function submit() {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      const result = await loginOrCreate(username, pin, avatarId);
      if (result.ok) onLoggedIn(result.account);
      else setError(result.error);
    } catch {
      setError('Could not log in. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>13 PATTI</Text>
        <Text style={styles.title}>Who's playing today?</Text>

        <Text style={styles.label}>Your name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={colors.textMuted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="words"
          maxLength={20}
        />

        <Text style={styles.label}>4-digit PIN</Text>
        <TextInput
          style={styles.input}
          placeholder="••••"
          placeholderTextColor={colors.textMuted}
          value={pin}
          onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 4))}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
        />

        <Text style={styles.hint}>
          New name? An account is created with this PIN. Existing name? Enter your PIN to log in.
        </Text>

        <Text style={styles.label}>Pick your avatar</Text>
        <View style={styles.grid}>
          {AVATARS.map((avatar) => {
            const unlocked = isAvatarUnlocked(avatar, 0);
            return (
              <View key={avatar.id} style={styles.avatarCell}>
                <AvatarBadge
                  avatar={avatar}
                  locked={!unlocked}
                  selected={avatarId === avatar.id}
                  onPress={unlocked ? () => setAvatarId(avatar.id) : undefined}
                />
              </View>
            );
          })}
        </View>
        <Text style={styles.hint}>Win matches to earn stars. Stars unlock new avatars.</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          onPress={submit}
          disabled={!canSubmit}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{busy ? 'Please wait…' : 'Log in / Create'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16, paddingTop: 48, paddingBottom: 32 },
  brand: { color: colors.accent, letterSpacing: 3, fontWeight: '700', fontSize: 13 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 6, marginBottom: 20 },
  label: { color: colors.text, fontWeight: '700', fontSize: 15, marginTop: 14, marginBottom: 8 },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
  },
  hint: { color: colors.textMuted, fontSize: 13, marginTop: 8, lineHeight: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  avatarCell: { width: '25%', alignItems: 'center', paddingVertical: 6 },
  error: { color: colors.red, marginTop: 12, fontWeight: '600' },
  button: {
    marginTop: 24,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: colors.accentText, fontWeight: '800', fontSize: 17 },
});
