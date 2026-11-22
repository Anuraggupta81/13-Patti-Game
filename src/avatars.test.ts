import { AVATARS, DEFAULT_AVATAR_ID, RIVALS, resolveAvatarId } from './avatars';

/** Names from existing films, comics, cartoons and brands. Must not be used for characters. */
const RESERVED_NAMES = [
  'billu',
  'chintu',
  'sheru',
  'naag veer',
  'naagveer',
  'shwaan',
  'shakti',
  'mahabali',
  'batman',
  'wonder woman',
  'tom',
  'jerry',
  'mickey',
  'pikachu',
  'marvel',
  'disney',
];

describe('characters use generic, free names', () => {
  it('no character or rival name is a reserved name', () => {
    const names = [...AVATARS.map((a) => a.name), ...RIVALS.map((r) => r.name)].map((n) => n.toLowerCase());
    for (const name of names) {
      expect(RESERVED_NAMES).not.toContain(name);
    }
  });

  it('every avatar has a unique id and name', () => {
    expect(new Set(AVATARS.map((a) => a.id)).size).toBe(AVATARS.length);
    expect(new Set(AVATARS.map((a) => a.name)).size).toBe(AVATARS.length);
  });

  it('every rival uses an avatar that exists', () => {
    for (const r of RIVALS) {
      expect(AVATARS.map((a) => a.id)).toContain(r.avatarId);
    }
  });

  it('the default avatar exists and is unlocked from the start', () => {
    const def = AVATARS.find((a) => a.id === DEFAULT_AVATAR_ID);
    expect(def).toBeDefined();
    expect(def!.unlockStars).toBe(0);
  });
});

describe('resolveAvatarId', () => {
  it('returns current ids unchanged', () => {
    expect(resolveAvatarId('fox')).toBe('fox');
  });

  it('maps legacy ids to current ids', () => {
    expect(resolveAvatarId('billu')).toBe('fox');
    expect(resolveAvatarId('sheru')).toBe('lion');
  });

  it('returns undefined for unknown or non-string values', () => {
    expect(resolveAvatarId('nonexistent')).toBeUndefined();
    expect(resolveAvatarId(42)).toBeUndefined();
  });
});
