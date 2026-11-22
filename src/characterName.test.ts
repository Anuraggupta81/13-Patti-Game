import { CHARACTER_NAME_MAX, checkCharacterName } from './characterName';

describe('checkCharacterName', () => {
  it('accepts a simple name and returns it trimmed', () => {
    expect(checkCharacterName('  Raju  ')).toEqual({ ok: true, name: 'Raju' });
  });

  it('collapses repeated spaces inside the name', () => {
    expect(checkCharacterName('Dark   Knight')).toEqual({ ok: true, name: 'Dark Knight' });
  });

  it('rejects an empty or spaces-only name', () => {
    expect(checkCharacterName('').ok).toBe(false);
    expect(checkCharacterName('     ').ok).toBe(false);
  });

  it('accepts exactly the maximum length and rejects one more', () => {
    expect(checkCharacterName('a'.repeat(CHARACTER_NAME_MAX)).ok).toBe(true);
    const tooLong = checkCharacterName('a'.repeat(CHARACTER_NAME_MAX + 1));
    expect(tooLong.ok).toBe(false);
    if (!tooLong.ok) expect(tooLong.error).toContain(String(CHARACTER_NAME_MAX));
  });

  it('accepts names in other scripts, digits, dots, apostrophes and hyphens', () => {
    expect(checkCharacterName('राजू').ok).toBe(true);
    expect(checkCharacterName("Ram's-7.").ok).toBe(true);
  });

  it('rejects symbols and emoji', () => {
    expect(checkCharacterName('Ram<3').ok).toBe(false);
    expect(checkCharacterName('Ram 🐱').ok).toBe(false);
  });
});
