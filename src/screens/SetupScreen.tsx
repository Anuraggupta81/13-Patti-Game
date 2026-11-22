import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { AVATARS, avatarById, isAvatarUnlocked } from '../avatars';
import { avatarGridLayout } from '../layout';
import { CHARACTER_NAME_MAX, checkCharacterName } from '../characterName';
import { colors, radius } from '../theme';
import { AvatarBadge } from '../components/AvatarBadge';

interface Props {
  /** Shown on first launch (no cancel) or when editing from the home screen. */
  mode: 'first' | 'edit';
  initialName: string;
  initialAvatarId: string;
  stars: number;
  onSave: (name: string, avatarId: string) => void;
  onCancel?: () => void;
}

export function SetupScreen({ mode, initialName, initialAvatarId, stars, onSave, onCancel }: Props) {
  const [name, setName] = useState(initialName);
  const [avatarId, setAvatarId] = useState(initialAvatarId);
  const [error, setError] = useState<string | null>(null);

  const check = checkCharacterName(name);
  const selected = avatarById(avatarId);
  const { width: windowWidth } = useWindowDimensions();
  const grid = avatarGridLayout(windowWidth);

  function save() {
    const result = checkCharacterName(name);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSave(result.name, avatarId);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>13 PATTI</Text>
        <Text style={styles.title} accessibilityRole="header">
          {mode === 'first' ? "Who's playing today?" : 'Edit your character'}
        </Text>

        <Text style={styles.label}>Character name</Text>
        <TextInput
          style={styles.input}
          placeholder="Type a name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={(t) => {
            setName(t);
            setError(null);
          }}
          maxLength={CHARACTER_NAME_MAX}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={save}
          accessibilityLabel="Character name"
          accessibilityHint={`Up to ${CHARACTER_NAME_MAX} characters. This name is shown at the table.`}
        />
        <Text style={styles.hint}>
          {name.length}/{CHARACTER_NAME_MAX} characters. This is a game name, not a login.
        </Text>

        <Text style={styles.label}>Pick your character</Text>
        <View style={styles.grid}>
          {AVATARS.map((avatar) => {
            const unlocked = isAvatarUnlocked(avatar, stars);
            return (
              <View key={avatar.id} style={[styles.avatarCell, { width: grid.cellWidth }]}>
                <AvatarBadge
                  avatar={avatar}
                  size={grid.size}
                  labelWidth={grid.cellWidth}
                  locked={!unlocked}
                  selected={avatarId === avatar.id}
                  onPress={unlocked ? () => setAvatarId(avatar.id) : undefined}
                />
              </View>
            );
          })}
        </View>
        <Text style={styles.hint}>
          Chosen: {selected.name}. Win matches to earn stars and unlock more characters.
        </Text>

        {error ? (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.primary, !check.ok && styles.disabled]}
          onPress={save}
          disabled={!check.ok}
          accessibilityRole="button"
          accessibilityState={{ disabled: !check.ok }}
        >
          <Text style={styles.primaryText}>{mode === 'first' ? 'Save & Continue' : 'Save'}</Text>
        </TouchableOpacity>

        {mode === 'edit' && onCancel ? (
          <TouchableOpacity style={styles.secondary} onPress={onCancel} accessibilityRole="button">
            <Text style={styles.secondaryText}>Cancel</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16, paddingTop: 16, paddingBottom: 32 },
  brand: { color: colors.accent, letterSpacing: 3, fontWeight: '700', fontSize: 14 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 6, marginBottom: 12 },
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
  hint: { color: colors.textMuted, fontSize: 14, marginTop: 8, lineHeight: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  avatarCell: { alignItems: 'center', paddingVertical: 8 },
  error: { color: colors.error, marginTop: 12, fontWeight: '600' },
  primary: {
    marginTop: 20,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabled: { opacity: 0.4 },
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
