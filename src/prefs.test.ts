import { DEFAULT_PROFILE, sanitizeProfile, sanitizeRules } from './storage';
import { DEFAULT_RULES } from './game/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('display and feedback preferences', () => {
  it('have sensible defaults', () => {
    expect(DEFAULT_PROFILE.fourColour).toBe(false);
    expect(DEFAULT_PROFILE.largeCards).toBe(false);
    expect(DEFAULT_PROFILE.hapticsOn).toBe(true);
    expect(DEFAULT_PROFILE.autoAdvance).toBe(false);
    expect(DEFAULT_PROFILE.lastRules).toEqual(DEFAULT_RULES);
  });

  it('keeps valid saved preferences', () => {
    const p = sanitizeProfile({ fourColour: true, largeCards: true, hapticsOn: false, autoAdvance: true });
    expect([p.fourColour, p.largeCards, p.hapticsOn, p.autoAdvance]).toEqual([true, true, false, true]);
  });

  it('falls back to defaults for wrong types', () => {
    const p = sanitizeProfile({ fourColour: 'yes', largeCards: 1, hapticsOn: 'no', autoAdvance: null });
    expect([p.fourColour, p.largeCards, p.hapticsOn, p.autoAdvance]).toEqual([false, false, true, false]);
  });
});

describe('last house rules are validated', () => {
  it('keeps a valid set of rules', () => {
    const rules = { rounds: 7, arrangeSeconds: 90, sweepBonus: 5, difficulty: 'hard' };
    expect(sanitizeRules(rules)).toEqual(rules);
  });

  it('replaces each invalid value with its default', () => {
    expect(sanitizeRules({ rounds: 4, arrangeSeconds: 30, sweepBonus: 9, difficulty: 'insane' })).toEqual(DEFAULT_RULES);
  });

  it('uses the defaults when nothing is stored', () => {
    expect(sanitizeRules(undefined)).toEqual(DEFAULT_RULES);
    expect(sanitizeRules('rules')).toEqual(DEFAULT_RULES);
  });
});
