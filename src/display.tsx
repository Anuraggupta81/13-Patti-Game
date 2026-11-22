import { createContext, useContext } from 'react';
import * as Haptics from 'expo-haptics';
import { Card } from './game/types';
import { isRed } from './game/cards';
import { colors } from './theme';

/** Display and feedback choices from Settings, shared across the app. */
export interface DisplaySettings {
  fourColour: boolean;
  largeCards: boolean;
  hapticsOn: boolean;
}

export const DEFAULT_DISPLAY: DisplaySettings = { fourColour: false, largeCards: false, hapticsOn: true };

export const DisplayContext = createContext<DisplaySettings>(DEFAULT_DISPLAY);

export function useDisplay(): DisplaySettings {
  return useContext(DisplayContext);
}

/**
 * Suit colour. Standard: red hearts and diamonds, black spades and clubs.
 * Four-colour deck: spades black, hearts red, diamonds blue, clubs green (review deck, slide 14).
 */
export function suitColour(card: Card, fourColour: boolean): string {
  if (!fourColour) return isRed(card) ? colors.red : '#111';
  switch (card.suit) {
    case 'H':
      return colors.red;
    case 'D':
      return '#1E63C8';
    case 'C':
      return '#1E8E3E';
    default:
      return '#111';
  }
}

/** Short haptic tap, e.g. on a swap. Does nothing when haptics are off. */
export function hapticTap(on: boolean): void {
  if (!on) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Success buzz, e.g. when the player wins a hand. Does nothing when haptics are off. */
export function hapticWin(on: boolean): void {
  if (!on) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
