import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PROFILE, loadProfile, Profile, sanitizeProfile, saveProfile } from './storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const PROFILE_KEY = 'patti.profile';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.restoreAllMocks();
});

describe('avatar is remembered', () => {
  it('returns the default avatar when nothing is stored', async () => {
    const profile = await loadProfile();
    expect(profile.avatarId).toBe(DEFAULT_PROFILE.avatarId);
  });

  it('keeps the chosen avatar after save and reload', async () => {
    const saved = await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'lion' });
    expect(saved).toBe(true);
    expect((await loadProfile()).avatarId).toBe('lion');
  });

  it('keeps a star-unlocked avatar once the stars are earned', async () => {
    await saveProfile({ ...DEFAULT_PROFILE, stars: 3, avatarId: 'duck' });
    expect((await loadProfile()).avatarId).toBe('duck');
  });

  it('keeps stars, points and history alongside the avatar', async () => {
    const history = [
      { finishedAt: '2026-11-21T10:00:00.000Z', rounds: 5, points: 9, placed: 'won' as const, difficulty: 'hard' },
    ];
    await saveProfile({
      ...DEFAULT_PROFILE,
      avatarId: 'panda',
      stars: 3,
      played: 1,
      won: 1,
      totalPoints: 9,
      history,
    });
    const loaded = await loadProfile();
    expect(loaded).toEqual({
      ...DEFAULT_PROFILE,
      avatarId: 'panda',
      stars: 3,
      played: 1,
      won: 1,
      totalPoints: 9,
      history,
    });
  });
});

describe('invalid avatar data falls back to the default', () => {
  it('falls back when the saved avatar is locked for the star count', async () => {
    await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'duck', stars: 0 });
    expect((await loadProfile()).avatarId).toBe(DEFAULT_PROFILE.avatarId);
  });

  it('falls back when the saved avatar id does not exist', async () => {
    await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'nonexistent' });
    expect((await loadProfile()).avatarId).toBe(DEFAULT_PROFILE.avatarId);
  });

  it('falls back to a full default profile when stored data is not valid JSON', async () => {
    await AsyncStorage.setItem(PROFILE_KEY, '{not json');
    expect(await loadProfile()).toEqual({ ...DEFAULT_PROFILE, history: [] });
  });

  it('falls back when the stored value is not an object', async () => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify('billu'));
    expect((await loadProfile()).avatarId).toBe(DEFAULT_PROFILE.avatarId);
  });

  it('fills in missing fields from defaults and keeps the valid avatar', async () => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify({ avatarId: 'panda' }));
    const profile = await loadProfile();
    expect(profile.avatarId).toBe('panda');
    expect(profile.played).toBe(0);
    expect(profile.history).toEqual([]);
  });

  it('treats negative or non-numeric counts as zero', () => {
    const profile = sanitizeProfile({ played: -4, won: 'lots', totalPoints: NaN, stars: 2 });
    expect(profile.played).toBe(0);
    expect(profile.won).toBe(0);
    expect(profile.totalPoints).toBe(0);
    expect(profile.stars).toBe(2);
  });
});

describe('old avatar ids still work', () => {
  it('maps an avatar saved by an earlier version to its new id', () => {
    expect(sanitizeProfile({ avatarId: 'billu' }).avatarId).toBe('fox');
    expect(sanitizeProfile({ avatarId: 'shakti', stars: 0 }).avatarId).toBe('unicorn');
  });
  it('keeps a legacy id that is still locked on the default', () => {
    expect(sanitizeProfile({ avatarId: 'duck', stars: 0 }).avatarId).toBe('fox');
  });
});

describe('sound setting is remembered', () => {
  it('is on by default', async () => {
    expect((await loadProfile()).soundOn).toBe(true);
  });
  it('keeps the sound setting after save and reload', async () => {
    await saveProfile({ ...DEFAULT_PROFILE, soundOn: false });
    expect((await loadProfile()).soundOn).toBe(false);
  });
  it('treats a non-boolean stored value as on', () => {
    expect(sanitizeProfile({ soundOn: 'no' }).soundOn).toBe(true);
  });
});

describe('character name is remembered', () => {
  it('starts with an empty name so the setup screen is shown', async () => {
    expect((await loadProfile()).characterName).toBe('');
  });

  it('keeps the character name after save and reload', async () => {
    await saveProfile({ ...DEFAULT_PROFILE, characterName: 'Raju', avatarId: 'lion' });
    const loaded = await loadProfile();
    expect(loaded.characterName).toBe('Raju');
    expect(loaded.avatarId).toBe('lion');
  });

  it('drops a stored name that breaks the name rules', () => {
    expect(sanitizeProfile({ characterName: 'Ram<3' }).characterName).toBe('');
    expect(sanitizeProfile({ characterName: 'x'.repeat(40) }).characterName).toBe('');
    expect(sanitizeProfile({ characterName: 42 }).characterName).toBe('');
  });

  it('keeps a valid stored name with extra spaces tidied', () => {
    expect(sanitizeProfile({ characterName: '  Anu  ' }).characterName).toBe('Anu');
  });
});

describe('save failures are reported', () => {
  it('returns false when storage refuses the write', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('storage full'));
    const saved = await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'lion' } as Profile);
    expect(saved).toBe(false);
  });

  it('does not change the stored avatar when the write fails', async () => {
    await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'panda' });
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('storage full'));
    await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'lion' });
    expect((await loadProfile()).avatarId).toBe('panda');
  });
});
