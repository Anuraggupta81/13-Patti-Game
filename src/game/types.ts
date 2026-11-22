export type Suit = 'S' | 'H' | 'D' | 'C';

/** rank: 2..14 where 11=J, 12=Q, 13=K, 14=A */
export interface Card {
  rank: number;
  suit: Suit;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface HouseRules {
  rounds: 3 | 5 | 7 | 10;
  /** 0 = no timer. */
  arrangeSeconds: 0 | 45 | 60 | 90 | 120;
  sweepBonus: 0 | 3 | 5;
  difficulty: Difficulty;
}

export const DEFAULT_RULES: HouseRules = {
  rounds: 5,
  arrangeSeconds: 0,
  sweepBonus: 3,
  difficulty: 'medium',
};

export interface PlayerSeat {
  name: string;
  avatarId: string;
  isHuman: boolean;
}

export type Phase = 'arrange' | 'reveal' | 'roundOver' | 'matchOver';

/**
 * Full, JSON-serialisable state of one match. Saved to storage after every
 * change so the game can be resumed exactly where it was left.
 */
export interface MatchState {
  rules: HouseRules;
  seats: PlayerSeat[];
  round: number; // 1-based
  phase: Phase;
  /** layouts[seat] = 13 cards: indices 0-2 hand 1, 3-5 hand 2, 6-8 hand 3, 9-11 hand 4, 12 spare */
  layouts: Card[][];
  /** Hands revealed so far this round (0..4). */
  revealed: number;
  /** Points won by each seat in the current round. */
  roundPoints: number[];
  /** Total points across the match. */
  totalPoints: number[];
  /** Seconds left on the arrange timer. */
  secondsLeft: number;
  /** For each revealed hand index, the winning seat indexes (ties share). */
  handWinners: number[][];
  /** Whether each seat won every hand in the round. */
  swept: boolean[];
}

export const HANDS_PER_ROUND = 4;
export const HAND_SIZE = 3;
export const CARDS_PER_PLAYER = 13;
export const SPARE_INDEX = 12;
