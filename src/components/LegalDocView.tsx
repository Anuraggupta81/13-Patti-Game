import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LegalDocument } from '../legal/content';
import { colors, radius } from '../theme';

interface Props {
  doc: LegalDocument | null;
  onClose: () => void;
}

/** Full-screen, scrollable reader for the Privacy Notice or Terms of Use. */
export function LegalDocView({ doc, onClose }: Props) {
  return (
    <Modal visible={doc !== null} animationType="slide" onRequestClose={onClose}>
      {doc ? (
        <View style={styles.flex}>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.close}
              accessibilityRole="button"
              accessibilityLabel={`Close ${doc.title}`}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.body} accessibilityLabel={`${doc.title} text`}>
            <Text style={styles.title} accessibilityRole="header">
              {doc.title}
            </Text>
            <Text style={styles.subtitle}>{doc.subtitle}</Text>
            <Text style={styles.meta}>{doc.effective}</Text>
            {doc.intro.map((p, i) => (
              <Text key={`intro-${i}`} style={styles.para}>
                {p}
              </Text>
            ))}
            {doc.sections.map((s, i) => (
              <View key={`section-${i}`} style={styles.section}>
                <Text style={styles.heading} accessibilityRole="header">
                  {s.heading}
                </Text>
                {(s.paragraphs ?? []).map((p, j) => (
                  <Text key={`p-${j}`} style={styles.para}>
                    {p}
                  </Text>
                ))}
                {(s.bullets ?? []).map((b, j) => (
                  <Text key={`b-${j}`} style={styles.bullet}>
                    • {b}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16 },
  close: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  closeText: { color: colors.text, fontWeight: '700' },
  body: { paddingHorizontal: 16, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: colors.accent, fontWeight: '700', marginTop: 2 },
  meta: { color: colors.textMuted, fontSize: 14, marginTop: 4, marginBottom: 12 },
  section: { marginTop: 16 },
  heading: { color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 6 },
  para: { color: colors.text, fontSize: 15, lineHeight: 22, marginTop: 6 },
  bullet: { color: colors.text, fontSize: 15, lineHeight: 22, marginTop: 4, paddingLeft: 8 },
});
