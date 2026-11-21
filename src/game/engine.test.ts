import { arrangeCards, layoutStrength } from './arrange';
import { makeDeck } from './cards';
import { CATEGORY, compareScores, scoreHand } from './evaluate';
import {
  createMatch,
  handWinnersFor,
  lockArrangement,
  matchWinners,
  nextRound,
  revealNextHand,
  setHumanLayout,
  swapCards,
  tickTimer,
} from './engine';
import { Card, DEFAULT_RULES, PlayerSeat, Suit } from './types';

const c = (rank: number, suit: Suit = 'S'): Card => ({ rank, suit });
const SEATS: PlayerSeat[] = [
  { name: 'You', avatarId: 'billu', isHuman: true },
  { name: 'Shakti', avatarId: 'shakti', isHuman: false },
  { name: 'Shwaan', avatarId: 'shwaan', isHuman: false },
  { name: 'Mahabali', avatarId: 'mahabali', isHuman: false },
];

/** Seeded RNG so tests are deterministic. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe('scoreHand', () => {
  it('ranks categories in the correct order', () => {
    const trail = scoreHand([c(7, 'S'), c(7, 'H'), c(7, 'D')]);
    const pureSeq = scoreHand([c(5, 'H'), c(6, 'H'), c(7, 'H')]);
    const seq = scoreHand([c(5, 'H'), c(6, 'D'), c(7, 'H')]);
    const color = scoreHand([c(2, 'C'), c(9, 'C'), c(13, 'C')]);
    const pair = scoreHand([c(4, 'S'), c(4, 'H'), c(12, 'D')]);
    const high = scoreHand([c(2, 'S'), c(9, 'H'), c(13, 'D')]);
    expect([trail, pureSeq, seq, color, pair, high].map((h) => h.category)).toEqual([
      CATEGORY.TRAIL,
      CATEGORY.PURE_SEQUENCE,
      CATEGORY.SEQUENCE,
      CATEGORY.COLOR,
      CATEGORY.PAIR,
      CATEGORY.HIGH_CARD,
    ]);
    const ordered = [trail, pureSeq, seq, color, pair, high];
    for (let i = 0; i < ordered.length - 1; i++) {
      expect(compareScores(ordered[i], ordered[i + 1])).toBeGreaterThan(0);
    }
  });

  it('treats A-2-3 as the lowest sequence and Q-K-A as the highest', () => {
    const a23 = scoreHand([c(14, 'S'), c(2, 'H'), c(3, 'D')]);
    const qka = scoreHand([c(12, 'S'), c(13, 'H'), c(14, 'D')]);
    expect(a23.category).toBe(CATEGORY.SEQUENCE);
    expect(qka.category).toBe(CATEGORY.SEQUENCE);
    expect(compareScores(qka, a23)).toBeGreaterThan(0);
  });

  it('does not treat K-A-2 as a sequence', () => {
    expect(scoreHand([c(13, 'S'), c(14, 'H'), c(2, 'D')]).category).toBe(CATEGORY.HIGH_CARD);
  });

  it('compares pairs by pair value, then kicker', () => {
    const pairKings = scoreHand([c(13, 'S'), c(13, 'H'), c(2, 'D')]);
    const pairQueens = scoreHand([c(12, 'S'), c(12, 'H'), c(14, 'D')]);
    const pairKingsHigherKicker = scoreHand([c(13, 'C'), c(13, 'D'), c(3, 'S')]);
    expect(compareScores(pairKings, pairQueens)).toBeGreaterThan(0);
    expect(compareScores(pairKingsHigherKicker, pairKings)).toBeGreaterThan(0);
  });
});

describe('hand winners and spare tie-break', () => {
  it('awards the hand to the strongest hand at that position', () => {
    const layouts: Card[][] = [
      [c(2, 'S'), c(9, 'S'), c(4, 'S'), c(5, 'S'), c(6, 'S'), c(7, 'S'), c(8, 'S'), c(9, 'H'), c(10, 'S'), c(3, 'D'), c(3, 'C'), c(3, 'H'), c(5, 'C')],
      [c(4, 'S'), c(4, 'H'), c(4, 'D'), c(2, 'C'), c(2, 'H'), c(2, 'D'), c(6, 'C'), c(6, 'H'), c(6, 'D'), c(8, 'C'), c(8, 'H'), c(8, 'D'), c(14, 'C')],
      [c(13, 'S'), c(13, 'H'), c(9, 'D'), c(2, 'C'), c(5, 'H'), c(11, 'D'), c(7, 'C'), c(7, 'H'), c(14, 'D'), c(12, 'C'), c(12, 'H'), c(12, 'D'), c(10, 'C')],
      [c(3, 'S'), c(6, 'H'), c(11, 'D'), c(12, 'S'), c(9, 'H'), c(13, 'D'), c(4, 'C'), c(8, 'H'), c(14, 'S'), c(2, 'S'), c(5, 'S'), c(9, 'S'), c(11, 'C')],
    ];
    // Hand 0: seat 0 = colour (2,9,4 spades); seat 1 = trail of 4s; seat 2 = pair of kings;
    // seat 3 = high card. Trail beats everything -> seat 1.
    expect(handWinnersFor(layouts, 0)).toEqual([1]);
    // Hand 1: seat 0 = pure sequence 5-6-7 spades; seat 1 = trail of 2s -> seat 1 wins.
    expect(handWinnersFor(layouts, 1)).toEqual([1]);
  });

  it('uses the spare card to break an exact tie', () => {
    const base = [c(9, 'S'), c(4, 'H'), c(2, 'D')];
    const layoutA: Card[] = [...base, c(9, 'C'), c(4, 'D'), c(2, 'S'), c(3, 'S'), c(5, 'S'), c(13, 'S'), c(7, 'H'), c(8, 'D'), c(10, 'C'), c(14, 'C')];
    const layoutB: Card[] = [...base.map((x) => ({ ...x })), c(9, 'D'), c(4, 'C'), c(2, 'H'), c(3, 'H'), c(5, 'H'), c(13, 'H'), c(7, 'C'), c(8, 'C'), c(10, 'D'), c(6, 'C')];
    // Hand 0 is the same high-card hand for both; spare 14 (A) beats spare 6.
    expect(handWinnersFor([layoutA, layoutB], 0)).toEqual([0]);
  });
});

describe('match flow', () => {
  it('deals 13 cards to each of 4 players with no duplicates', () => {
    const state = createMatch(DEFAULT_RULES, SEATS, seeded(1));
    const all = state.layouts.flat();
    expect(state.layouts.map((l) => l.length)).toEqual([13, 13, 13, 13]);
    const keys = new Set(all.map((x) => `${x.rank}${x.suit}`));
    expect(keys.size).toBe(52);
  });

  it('gives each round 4 points in total before sweep bonus (one per hand)', () => {
    let state = createMatch({ ...DEFAULT_RULES, rounds: 3 }, SEATS, seeded(7));
    state = lockArrangement(state);
    for (let i = 0; i < 4; i++) state = revealNextHand(state);
    expect(state.phase).toBe('roundOver');
    const handPoints = state.roundPoints.reduce((a, b) => a + b, 0);
    const sweepExtra = state.swept.some(Boolean) ? DEFAULT_RULES.sweepBonus : 0;
    expect(handPoints - sweepExtra).toBe(4);
  });

  it('applies the sweep bonus when one player wins all 4 hands', () => {
    // Force seat 0 to be strongest in every hand by hand-building the layout.
    let state = createMatch({ ...DEFAULT_RULES, sweepBonus: 5 }, SEATS, seeded(3));
    const strong: Card[] = [
      c(14, 'S'), c(14, 'H'), c(14, 'D'), // trail of aces
      c(13, 'S'), c(13, 'H'), c(13, 'D'),
      c(12, 'S'), c(12, 'H'), c(12, 'D'),
      c(11, 'S'), c(11, 'H'), c(11, 'D'),
      c(2, 'C'),
    ];
    // Opponents: all low high-card hands.
    const weak = (offset: number): Card[] =>
      Array.from({ length: 13 }, (_, i) => c(2 + ((i + offset) % 7), i % 2 ? 'C' : 'D'));
    state = { ...state, layouts: [strong, weak(0), weak(1), weak(2)] };
    state = lockArrangement(state);
    for (let i = 0; i < 4; i++) state = revealNextHand(state);
    expect(state.swept).toEqual([true, false, false, false]);
    expect(state.roundPoints[0]).toBe(4 + 5);
  });

  it('plays a full match to matchOver and reports winners', () => {
    let state = createMatch({ ...DEFAULT_RULES, rounds: 3 }, SEATS, seeded(11));
    for (let r = 0; r < 3; r++) {
      state = lockArrangement(state);
      for (let i = 0; i < 4; i++) state = revealNextHand(state);
      state = nextRound(state, seeded(100 + r));
    }
    expect(state.phase).toBe('matchOver');
    expect(state.totalPoints.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(12);
    expect(matchWinners(state).length).toBeGreaterThanOrEqual(1);
  });

  it('lets the human swap cards only while arranging', () => {
    let state = createMatch(DEFAULT_RULES, SEATS, seeded(5));
    const before = state.layouts[0][0];
    state = swapCards(state, 0, 1);
    expect(state.layouts[0][1]).toEqual(before);
    state = lockArrangement(state);
    expect(swapCards(state, 0, 1)).toBe(state);
  });

  it('counts down the arrange timer and reports expiry', () => {
    const state = createMatch({ ...DEFAULT_RULES, arrangeSeconds: 45 }, SEATS, seeded(2));
    const first = tickTimer(state, 40);
    expect(first.state.secondsLeft).toBe(5);
    expect(first.expired).toBe(false);
    expect(tickTimer(first.state, 10).expired).toBe(true);
  });

  it('keeps the human layout when set by Suggest', () => {
    const state = createMatch(DEFAULT_RULES, SEATS, seeded(9));
    const suggested = arrangeCards(state.layouts[0], 'hard', seeded(4));
    const next = setHumanLayout(state, suggested);
    expect(next.layouts[0]).toEqual(suggested);
  });
});

describe('computer arrangement', () => {
  it('hard arrangements are at least as strong as easy ones on average', () => {
    const deck = makeDeck();
    let easy = 0;
    let hard = 0;
    for (let i = 0; i < 20; i++) {
      const hand = deck.slice(i, i + 13);
      easy += layoutStrength(arrangeCards(hand, 'easy', seeded(i)));
      hard += layoutStrength(arrangeCards(hand, 'hard', seeded(i)));
    }
    expect(hard).toBeGreaterThan(easy);
  });
});
