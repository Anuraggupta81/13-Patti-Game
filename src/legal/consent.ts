import { LEGAL_VERSION } from './content';

/**
 * What the player has confirmed on this device. Stored locally only.
 * The privacy and terms confirmation is asked once per legal version.
 * The over-18 confirmation is asked once. An "under 18" answer is remembered,
 * so the app stays closed on later launches (Q-12, decided 22 Nov).
 */
export interface Consent {
  /** Version of the Privacy Notice and Terms the player accepted. */
  legalVersion: string | null;
  legalAcceptedAt: string | null; // ISO date
  over18ConfirmedAt: string | null; // ISO date
  underAgeAt: string | null; // ISO date, set when the player says they are under 18
}

export const NO_CONSENT: Consent = {
  legalVersion: null,
  legalAcceptedAt: null,
  over18ConfirmedAt: null,
  underAgeAt: null,
};

/** True when the player must read and accept the Privacy Notice and Terms. */
export function needsLegalAcceptance(consent: Consent | null): boolean {
  return !consent || consent.legalVersion !== LEGAL_VERSION || !consent.legalAcceptedAt;
}

/** True when the player must confirm they are 18 or over. */
export function needsAgeConfirmation(consent: Consent | null): boolean {
  return !consent || !consent.over18ConfirmedAt;
}

/** True when the player previously said they are under 18. The app stays closed. */
export function isBlockedAsMinor(consent: Consent | null): boolean {
  return !!consent && !!consent.underAgeAt;
}

export function withLegalAccepted(consent: Consent | null, now: Date): Consent {
  return {
    ...(consent ?? NO_CONSENT),
    legalVersion: LEGAL_VERSION,
    legalAcceptedAt: now.toISOString(),
  };
}

export function withAdultConfirmed(consent: Consent | null, now: Date): Consent {
  return {
    ...(consent ?? NO_CONSENT),
    over18ConfirmedAt: now.toISOString(),
  };
}

export function withUnderAge(consent: Consent | null, now: Date): Consent {
  return {
    ...(consent ?? NO_CONSENT),
    underAgeAt: now.toISOString(),
  };
}
