import { cardName } from './game/cards';
import { createMatch, tickTimer } from './game/engine';
import { DEFAULT_RULES, MatchState, PlayerSeat } from './game/types';
import { nicknameOrDefault, DEFAULT_NICKNAME } from './characterName';
import { playerSummary, standings } from './results';

const SEATS: PlayerSeat[] = [
  { name: 'You', avatarId: 'fox', isHuman: true },
  { name: 'Maya', avatarId: 'unicorn', isHuman: false },
  { name: 'Ravi', avatarId: 'tiger', isHuman: false },
  { name: 'Kabir', avatarId: 'king', isHuman: false },
];

function matchWithPoints(points: number[]): MatchState {
  const m = createMatch(DEFAULT_RULES, SEATS, () => 0.5);
  return { ...m, totalPoints: points };
}

describe('no timer', () => {
  it('is the default, so the timer never runs out', () => {
    expect(DEFAULT_RULES.arrangeSeconds).toBe(0);
    const m = createMatch(DEFAULT_RULES, SEATS, () => 0.5);
    const r = tickTimer(m, 1000);
    expect(r.expired).toBe(false);
    expect(r.state.secondsLeft).toBe(0);
  });

  it('still counts down when a timer is chosen', () => {
    const m = createMatch({ ...DEFAULT_RULES, arrangeSeconds: 45 }, SEATS, () => 0.5);
    const r = tickTimer(m, 10);
    expect(r.state.secondsLeft).toBe(35);
    expect(r.expired).toBe(false);
  });
});

describe('card names for screen readers', () => {
  it('speaks the rank and suit', () => {
    expect(cardName({ rank: 12, suit: 'S' })).toBe('Queen of spades');
    expect(cardName({ rank: 5, suit: 'C' })).toBe('Five of clubs');
    expect(cardName({ rank: 14, suit: 'H' })).toBe('Ace of hearts');
  });
});

describe('nickname is optional', () => {
  it('uses the typed nickname', () => {
    expect(nicknameOrDefault('  Anu  ')).toBe('Anu');
  });

  it('uses the default when left blank', () => {
    expect(nicknameOrDefault('')).toBe(DEFAULT_NICKNAME);
    expect(nicknameOrDefault('   ')).toBe('Player');
  });
});

describe('standings and summary', () => {
  it('sorts by points, highest first, with positions', () => {
    const rows = standings(matchWithPoints([3, 7, 5, 0]));
    expect(rows.map((r) => r.name)).toEqual(['Maya', 'Ravi', 'You', 'Kabir']);
    expect(rows.map((r) => r.position)).toEqual([1, 2, 3, 4]);
    expect(rows[0].behind).toBe(0);
    expect(rows[2].behind).toBe(4);
  });

  it('shares a position on a tie', () => {
    const rows = standings(matchWithPoints([5, 5, 2, 1]));
    expect(rows.map((r) => r.position)).toEqual([1, 1, 3, 4]);
  });

  it('tells the player their place and the gap', () => {
    expect(playerSummary(matchWithPoints([2, 5, 1, 0]))).toBe("You're 2nd, 3 points behind the leader.");
    expect(playerSummary(matchWithPoints([4, 5, 1, 0]))).toBe("You're 2nd, 1 point behind the leader.");
  });

  it('says when the player leads or is tied for the lead', () => {
    expect(playerSummary(matchWithPoints([9, 5, 1, 0]))).toBe("You're in the lead.");
    expect(playerSummary(matchWithPoints([5, 5, 1, 0]))).toBe("You're tied for the lead.");
  });
});
