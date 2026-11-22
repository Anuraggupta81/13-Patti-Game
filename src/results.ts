import { HouseRules, MatchState } from './game/types';

export interface Standing {
  seat: number;
  name: string;
  points: number;
  /** 1 for the leader. Tied players share a position. */
  position: number;
  /** Points behind the leader. 0 for the leader. */
  behind: number;
}

/** Standings sorted by total points, highest first. Ties share a position. */
export function standings(match: MatchState): Standing[] {
  const ranked = match.seats
    .map((s, seat) => ({ seat, name: s.name, points: match.totalPoints[seat] }))
    .sort((a, b) => b.points - a.points || a.seat - b.seat);
  const top = ranked[0]?.points ?? 0;
  let position = 0;
  let lastPoints: number | null = null;
  return ranked.map((row, i) => {
    if (row.points !== lastPoints) {
      position = i + 1;
      lastPoints = row.points;
    }
    return { ...row, position, behind: top - row.points };
  });
}

const ORDINAL: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };

/** Plain-language result for the player, e.g. "You're 2nd, 2 points behind the leader." */
export function playerSummary(match: MatchState, humanSeat = 0): string {
  const rows = standings(match);
  const me = rows.find((r) => r.seat === humanSeat);
  if (!me) return '';
  if (me.behind === 0) {
    const tied = rows.filter((r) => r.position === me.position).length > 1;
    return tied ? "You're tied for the lead." : "You're in the lead.";
  }
  const points = me.behind === 1 ? '1 point' : `${me.behind} points`;
  return `You're ${ORDINAL[me.position] ?? `${me.position}th`}, ${points} behind the leader.`;
}

/**
 * Personal recap for the round, with one tip (review deck, slide 11 and 15).
 * Counts the hands the human player won.
 */
export function roundRecap(match: MatchState, humanSeat = 0): { recap: string; tip: string } {
  const won = match.handWinners.filter((w) => w.includes(humanSeat)).length;
  const total = match.handWinners.length;
  const recap = `You won ${won} of ${total} hands this round.`;
  const tip =
    won === 0
      ? 'Tip: keep pairs and sequences together in your strongest hands. Try Suggest.'
      : won === 1
        ? 'Tip: your weakest hand lost. Use Undo to compare arrangements before you show.'
        : won === 2
          ? 'Tip: a higher spare card breaks ties, so keep your best spare in mind.'
          : 'Great round. Keep the same strategy.';
  return { recap, tip };
}

/** One-line summary of house rules, e.g. "5 rounds · No timer · Sweep +3 · Medium". */
export function rulesSummary(rules: HouseRules): string {
  const timer = rules.arrangeSeconds === 0 ? 'No timer' : `${rules.arrangeSeconds}s to arrange`;
  const sweep = rules.sweepBonus === 0 ? 'Sweep off' : `Sweep +${rules.sweepBonus}`;
  const level = rules.difficulty.charAt(0).toUpperCase() + rules.difficulty.slice(1);
  return `${rules.rounds} rounds · ${timer} · ${sweep} · ${level}`;
}
