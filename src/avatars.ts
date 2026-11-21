export interface Avatar {
  id: string;
  name: string;
  /** Placeholder glyph until the artwork is added. */
  glyph: string;
  color: string;
  /** Stars needed to unlock. 0 = available from the start. */
  unlockStars: number;
}

export const AVATARS: Avatar[] = [
  { id: 'billu', name: 'Billu', glyph: '🐱', color: '#8FD3C9', unlockStars: 0 },
  { id: 'chintu', name: 'Chintu', glyph: '🐭', color: '#F2D7B0', unlockStars: 0 },
  { id: 'sheru', name: 'Sheru', glyph: '🐶', color: '#F5CD6B', unlockStars: 0 },
  { id: 'naagveer', name: 'Naag Veer', glyph: '🐍', color: '#3FA37A', unlockStars: 0 },
  { id: 'shwaan', name: 'Shwaan', glyph: '🦇', color: '#C9703F', unlockStars: 0 },
  { id: 'mahabali', name: 'Mahabali', glyph: '👑', color: '#E8B04A', unlockStars: 0 },
  { id: 'shakti', name: 'Shakti', glyph: '🔱', color: '#7FB8E8', unlockStars: 0 },
  { id: 'duck', name: '???', glyph: '🦆', color: '#4A3A1E', unlockStars: 3 },
  { id: 'elephant', name: '???', glyph: '🐘', color: '#4A3A1E', unlockStars: 6 },
  { id: 'owl', name: '???', glyph: '🦉', color: '#4A3A1E', unlockStars: 9 },
  { id: 'bird', name: '???', glyph: '🐦', color: '#4A3A1E', unlockStars: 12 },
  { id: 'fire', name: '???', glyph: '🔥', color: '#4A3A1E', unlockStars: 15 },
  { id: 'storm', name: '???', glyph: '⛈️', color: '#4A3A1E', unlockStars: 18 },
];

export function avatarById(id: string): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

export function isAvatarUnlocked(avatar: Avatar, stars: number): boolean {
  return stars >= avatar.unlockStars;
}
