import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { rankLabel, SUIT_SYMBOL } from '../game/cards';
import { Card } from '../game/types';
import { useDisplay, suitColour } from '../display';
import { colors } from '../theme';

interface Props {
  card?: Card;
  faceDown?: boolean;
  selected?: boolean;
  dimmed?: boolean;
  onPress?: () => void;
  width?: number;
}

export function CardView({ card, faceDown, selected, dimmed, onPress, width: baseWidth = 64 }: Props) {
  const { fourColour, largeCards } = useDisplay();
  // "Larger cards" setting makes every card 20% wider (review deck, slide 14).
  const width = Math.round(baseWidth * (largeCards ? 1.2 : 1));
  const height = Math.round(width * 1.4);
  const body = faceDown || !card ? (
    <View style={[styles.card, styles.back, { width, height }]} />
  ) : (
    <View
      style={[
        styles.card,
        { width, height },
        selected && styles.selected,
        dimmed && styles.dimmed,
      ]}
    >
      <Text style={[styles.rank, { color: suitColour(card, fourColour) }]}>
        {rankLabel(card.rank)}
      </Text>
      <Text style={[styles.suit, { color: suitColour(card, fourColour) }]}>
        {SUIT_SYMBOL[card.suit]}
      </Text>
    </View>
  );

  const label = faceDown || !card
    ? 'Face-down card'
    : `${rankName(card.rank)} of ${SUIT_NAME[card.suit]}`;

  if (!onPress) return <View accessible accessibilityLabel={label}>{body}</View>;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${label}${selected ? ', selected' : ''}`}
      accessibilityHint="Tap to select, then tap another card to swap"
    >
      {body}
    </TouchableOpacity>
  );
}

const SUIT_NAME: Record<string, string> = { S: 'spades', H: 'hearts', D: 'diamonds', C: 'clubs' };
const RANK_NAME: Record<number, string> = { 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' };
function rankName(rank: number): string {
  return RANK_NAME[rank] ?? String(rank);
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardFace,
    borderRadius: 8,
    padding: 5,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D8D8D8',
  },
  back: {
    backgroundColor: colors.cardBack,
    borderColor: '#3A5F98',
  },
  selected: {
    borderColor: colors.accent,
    borderWidth: 3,
    transform: [{ translateY: -6 }],
  },
  dimmed: {
    opacity: 0.45,
  },
  rank: {
    fontSize: 16,
    fontWeight: '800',
  },
  suit: {
    fontSize: 22,
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },
});
