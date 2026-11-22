/**
 * Wording for screen-reader announcements (TalkBack). Kept in one place so the
 * text can be tested and reviewed.
 */

/** Timer warnings at 30, 10 and 5 seconds left (AX-10). */
export const TIMER_WARNINGS = [30, 10, 5];

export function timerAnnouncement(secondsLeft: number): string | null {
  return TIMER_WARNINGS.includes(secondsLeft) ? `${secondsLeft} seconds left to arrange.` : null;
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** Result of one hand (AX-12). `winners` are the names of the winning players. */
export function handAnnouncement(hand: number, totalHands: number, winners: string[]): string {
  const prefix = `Hand ${hand} of ${totalHands}.`;
  if (winners.length === 0) return `${prefix} No winner.`;
  if (winners.length === 1) return `${prefix} ${winners[0]} wins this hand.`;
  return `${prefix} ${joinNames(winners)} tie for this hand.`;
}

export function roundAnnouncement(round: number): string {
  return `Round ${round} done.`;
}

export function swapAnnouncement(): string {
  return 'Cards swapped.';
}
