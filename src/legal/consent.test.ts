import { LEGAL_VERSION, PRIVACY_NOTICE, TERMS_OF_USE } from './content';
import {
  Consent,
  needsAgeConfirmation,
  needsLegalAcceptance,
  NO_CONSENT,
  withAdultConfirmed,
  withLegalAccepted,
} from './consent';

const NOW = new Date('2026-11-22T08:00:00.000Z');

describe('legal acceptance is asked once per version', () => {
  it('is needed on a brand-new device', () => {
    expect(needsLegalAcceptance(null)).toBe(true);
    expect(needsLegalAcceptance(NO_CONSENT)).toBe(true);
  });

  it('is not needed after the player accepts', () => {
    const accepted = withLegalAccepted(null, NOW);
    expect(needsLegalAcceptance(accepted)).toBe(false);
    expect(accepted.legalVersion).toBe(LEGAL_VERSION);
    expect(accepted.legalAcceptedAt).toBe(NOW.toISOString());
  });

  it('is needed again when the stored version is older', () => {
    const old: Consent = { legalVersion: '0.9', legalAcceptedAt: NOW.toISOString(), over18ConfirmedAt: NOW.toISOString(), underAgeAt: null };
    expect(needsLegalAcceptance(old)).toBe(true);
  });
});

describe('over-18 confirmation is asked once', () => {
  it('is needed until the player confirms', () => {
    expect(needsAgeConfirmation(null)).toBe(true);
    expect(needsAgeConfirmation(withLegalAccepted(null, NOW))).toBe(true);
  });

  it('is not needed after the player confirms', () => {
    const confirmed = withAdultConfirmed(withLegalAccepted(null, NOW), NOW);
    expect(needsAgeConfirmation(confirmed)).toBe(false);
    expect(confirmed.over18ConfirmedAt).toBe(NOW.toISOString());
  });

  it('keeps the legal acceptance when the age is confirmed', () => {
    const both = withAdultConfirmed(withLegalAccepted(null, NOW), NOW);
    expect(needsLegalAcceptance(both)).toBe(false);
  });
});

describe('legal documents', () => {
  it('have a title, an effective date and at least one section', () => {
    for (const doc of [PRIVACY_NOTICE, TERMS_OF_USE]) {
      expect(doc.title.length).toBeGreaterThan(0);
      expect(doc.effective).toContain('Version 1.0');
      expect(doc.sections.length).toBeGreaterThan(0);
    }
  });

  it('state the 18+ rule in both documents, as the PDFs do', () => {
    const privacy = JSON.stringify(PRIVACY_NOTICE);
    const terms = JSON.stringify(TERMS_OF_USE);
    expect(privacy).toContain('aged 18 or over');
    expect(terms).toContain('18 years or older');
  });

  it('keep the contact address from the PDFs', () => {
    expect(JSON.stringify(TERMS_OF_USE)).toContain('vgtechconsultingptyltd@gmail.com');
  });
});
