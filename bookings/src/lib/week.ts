// All dates are handled in UTC so a booking shows the same wall-clock time
// everywhere. For a room booking board that is what people expect: 14:00 means
// 14:00 on the wall, not "14:00 wherever the server happens to live".
// ponytail: single-timezone by design; add a per-org timezone if you ever sell this abroad.

import type { TimeRange } from './overlap.ts';

export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 20;
export const MINUTES_IN_VIEW = (DAY_END_HOUR - DAY_START_HOUR) * 60;

const DAY_MS = 86400000;

/**
 * Read a datetime-local field. It gives "2026-08-26T14:00" with no timezone,
 * so we pin it to UTC and the time that comes back out is the time that went in.
 */
export function fromInputValue(value: string): Date {
  // Most browsers omit seconds; some include them ("2026-08-26T14:00:30").
  const withSeconds = value.length === 16 ? `${value}:00` : value;
  return new Date(`${withSeconds}Z`);
}

/** The inverse: an ISO string as a datetime-local field wants it. */
export function toInputValue(iso: string): string {
  return iso.slice(0, 16);
}

/** @param s YYYY-MM-DD */
export function parseYmd(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY_MS);
}

/** Monday is the first day of the week. */
export function startOfWeek(d: Date): Date {
  const mondayIndex = (d.getUTCDay() + 6) % 7;
  return addDays(d, -mondayIndex);
}

export type CalendarView = 'day' | 'week';

/** The window the calendar is showing. `end` is exclusive. */
export function rangeFor(view: CalendarView, dateStr: string): { start: Date; dayCount: number; end: Date } {
  const base = parseYmd(dateStr);
  const start = view === 'week' ? startOfWeek(base) : base;
  const dayCount = view === 'week' ? 7 : 1;
  return { start, dayCount, end: addDays(start, dayCount) };
}

/**
 * Where a booking sits inside a day column, as percentages of the visible hours.
 * Clamped so a booking running past midnight still draws inside its column.
 *
 * @param dayStart midnight UTC of the column's day
 */
export function placeInDay(booking: TimeRange, dayStart: Date): { top: number; height: number } {
  const viewStart = dayStart.getTime() + DAY_START_HOUR * 3600000;
  const viewEnd = dayStart.getTime() + DAY_END_HOUR * 3600000;

  const from = Math.max(booking.startsAt.getTime(), viewStart);
  const to = Math.min(booking.endsAt.getTime(), viewEnd);

  const top = ((from - viewStart) / 60000 / MINUTES_IN_VIEW) * 100;
  const height = ((to - from) / 60000 / MINUTES_IN_VIEW) * 100;
  return { top, height: Math.max(height, 2.5) };
}

/**
 * Side-by-side placement for bookings that share a time slot (different rooms).
 * Greedy: each booking takes the first lane that is free when it starts.
 */
export function assignLanes<T extends TimeRange>(bookings: T[]): { placed: { booking: T; lane: number }[]; laneCount: number } {
  const ordered = [...bookings].sort((a, b) => +a.startsAt - +b.startsAt);
  const laneEnds: Date[] = [];

  const placed = ordered.map((b) => {
    let lane = laneEnds.findIndex((end) => end <= b.startsAt);
    if (lane === -1) {
      lane = laneEnds.length;
    }
    laneEnds[lane] = b.endsAt;
    return { booking: b, lane };
  });

  return { placed, laneCount: Math.max(laneEnds.length, 1) };
}
