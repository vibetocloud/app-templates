/** A visit as the screen shows it. Dates are ISO strings — these cross to client components. */
export type Visit = {
  id: string;
  name: string;
  company: string | null;
  host: string;
  signedInAt: string;
  signedOutAt: string | null;
  isDemo: boolean;
};

/** What a sign-in needs. */
export type VisitFields = {
  name: string;
  company: string | null;
  host: string;
};

export function isOnSite(visit: { signedOutAt: string | Date | null }): boolean {
  return visit.signedOutAt === null;
}

/** Names match regardless of case and surrounding spaces — people type inconsistently. */
export function sameName(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Checks a sign-in. Returns a message for the visitor, or null when it is fine.
 * Signing in twice without signing out first is refused: the whole point of the
 * board is knowing who is actually in the building.
 */
export function signInProblem(fields: VisitFields, onSite: { name: string }[]): string | null {
  if (!fields.name.trim()) return 'Please fill in your name.';
  if (!fields.host.trim()) return 'Please fill in who you are visiting.';
  if (onSite.some((v) => sameName(v.name, fields.name))) {
    return `${fields.name.trim()} is already signed in. Sign out first if this is a new visit.`;
  }
  return null;
}

/**
 * How long someone has been in, in plain words.
 * Rounds down to the minute, so a visit never reads longer than it is.
 */
export function durationLabel(from: Date, to: Date): string {
  const minutes = Math.max(0, Math.floor((to.getTime() - from.getTime()) / 60000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return `${hours} hr`;
  return `${hours} hr ${rest} min`;
}

/** Midnight today, so "signed in today" means the calendar day, not the last 24 hours. */
export function startOfDay(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
