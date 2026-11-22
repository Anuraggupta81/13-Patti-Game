import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LegalDocument, PRIVACY_NOTICE, TERMS_OF_USE } from '../legal/content';
import { colors, radius } from '../theme';
import { LegalDocView } from '../components/LegalDocView';

interface Props {
  onAccept: () => void;
}

/** First-launch screen: the player reads the Privacy Notice and Terms, then confirms once. */
export function LegalConsentScreen({ onAccept }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [reading, setReading] = useState<LegalDocument | null>(null);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.brand}>13 PATTI</Text>
      <Text style={styles.title} accessibilityRole="header">
        Before you play
      </Text>
      <Text style={styles.body}>
        Please read our Privacy Notice and Terms of Use. You only need to confirm this once.
      </Text>

      <TouchableOpacity
        style={styles.docButton}
        onPress={() => setReading(PRIVACY_NOTICE)}
        accessibilityRole="button"
        accessibilityHint="Opens the full Privacy Notice"
      >
        <Text style={styles.docText}>Read the Privacy Notice</Text>
        <Text style={styles.docArrow}>›</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.docButton}
        onPress={() => setReading(TERMS_OF_USE)}
        accessibilityRole="button"
        accessibilityHint="Opens the full Terms of Use"
      >
        <Text style={styles.docText}>Read the Terms of Use</Text>
        <Text style={styles.docArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkRow}
        onPress={() => setAgreed((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agreed }}
        accessibilityLabel="I have read and agree to the Privacy Notice and Terms of Use"
      >
        <View style={[styles.box, agreed && styles.boxChecked]}>
          {agreed ? <Text style={styles.tick}>✓</Text> : null}
        </View>
        <Text style={styles.checkText}>
          I have read and agree to the Privacy Notice and Terms of Use.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.primary, !agreed && styles.disabled]}
        onPress={onAccept}
        disabled={!agreed}
        accessibilityRole="button"
        accessibilityState={{ disabled: !agreed }}
      >
        <Text style={styles.primaryText}>Accept & Continue</Text>
      </TouchableOpacity>

      <LegalDocView doc={reading} onClose={() => setReading(null)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16, paddingBottom: 32 },
  brand: { color: colors.accent, letterSpacing: 3, fontWeight: '700', fontSize: 14 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 6 },
  body: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 16 },
  docButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
  },
  docText: { color: colors.text, fontWeight: '700', fontSize: 16, flex: 1 },
  docArrow: { color: colors.accent, fontSize: 24, fontWeight: '800' },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14, paddingVertical: 6 },
  box: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  boxChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  tick: { color: colors.accentText, fontWeight: '900', fontSize: 18 },
  checkText: { color: colors.text, fontSize: 15, flex: 1, lineHeight: 21 },
  primary: {
    marginTop: 20,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabled: { opacity: 0.4 },
  primaryText: { color: colors.accentText, fontWeight: '800', fontSize: 17 },
});
