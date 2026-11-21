import { Card } from './types';

/** Hand categories, higher is stronger. */
export const CATEGORY = {
  HIGH_CARD: 0,
  PAIR: 1,
  COLOR: 2,
  SEQUENCE: 3,
  PURE_SEQUENCE: 4,
  TRAIL: 5,
} as const;

export const CATEGORY_LABEL: Record<number, string> = {
  0: 'High Card',
  1: 'Pair',
  2: 'Color',
  3: 'Sequence',
  4: 'Pure Sequence',
  5: 'Trail',
};

export interface HandScore {
  category: number;
  /** Tie-break values, most significant first. */
  tiebreak: number[];
}

/** Returns the sequence top card for a 3-card run, or 0 if not a run. A-2-3 is the lowest run (top = 3). */
function sequenceTop(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted[0] + 1 === sorted[1] && sorted[1] + 1 === sorted[2]) return sorted[2];
  // A-2-3 wraps: 14 is treated as 1
  const wrapped = sorted.map((v) => (v === 14 ? 1 : v)).sort((a, b) => a - b);
  if (wrapped[0] + 1 === wrapped[1] && wrapped[1] + 1 === wrapped[2]) return wrapped[2];
  return 0;
}

/** Score a 3-card hand. */
export function scoreHand(cards: Card[]): HandScore {
  if (cards.length !== 3) throw new Error('A hand must have exactly 3 cards');
  const values = cards.map((c) => c.rank);
  const sortedDesc = [...values].sort((a, b) => b - a);
  const flush = cards[0].suit === cards[1].suit && cards[1].suit === cards[2].suit;
  const seqTop = sequenceTop(values);

  if (values[0] === values[1] && values[1] === values[2]) {
    return { category: CATEGORY.TRAIL, tiebreak: [values[0]] };
  }
  if (seqTop && flush) {
    return { category: CATEGORY.PURE_SEQUENCE, tiebreak: [seqTop] };
  }
  if (seqTop) {
    return { category: CATEGORY.SEQUENCE, tiebreak: [seqTop] };
  }
  if (flush) {
    return { category: CATEGORY.COLOR, tiebreak: sortedDesc };
  }
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const pair = [...counts.entries()].find(([, n]) => n === 2);
  if (pair) {
    const kicker = [...counts.entries()].find(([, n]) => n === 1)![0];
    return { category: CATEGORY.PAIR, tiebreak: [pair[0], kicker] };
  }
  return { category: CATEGORY.HIGH_CARD, tiebreak: sortedDesc };
}

/** Compare two scores. >0 if a beats b, <0 if b beats a, 0 if equal. */
export function compareScores(a: HandScore, b: HandScore): number {
  if (a.category !== b.category) return a.category - b.category;
  const len = Math.max(a.tiebreak.length, b.tiebreak.length);
  for (let i = 0; i < len; i++) {
    const diff = (a.tiebreak[i] ?? 0) - (b.tiebreak[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/**
 * Single number that orders hands the same way as compareScores.
 * Used by the computer to maximise its arrangement.
 */
export function strengthValue(score: HandScore): number {
  let value = score.category * 1e8;
  for (let i = 0; i < 3; i++) {
    value += (score.tiebreak[i] ?? 0) * Math.pow(256, 2 - i);
  }
  return value;
}
