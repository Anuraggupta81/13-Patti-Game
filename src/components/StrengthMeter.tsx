import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORY_LABEL } from '../game/evaluate';
import { colors } from '../theme';

export const STRENGTH_MAX = 5;

/** Five segments; filled up to the hand's category (High Card 0 ... Trail 5). */
export function StrengthMeter({ category }: { category: number }) {
  const filled = Math.min(category, STRENGTH_MAX);
  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityLabel={`Strength ${filled} of ${STRENGTH_MAX}, ${CATEGORY_LABEL[category]}`}
    >
      {Array.from({ length: STRENGTH_MAX }).map((_, i) => (
        <View key={i} style={[styles.segment, i < filled && styles.filled]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 3, marginTop: 6 },
  segment: { width: 14, height: 6, borderRadius: 3, backgroundColor: colors.surfaceAlt },
  filled: { backgroundColor: colors.accent },
});
