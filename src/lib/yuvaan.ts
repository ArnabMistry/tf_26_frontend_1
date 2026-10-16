export const YUVAAN_EVENT_ID = 'tf26_yuvaan';
export const YUVAAN_SLUG = 'yuvaan';

export const YUVAAN_COMMITTEES = [
  'Human Development',
  'Civic laws and policies',
  'Press',
] as const;

export type YuvaanCommittee = (typeof YUVAAN_COMMITTEES)[number];

export const YUVAAN_COMMITTEE_DESCRIPTIONS: Record<YuvaanCommittee, string> = {
  'Human Development': 'Deliberate on public health, education, poverty eradication, socio-economic equity, and human rights frameworks.',
  'Civic laws and policies': 'Focus on legislative review, constitutional amendments, civic liberties, governance ethics, and policy implementation.',
  'Press': 'Engage in investigative reporting, editorial journalism, media accountability, press conferences, and live committee critique.',
};

export const YUVAAN_MOTIONS = ['For', 'Against'] as const;
export type YuvaanMotion = (typeof YUVAAN_MOTIONS)[number];

export interface YuvaanPreferenceItem {
  committee: string;
  motion: YuvaanMotion;
}

export interface YuvaanRegistrationPayload {
  eventId: string;
  preferences: [YuvaanPreferenceItem, YuvaanPreferenceItem, YuvaanPreferenceItem];
  schoolCollege: string;
  classYear: string;
}

export interface YuvaanFormData {
  pref1Committee: string;
  pref1Motion: YuvaanMotion;
  pref2Committee: string;
  pref2Motion: YuvaanMotion;
  pref3Committee: string;
  pref3Motion: YuvaanMotion;
  schoolCollege: string;
  classYear: string;
}

export interface YuvaanValidationErrors {
  pref1Committee?: string;
  pref2Committee?: string;
  pref3Committee?: string;
  committees?: string;
  pref1Motion?: string;
  pref2Motion?: string;
  pref3Motion?: string;
  schoolCollege?: string;
  classYear?: string;
}

/**
 * Validates the Yuvaan registration fields:
 * 1. 3 distinct committee preferences (Preference 1, 2, 3)
 * 2. Motion stance for each preference ('For' or 'Against')
 * 3. School / College Name (non-empty trimmed string)
 * 4. Class / Year of Study (non-empty trimmed string)
 */
export function validateYuvaanForm(data: YuvaanFormData): {
  valid: boolean;
  errors: YuvaanValidationErrors;
} {
  const errors: YuvaanValidationErrors = {};
  const { pref1Committee, pref2Committee, pref3Committee, pref1Motion, pref2Motion, pref3Motion, schoolCollege, classYear } = data;

  if (!pref1Committee) {
    errors.pref1Committee = 'Preference 1 is required.';
  }
  if (!pref2Committee) {
    errors.pref2Committee = 'Preference 2 is required.';
  }
  if (!pref3Committee) {
    errors.pref3Committee = 'Preference 3 is required.';
  }

  if (!pref1Committee || !pref2Committee || !pref3Committee) {
    errors.committees = 'All 3 committee preferences must be selected.';
  } else if (
    pref1Committee === pref2Committee ||
    pref1Committee === pref3Committee ||
    pref2Committee === pref3Committee
  ) {
    errors.committees = 'Committee preferences must be mutually distinct. Please select 3 different committees.';
  }

  if (!pref1Motion || (pref1Motion !== 'For' && pref1Motion !== 'Against')) {
    errors.pref1Motion = 'Motion stance is required for Preference 1.';
  }
  if (!pref2Motion || (pref2Motion !== 'For' && pref2Motion !== 'Against')) {
    errors.pref2Motion = 'Motion stance is required for Preference 2.';
  }
  if (!pref3Motion || (pref3Motion !== 'For' && pref3Motion !== 'Against')) {
    errors.pref3Motion = 'Motion stance is required for Preference 3.';
  }

  if (!schoolCollege || !schoolCollege.trim()) {
    errors.schoolCollege = 'School / College name is required.';
  }

  if (!classYear || !classYear.trim()) {
    errors.classYear = 'Class / Year of study is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isYuvaanIdentifier(idOrSlug?: string | null): boolean {
  if (!idOrSlug) return false;
  const lower = idOrSlug.toLowerCase().trim();
  return lower === YUVAAN_SLUG || lower === YUVAAN_EVENT_ID;
}
