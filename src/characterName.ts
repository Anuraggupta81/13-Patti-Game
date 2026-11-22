/**
 * Rules for the character name the player types on the setup screen.
 * It is a game name shown at the table. It is not a login and not a real name.
 */

export const CHARACTER_NAME_MAX = 12;

/** Letters (any script), marks, digits, spaces, dots, apostrophes and hyphens. */
const ALLOWED = /^[\p{L}\p{M}\p{N} .'-]+$/u;

/** Name used when the player leaves the optional nickname blank. */
export const DEFAULT_NICKNAME = 'Player';

/** The nickname to use: the typed name, or the default when left blank (optional field). */
export function nicknameOrDefault(raw: string): string {
  const name = raw.trim().replace(/\s+/g, ' ');
  return name.length === 0 ? DEFAULT_NICKNAME : name;
}

export type NameCheck = { ok: true; name: string } | { ok: false; error: string };

/** Trims the name and checks it. Returns the clean name when it is valid. */
export function checkCharacterName(raw: string): NameCheck {
  const name = raw.trim().replace(/\s+/g, ' ');
  if (name.length === 0) return { ok: false, error: 'Please type a name for your character.' };
  if (name.length > CHARACTER_NAME_MAX) {
    return { ok: false, error: `Use ${CHARACTER_NAME_MAX} characters or fewer.` };
  }
  if (!ALLOWED.test(name)) {
    return { ok: false, error: 'Use letters, numbers, spaces, dots, apostrophes or hyphens only.' };
  }
  return { ok: true, name };
}
