import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '../theme';

interface Props<T extends string | number> {
  label: string;
  options: T[];
  value: T;
  format: (v: T) => string;
  onChange: (v: T) => void;
}

/** Segmented row of options, e.g. Rounds: 3 | 5 | 7 | 10. */
export function ChoiceRow<T extends string | number>({ label, options, value, format, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((opt) => {
          const active = opt === value;
          return (
            <TouchableOpacity
              key={String(opt)}
              style={[styles.option, active && styles.active]}
              onPress={() => onChange(opt)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.text, active && styles.activeText]}>{format(opt)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 14 },
  label: { color: colors.text, fontWeight: '700', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    padding: 4,
  },
  option: { flex: 1, paddingVertical: 10, borderRadius: radius.pill, alignItems: 'center' },
  active: { backgroundColor: colors.accent },
  text: { color: colors.textMuted, fontWeight: '600' },
  activeText: { color: colors.accentText, fontWeight: '800' },
});
