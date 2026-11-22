import {
  handAnnouncement,
  roundAnnouncement,
  swapAnnouncement,
  timerAnnouncement,
  TIMER_WARNINGS,
} from './accessibility';

describe('timer announcements (AX-10)', () => {
  it('announces at 30, 10 and 5 seconds left only', () => {
    expect(TIMER_WARNINGS).toEqual([30, 10, 5]);
    expect(timerAnnouncement(30)).toBe('30 seconds left to arrange.');
    expect(timerAnnouncement(10)).toBe('10 seconds left to arrange.');
    expect(timerAnnouncement(5)).toBe('5 seconds left to arrange.');
  });

  it('stays silent at other times', () => {
    expect(timerAnnouncement(90)).toBeNull();
    expect(timerAnnouncement(12)).toBeNull();
    expect(timerAnnouncement(0)).toBeNull();
  });
});

describe('hand announcements (AX-12)', () => {
  it('names a single winner', () => {
    expect(handAnnouncement(3, 4, ['Ravi'])).toBe('Hand 3 of 4. Ravi wins this hand.');
  });

  it('names tied winners', () => {
    expect(handAnnouncement(1, 4, ['Ravi', 'Kabir'])).toBe('Hand 1 of 4. Ravi and Kabir tie for this hand.');
    expect(handAnnouncement(2, 4, ['Maya', 'Ravi', 'Kabir'])).toBe(
      'Hand 2 of 4. Maya, Ravi and Kabir tie for this hand.',
    );
  });

  it('handles no winner', () => {
    expect(handAnnouncement(4, 4, [])).toBe('Hand 4 of 4. No winner.');
  });
});

describe('other announcements', () => {
  it('announces the round and the swap', () => {
    expect(roundAnnouncement(2)).toBe('Round 2 done.');
    expect(swapAnnouncement()).toBe('Cards swapped.');
  });
});
