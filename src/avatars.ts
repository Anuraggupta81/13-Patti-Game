/**
 * Player characters. Names are generic English words and the artwork is
 * standard emoji (Unicode emoji are free to use). No characters or names from
 * existing films, comics, cartoons or brands are used.
 */

export interface Avatar {
  id: string;
  name: string;
  /** Emoji artwork. Replace with original artwork later if wanted. */
  glyph: string;
  color: string;
  /** Stars needed to unlock. 0 = available from the start. */
  unlockStars: number;
}

export const AVATARS: Avatar[] = [
  { id: 'fox', name: 'Fox', glyph: '🦊', color: '#F3B38A', unlockStars: 0 },
  { id: 'panda', name: 'Panda', glyph: '🐼', color: '#D6E4DA', unlockStars: 0 },
  { id: 'lion', name: 'Lion', glyph: '🦁', color: '#F5CD6B', unlockStars: 0 },
  { id: 'dragon', name: 'Dragon', glyph: '🐉', color: '#3FA37A', unlockStars: 0 },
  { id: 'tiger', name: 'Tiger', glyph: '🐯', color: '#E8A060', unlockStars: 0 },
  { id: 'king', name: 'King', glyph: '👑', color: '#E8B04A', unlockStars: 0 },
  { id: 'unicorn', name: 'Unicorn', glyph: '🦄', color: '#B9A7E8', unlockStars: 0 },
  { id: 'duck', name: 'Duck', glyph: '🦆', color: '#4A3A1E', unlockStars: 3 },
  { id: 'elephant', name: 'Elephant', glyph: '🐘', color: '#4A3A1E', unlockStars: 6 },
  { id: 'owl', name: 'Owl', glyph: '🦉', color: '#4A3A1E', unlockStars: 9 },
  { id: 'bird', name: 'Bird', glyph: '🐦', color: '#4A3A1E', unlockStars: 12 },
  { id: 'flame', name: 'Flame', glyph: '🔥', color: '#4A3A1E', unlockStars: 15 },
  { id: 'storm', name: 'Storm', glyph: '⛈️', color: '#4A3A1E', unlockStars: 18 },
];

export const DEFAULT_AVATAR_ID = 'fox';

/** Ids used by earlier versions of the app, mapped to the current ids. */
const LEGACY_AVATAR_IDS: Record<string, string> = {
  billu: 'fox',
  chintu: 'panda',
  sheru: 'lion',
  naagveer: 'dragon',
  shwaan: 'tiger',
  mahabali: 'king',
  shakti: 'unicorn',
};

/** Returns the current avatar id for a stored id (including old ids), or undefined. */
export function resolveAvatarId(stored: unknown): string | undefined {
  if (typeof stored !== 'string') return undefined;
  const id = LEGACY_AVATAR_IDS[stored] ?? stored;
  return AVATARS.some((a) => a.id === id) ? id : undefined;
}

export function avatarById(id: string): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

export function isAvatarUnlocked(avatar: Avatar, stars: number): boolean {
  return stars >= avatar.unlockStars;
}

/** The three computer rivals. Generic names and free artwork. */
export const RIVALS = [
  { name: 'Maya', avatarId: 'unicorn' },
  { name: 'Ravi', avatarId: 'tiger' },
  { name: 'Kabir', avatarId: 'king' },
];
