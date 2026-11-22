import { suitColour } from './display';
import { colors } from './theme';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success' },
}));

describe('suit colours', () => {
  it('uses red and black by default', () => {
    expect(suitColour({ rank: 5, suit: 'H' }, false)).toBe(colors.red);
    expect(suitColour({ rank: 5, suit: 'D' }, false)).toBe(colors.red);
    expect(suitColour({ rank: 5, suit: 'S' }, false)).toBe('#111');
    expect(suitColour({ rank: 5, suit: 'C' }, false)).toBe('#111');
  });

  it('uses four colours when the four-colour deck is on', () => {
    expect(suitColour({ rank: 5, suit: 'S' }, true)).toBe('#111');
    expect(suitColour({ rank: 5, suit: 'H' }, true)).toBe(colors.red);
    expect(suitColour({ rank: 5, suit: 'D' }, true)).toBe('#1E63C8');
    expect(suitColour({ rank: 5, suit: 'C' }, true)).toBe('#1E8E3E');
  });
});
