import { layoutStrength, orderLayout } from './arrange';
import { makeDeck, shuffle } from './cards';
import { scoreHand, strengthValue } from './evaluate';
import { Card, HAND_SIZE, SPARE_INDEX } from './types';

function handStrength(layout: Card[], h: number): number {
  return strengthValue(scoreHand(layout.slice(h * HAND_SIZE, h * HAND_SIZE + HAND_SIZE)));
}

describe('orderLayout (Suggest ordering)', () => {
  const seeded = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
  };

  it('keeps the same 13 cards', () => {
    const cards = shuffle(makeDeck(), seeded(3)).slice(0, 13);
    const ordered = orderLayout(cards);
    const key = (c: Card) => `${c.rank}${c.suit}`;
    expect(ordered.map(key).sort()).toEqual(cards.map(key).sort());
  });

  it('puts the strongest hand first and the weakest hand last', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const cards = shuffle(makeDeck(), seeded(seed)).slice(0, 13);
      const ordered = orderLayout(cards);
      const strengths = [0, 1, 2, 3].map((h) => handStrength(ordered, h));
      const sorted = [...strengths].sort((a, b) => b - a);
      expect(strengths).toEqual(sorted);
    }
  });

  it('sorts the cards inside each hand from highest to lowest', () => {
    const cards = shuffle(makeDeck(), seeded(7)).slice(0, 13);
    const ordered = orderLayout(cards);
    for (let h = 0; h < 4; h++) {
      const ranks = ordered.slice(h * HAND_SIZE, h * HAND_SIZE + HAND_SIZE).map((c) => c.rank);
      expect(ranks).toEqual([...ranks].sort((a, b) => b - a));
    }
  });

  it('keeps the spare card last', () => {
    const cards = shuffle(makeDeck(), seeded(11)).slice(0, 13);
    const ordered = orderLayout(cards);
    expect(ordered[SPARE_INDEX]).toEqual(cards[SPARE_INDEX]);
  });

  it('does not lower the total strength of the layout', () => {
    const cards = shuffle(makeDeck(), seeded(5)).slice(0, 13);
    expect(layoutStrength(orderLayout(cards))).toBe(layoutStrength(cards));
  });
});
