import React from 'react';
import { Modal, Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '../theme';

interface Props {
  visible: boolean;
  soundOn: boolean;
  onToggleSound: (on: boolean) => void;
  onEditCharacter: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onClose: () => void;
}

/** Settings opened from the gear button on the home screen. */
export function SettingsSheet({
  visible,
  soundOn,
  onToggleSound,
  onEditCharacter,
  onOpenPrivacy,
  onOpenTerms,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close settings" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title} accessibilityRole="header">
          Settings
        </Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Sound</Text>
          <Switch
            value={soundOn}
            onValueChange={onToggleSound}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor="#FFFFFF"
            accessibilityRole="switch"
            accessibilityLabel="Sound"
            accessibilityState={{ checked: soundOn }}
          />
        </View>

        <Item label="Edit character" onPress={onEditCharacter} />
        <Item label="Privacy Notice" onPress={onOpenPrivacy} />
        <Item label="Terms of Use" onPress={onOpenTerms} />

        <TouchableOpacity style={styles.close} onPress={onClose} accessibilityRole="button">
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function Item({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} accessibilityRole="button">
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: 14,
  },
  title: { color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { color: colors.text, fontSize: 16, fontWeight: '600' },
  arrow: { color: colors.accent, fontSize: 22, fontWeight: '800' },
  close: {
    marginTop: 18,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
  },
  closeText: { color: colors.accentText, fontWeight: '800', fontSize: 16 },
});
