import AsyncStorage from '@react-native-async-storage/async-storage';
import { avatarById, DEFAULT_AVATAR_ID, isAvatarUnlocked, resolveAvatarId } from './avatars';
import { checkCharacterName } from './characterName';
import type { Consent } from './legal/consent';
import { MatchState } from './game/types';

/**
 * Everything lives on the device. There is no login, no name, no PIN and no
 * server. The profile holds only game progress and the chosen avatar.
 */

export interface MatchRecord {
  finishedAt: string; // ISO date
  rounds: number;
  points: number;
  placed: 'won' | 'lost' | 'tied';
  difficulty: string;
}

export interface Profile {
  /** The character's game name. Empty until the player sets it on first launch. */
  characterName: string;
  avatarId: string;
  /** Sound effects on or off. Defaults to on. */
  soundOn: boolean;
  played: number;
  won: number;
  totalPoints: number;
  stars: number;
  history: MatchRecord[];
}

export interface SavedGame {
  match: MatchState;
  savedAt: string;
}

const KEY_PROFILE = 'patti.profile';
const KEY_GAME = 'patti.activeGame';
const KEY_CONSENT = 'patti.consent';

// ---- Consent (privacy and terms, age) ----

export async function loadConsent(): Promise<Consent | null> {
  const stored = await readJson<Partial<Consent>>(KEY_CONSENT);
  if (!stored || typeof stored !== 'object') return null;
  const text = (v: unknown) => (typeof v === 'string' ? v : null);
  return {
    legalVersion: text(stored.legalVersion),
    legalAcceptedAt: text(stored.legalAcceptedAt),
    over18ConfirmedAt: text(stored.over18ConfirmedAt),
  };
}

/** Returns true only when the consent record was written to storage. */
export async function saveConsent(consent: Consent): Promise<boolean> {
  return writeJson(KEY_CONSENT, consent);
}

export const DEFAULT_PROFILE: Profile = {
  characterName: '',
  avatarId: DEFAULT_AVATAR_ID,
  soundOn: true,
  played: 0,
  won: 0,
  totalPoints: 0,
  stars: 0,
  history: [],
};

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null; // corrupt or unreadable data is treated as empty
  }
}

/** Returns true when the value was written, false when storage refused it. */
async function writeJson(key: string, value: unknown): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Storage full or unavailable: the caller decides what to tell the player.
    return false;
  }
}

async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ---- Device profile (progress only, no identity) ----

/**
 * Turns whatever was stored into a valid profile. Missing or wrong-typed fields
 * fall back to defaults. A saved avatar is kept only if it exists and is
 * unlocked for the saved star count; otherwise the default avatar is used.
 */
export function sanitizeProfile(stored: unknown): Profile {
  if (!stored || typeof stored !== 'object') return { ...DEFAULT_PROFILE, history: [] };
  const s = stored as Partial<Record<keyof Profile, unknown>>;
  const count = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0);
  const checked = typeof s.characterName === 'string' ? checkCharacterName(s.characterName) : null;
  const profile: Profile = {
    characterName: checked && checked.ok ? checked.name : '',
    avatarId: DEFAULT_PROFILE.avatarId,
    soundOn: typeof s.soundOn === 'boolean' ? s.soundOn : true,
    played: count(s.played),
    won: count(s.won),
    totalPoints: count(s.totalPoints),
    stars: count(s.stars),
    history: Array.isArray(s.history) ? (s.history as MatchRecord[]) : [],
  };
  const id = resolveAvatarId(s.avatarId);
  if (id && isAvatarUnlocked(avatarById(id), profile.stars)) profile.avatarId = id;
  return profile;
}

export async function loadProfile(): Promise<Profile> {
  return sanitizeProfile(await readJson<unknown>(KEY_PROFILE));
}

/** Returns true only when the profile was actually written to storage. */
export async function saveProfile(profile: Profile): Promise<boolean> {
  return writeJson(KEY_PROFILE, profile);
}

// ---- In-progress game (resume support) ----

export async function saveActiveGame(match: MatchState): Promise<void> {
  const saved: SavedGame = { match, savedAt: new Date().toISOString() };
  await writeJson(KEY_GAME, saved);
}

export async function loadActiveGame(): Promise<SavedGame | null> {
  return readJson<SavedGame>(KEY_GAME);
}

export async function clearActiveGame(): Promise<void> {
  await removeKey(KEY_GAME);
}
