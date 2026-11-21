import { LEGAL_VERSION } from './content';

/**
 * What the player has confirmed on this device. Stored locally only.
 * The privacy and terms confirmation is asked once per legal version.
 * The over-18 confirmation is asked once.
 */
export interface Consent {
  /** Version of the Privacy Notice and Terms the player accepted. */
  legalVersion: string | null;
  legalAcceptedAt: string | null; // ISO date
  over18ConfirmedAt: string | null; // ISO date
}

export const NO_CONSENT: Consent = {
  legalVersion: null,
  legalAcceptedAt: null,
  over18ConfirmedAt: null,
};

/** True when the player must read and accept the Privacy Notice and Terms. */
export function needsLegalAcceptance(consent: Consent | null): boolean {
  return !consent || consent.legalVersion !== LEGAL_VERSION || !consent.legalAcceptedAt;
}

/** True when the player must confirm they are 18 or over. */
export function needsAgeConfirmation(consent: Consent | null): boolean {
  return !consent || !consent.over18ConfirmedAt;
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
