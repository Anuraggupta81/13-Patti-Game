import { shuffle } from './cards';
import { scoreHand, strengthValue } from './evaluate';
import { Card, Difficulty, HAND_SIZE, HANDS_PER_ROUND } from './types';

/** Total strength of a 13-card layout: the sum over the 4 hands. */
export function layoutStrength(layout: Card[]): number {
  let total = 0;
  for (let h = 0; h < HANDS_PER_ROUND; h++) {
    const hand = layout.slice(h * HAND_SIZE, h * HAND_SIZE + HAND_SIZE);
    total += strengthValue(scoreHand(hand));
  }
  return total;
}

/** Hill-climb: keep swapping any two cards while it improves the layout. */
function hillClimb(layout: Card[]): Card[] {
  let best = [...layout];
  let bestValue = layoutStrength(best);
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < best.length; i++) {
      for (let j = i + 1; j < best.length; j++) {
        [best[i], best[j]] = [best[j], best[i]];
        const value = layoutStrength(best);
        if (value > bestValue) {
          bestValue = value;
          improved = true;
        } else {
          [best[i], best[j]] = [best[j], best[i]];
        }
      }
    }
  }
  return best;
}

function bestOfRandom(cards: Card[], samples: number, random: () => number): Card[] {
  let best = shuffle(cards, random);
  let bestValue = layoutStrength(best);
  for (let s = 1; s < samples; s++) {
    const candidate = shuffle(cards, random);
    const value = layoutStrength(candidate);
    if (value > bestValue) {
      best = candidate;
      bestValue = value;
    }
  }
  return best;
}

/**
 * Arrange 13 cards into 4 hands of 3 plus a spare.
 * easy   - random arrangement
 * medium - best of 300 random arrangements
 * hard   - best of 3000 random arrangements, then hill-climbed
 */
export function arrangeCards(
  cards: Card[],
  difficulty: Difficulty,
  random: () => number = Math.random,
): Card[] {
  switch (difficulty) {
    case 'easy':
      return shuffle(cards, random);
    case 'medium':
      return bestOfRandom(cards, 300, random);
    case 'hard':
      return hillClimb(bestOfRandom(cards, 3000, random));
  }
}
