import { avatarGridLayout } from './layout';

describe('avatarGridLayout', () => {
  it('fits 4 avatars across a typical 360 dp phone', () => {
    expect(avatarGridLayout(360)).toEqual({ columns: 4, cellWidth: 82, size: 70 });
  });

  it('uses 3 columns on a narrow 320 dp phone', () => {
    expect(avatarGridLayout(320)).toEqual({ columns: 3, cellWidth: 96, size: 72 });
  });

  it('uses more columns on a wider phone', () => {
    expect(avatarGridLayout(411).columns).toBe(4);
    expect(avatarGridLayout(600).columns).toBe(6);
  });

  it('never makes an avatar bigger than 72 dp', () => {
    expect(avatarGridLayout(1200).size).toBeLessThanOrEqual(72);
  });

  it('always leaves room for the screen padding', () => {
    for (const w of [280, 320, 360, 411, 480, 600, 800]) {
      const { columns, cellWidth } = avatarGridLayout(w);
      expect(cellWidth * columns).toBeLessThanOrEqual(w - 32);
    }
  });
});
