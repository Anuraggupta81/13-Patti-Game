import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../avatars';
import { colors } from '../theme';

interface Props {
  avatar: Avatar;
  size?: number;
  locked?: boolean;
  selected?: boolean;
  /** Show the avatar's own name under the circle. Turn off where the screen already shows a name. */
  showName?: boolean;
  /** Width available for the name. Defaults to the circle plus some room. */
  labelWidth?: number;
  onPress?: () => void;
}

export function AvatarBadge({
  avatar,
  size = 64,
  locked,
  selected,
  showName = true,
  labelWidth,
  onPress,
}: Props) {
  const width = labelWidth ?? Math.max(size, 80);
  const body = (
    // Height is not fixed, so the name below the circle is never cut off.
    <View style={[styles.wrap, { width }]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: locked ? colors.lockedBg : avatar.color,
          },
          selected && styles.selected,
        ]}
      >
        <Text style={{ fontSize: size * 0.45 }}>{locked ? '🔒' : avatar.glyph}</Text>
      </View>
      {showName ? (
        <Text
          style={[styles.name, { maxWidth: width }, selected && { color: colors.accent }]}
          numberOfLines={2}
          textBreakStrategy="simple"
        >
          {locked ? '???' : avatar.name}
        </Text>
      ) : null}
    </View>
  );
  const label = locked ? 'Locked avatar' : `${avatar.name} avatar`;
  if (!onPress) return <View accessible accessibilityLabel={label}>{body}</View>;
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}${selected ? ', selected' : ''}`}
    >
      {body}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  circle: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.border },
  selected: { borderColor: colors.accent, borderWidth: 3 },
  name: { color: colors.textMuted, fontSize: 14, marginTop: 4, textAlign: 'center' },
});
