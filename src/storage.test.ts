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
    const saved = await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'sheru' });
    expect(saved).toBe(true);
    expect((await loadProfile()).avatarId).toBe('sheru');
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
      avatarId: 'chintu',
      stars: 3,
      played: 1,
      won: 1,
      totalPoints: 9,
      history,
    });
    const loaded = await loadProfile();
    expect(loaded).toEqual({
      ...DEFAULT_PROFILE,
      avatarId: 'chintu',
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
    await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'dragon' });
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
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify({ avatarId: 'chintu' }));
    const profile = await loadProfile();
    expect(profile.avatarId).toBe('chintu');
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

describe('save failures are reported', () => {
  it('returns false when storage refuses the write', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('storage full'));
    const saved = await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'sheru' } as Profile);
    expect(saved).toBe(false);
  });

  it('does not change the stored avatar when the write fails', async () => {
    await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'chintu' });
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('storage full'));
    await saveProfile({ ...DEFAULT_PROFILE, avatarId: 'sheru' });
    expect((await loadProfile()).avatarId).toBe('chintu');
  });
});
