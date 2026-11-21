import { arrangeCards } from './arrange';
import { makeDeck, shuffle } from './cards';
import { compareScores, scoreHand } from './evaluate';
import {
  Card,
  CARDS_PER_PLAYER,
  HAND_SIZE,
  HANDS_PER_ROUND,
  HouseRules,
  MatchState,
  PlayerSeat,
  SPARE_INDEX,
} from './types';

export const HUMAN_SEAT = 0;

type Random = () => number;

/** Deal a fresh round: 52 cards shuffled, 13 each, computers arrange their own hands. */
export function dealRound(state: MatchState, random: Random = Math.random): MatchState {
  const deck = shuffle(makeDeck(), random);
  const layouts: Card[][] = state.seats.map((seat, i) => {
    const cards = deck.slice(i * CARDS_PER_PLAYER, (i + 1) * CARDS_PER_PLAYER);
    return seat.isHuman ? cards : arrangeCards(cards, state.rules.difficulty, random);
  });
  return {
    ...state,
    phase: 'arrange',
    layouts,
    revealed: 0,
    roundPoints: state.seats.map(() => 0),
    handWinners: [],
    swept: state.seats.map(() => false),
    secondsLeft: state.rules.arrangeSeconds,
  };
}

export function createMatch(
  rules: HouseRules,
  seats: PlayerSeat[],
  random: Random = Math.random,
): MatchState {
  const empty: MatchState = {
    rules,
    seats,
    round: 1,
    phase: 'arrange',
    layouts: [],
    revealed: 0,
    roundPoints: seats.map(() => 0),
    totalPoints: seats.map(() => 0),
    secondsLeft: rules.arrangeSeconds,
    handWinners: [],
    swept: seats.map(() => false),
  };
  return dealRound(empty, random);
}

/** Swap two positions in the human player's layout. Only valid while arranging. */
export function swapCards(state: MatchState, a: number, b: number): MatchState {
  if (state.phase !== 'arrange' || a === b) return state;
  const layout = [...state.layouts[HUMAN_SEAT]];
  [layout[a], layout[b]] = [layout[b], layout[a]];
  const layouts = [...state.layouts];
  layouts[HUMAN_SEAT] = layout;
  return { ...state, layouts };
}

/** Replace the human layout (used by Suggest and by the timeout). */
export function setHumanLayout(state: MatchState, layout: Card[]): MatchState {
  if (state.phase !== 'arrange') return state;
  const layouts = [...state.layouts];
  layouts[HUMAN_SEAT] = layout;
  return { ...state, layouts };
}

/** Advance the arrange timer by `seconds`. Returns the state and whether time ran out. */
export function tickTimer(state: MatchState, seconds: number): { state: MatchState; expired: boolean } {
  if (state.phase !== 'arrange') return { state, expired: false };
  const secondsLeft = Math.max(0, state.secondsLeft - seconds);
  return { state: { ...state, secondsLeft }, expired: secondsLeft === 0 };
}

/** Lock the arrangement and start revealing hand by hand. */
export function lockArrangement(state: MatchState): MatchState {
  if (state.phase !== 'arrange') return state;
  return { ...state, phase: 'reveal', revealed: 0 };
}

/** Which seats hold the best hand at index h (ties share the win). */
export function handWinnersFor(layouts: Card[][], h: number): number[] {
  const scores = layouts.map((layout) =>
    scoreHand(layout.slice(h * HAND_SIZE, h * HAND_SIZE + HAND_SIZE)),
  );
  let best: number[] = [0];
  for (let i = 1; i < layouts.length; i++) {
    const cmp = compareScores(scores[i], scores[best[0]]);
    if (cmp > 0) best = [i];
    else if (cmp === 0) best.push(i);
  }
  if (best.length === 1) return best;
  // Spare card breaks ties between equal hands.
  const spareRank = (seat: number) => layouts[seat][SPARE_INDEX].rank;
  const top = Math.max(...best.map(spareRank));
  return best.filter((seat) => spareRank(seat) === top);
}

/** Reveal the next hand and award its point(s). Finishes the round after the 4th hand. */
export function revealNextHand(state: MatchState): MatchState {
  if (state.phase !== 'reveal' || state.revealed >= HANDS_PER_ROUND) return state;
  const h = state.revealed;
  const winners = handWinnersFor(state.layouts, h);
  const roundPoints = [...state.roundPoints];
  for (const seat of winners) roundPoints[seat] += 1;
  const next: MatchState = {
    ...state,
    revealed: h + 1,
    roundPoints,
    handWinners: [...state.handWinners, winners],
  };
  return next.revealed === HANDS_PER_ROUND ? finishRound(next) : next;
}

/** Apply sweep bonuses and move the totals on. */
function finishRound(state: MatchState): MatchState {
  const swept = state.seats.map((_, seat) =>
    state.handWinners.length === HANDS_PER_ROUND &&
    state.handWinners.every((w) => w.length === 1 && w[0] === seat),
  );
  const roundPoints = [...state.roundPoints];
  swept.forEach((isSweep, seat) => {
    if (isSweep) roundPoints[seat] += state.rules.sweepBonus;
  });
  const totalPoints = state.totalPoints.map((p, seat) => p + roundPoints[seat]);
  return { ...state, phase: 'roundOver', swept, roundPoints, totalPoints };
}

/** After a round: deal the next one, or end the match. */
export function nextRound(state: MatchState, random: Random = Math.random): MatchState {
  if (state.phase !== 'roundOver') return state;
  if (state.round >= state.rules.rounds) return { ...state, phase: 'matchOver' };
  return dealRound({ ...state, round: state.round + 1 }, random);
}

/** Winner seats of the whole match (ties share). */
export function matchWinners(state: MatchState): number[] {
  const best = Math.max(...state.totalPoints);
  return state.totalPoints.flatMap((p, seat) => (p === best ? [seat] : []));
}
