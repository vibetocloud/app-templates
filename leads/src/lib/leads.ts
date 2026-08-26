/** An enquiry as the inbox shows it. Dates are ISO strings — these cross to client components. */
export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  createdAt: string;
  handledAt: string | null;
  isDemo: boolean;
};

export type LeadFields = {
  name: string;
  email: string;
  company: string | null;
  message: string;
};

export const MESSAGE_MAX = 2000;

/**
 * Good enough to catch typos, deliberately not a full RFC 5322 parser:
 * something before an @, something after it, and a dot in the domain.
 * The only real test of an address is sending to it.
 */
export function looksLikeEmail(value: string): boolean {
  const trimmed = value.trim();
  if (/\s/.test(trimmed)) return false;
  return /^[^@]+@[^@.]+(\.[^@.]+)+$/.test(trimmed);
}

/** Checks an enquiry. Returns a message for the sender, or null when it is fine. */
export function leadProblem(fields: LeadFields): string | null {
  if (!fields.name.trim()) return 'Please fill in your name.';
  if (!fields.email.trim()) return 'Please fill in your email address.';
  if (!looksLikeEmail(fields.email)) return 'That email address does not look right.';
  if (!fields.message.trim()) return 'Please write a short message.';
  if (fields.message.length > MESSAGE_MAX) return 'That message is too long — please shorten it.';
  return null;
}

/**
 * A public form gets bots. Two cheap signals, no service and no dependency:
 * a honeypot field a human never sees, and a message that is mostly links.
 * ponytail: heuristic by design; swap in a real spam service if the noise gets bad.
 */
export function looksLikeSpam(message: string, honeypot: string): boolean {
  if (honeypot.trim() !== '') return true;
  const links = message.match(/https?:\/\//gi)?.length ?? 0;
  return links >= 3;
}

/** Midnight today, so "today" means the calendar day rather than the last 24 hours. */
export function startOfDay(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** How long ago something arrived, in plain words. */
export function agoLabel(from: Date, now: Date): string {
  const minutes = Math.max(0, Math.floor((now.getTime() - from.getTime()) / 60000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}
