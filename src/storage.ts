import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { MatchState } from './game/types';

/**
 * Everything lives on the device. There is no server, so accounts are local
 * to this phone (matching the "offline, nothing online" brief).
 */

export interface MatchRecord {
  finishedAt: string; // ISO date
  rounds: number;
  points: number;
  placed: 'won' | 'lost' | 'tied';
  difficulty: string;
}

export interface Account {
  username: string;
  pinHash: string;
  avatarId: string;
  played: number;
  won: number;
  totalPoints: number;
  stars: number;
  history: MatchRecord[];
}

export interface SavedGame {
  owner: string;
  match: MatchState;
  savedAt: string;
}

const KEY_ACCOUNTS = 'patti.accounts';
const KEY_SESSION = 'patti.session';
const KEY_GAME = 'patti.activeGame';

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

export async function hashPin(username: string, pin: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `patti:${username.toLowerCase()}:${pin}`,
  );
}

async function loadAccounts(): Promise<Record<string, Account>> {
  return (await readJson<Record<string, Account>>(KEY_ACCOUNTS)) ?? {};
}

async function saveAccounts(accounts: Record<string, Account>): Promise<void> {
  await writeJson(KEY_ACCOUNTS, accounts);
}

export async function getAccount(username: string): Promise<Account | null> {
  const accounts = await loadAccounts();
  return accounts[username.toLowerCase()] ?? null;
}

export type LoginResult =
  | { ok: true; account: Account; created: boolean }
  | { ok: false; error: string };

/** Log in if the account exists and the PIN matches; otherwise create it. */
export async function loginOrCreate(
  username: string,
  pin: string,
  avatarId: string,
): Promise<LoginResult> {
  const key = username.trim().toLowerCase();
  const accounts = await loadAccounts();
  const pinHash = await hashPin(key, pin);
  const existing = accounts[key];
  if (existing) {
    if (existing.pinHash !== pinHash) return { ok: false, error: 'Wrong PIN for this name.' };
    await writeJson(KEY_SESSION, key);
    return { ok: true, account: existing, created: false };
  }
  const account: Account = {
    username: username.trim(),
    pinHash,
    avatarId,
    played: 0,
    won: 0,
    totalPoints: 0,
    stars: 0,
    history: [],
  };
  accounts[key] = account;
  await saveAccounts(accounts);
  await writeJson(KEY_SESSION, key);
  return { ok: true, account, created: true };
}

export async function getSessionUser(): Promise<Account | null> {
  const key = await readJson<string>(KEY_SESSION);
  return key ? getAccount(key) : null;
}

export async function logout(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY_SESSION);
  } catch {
    // ignore
  }
}

export async function updateAccount(account: Account): Promise<void> {
  const accounts = await loadAccounts();
  accounts[account.username.toLowerCase()] = account;
  await saveAccounts(accounts);
}

// ---- In-progress game (resume support) ----

export async function saveActiveGame(owner: string, match: MatchState): Promise<void> {
  const saved: SavedGame = { owner, match, savedAt: new Date().toISOString() };
  await writeJson(KEY_GAME, saved);
}

export async function loadActiveGame(): Promise<SavedGame | null> {
  return readJson<SavedGame>(KEY_GAME);
}

export async function clearActiveGame(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY_GAME);
  } catch {
    // ignore
  }
}
