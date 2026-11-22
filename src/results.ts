import { MatchState } from './game/types';

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
