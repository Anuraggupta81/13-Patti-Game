import AsyncStorage from '@react-native-async-storage/async-storage';
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
  avatarId: string;
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

export const DEFAULT_PROFILE: Profile = {
  avatarId: 'billu',
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

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable: the game keeps working in memory.
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

export async function loadProfile(): Promise<Profile> {
  const stored = await readJson<Partial<Profile>>(KEY_PROFILE);
  return { ...DEFAULT_PROFILE, ...(stored ?? {}) };
}

export async function saveProfile(profile: Profile): Promise<void> {
  await writeJson(KEY_PROFILE, profile);
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
