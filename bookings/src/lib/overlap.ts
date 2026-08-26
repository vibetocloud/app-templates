/** Anything with a start and an end — a stored booking or one someone is about to make. */
export type TimeRange = {
  startsAt: Date;
  endsAt: Date;
};

/**
 * Two time ranges clash when each starts before the other ends.
 * Touching ranges do not clash: 09:00-10:00 and 10:00-11:00 are both fine.
 */
export function clashes(a: TimeRange, b: TimeRange): boolean {
  return a.startsAt < b.endsAt && a.endsAt > b.startsAt;
}

/**
 * Validates a booking request against the bookings already in that room.
 * Returns a message to show the person, or null when the booking is fine.
 */
export function bookingProblem(wanted: TimeRange, existing: TimeRange[]): string | null {
  if (isNaN(+wanted.startsAt)) return 'Pick a start time.';
  if (isNaN(+wanted.endsAt)) return 'Pick an end time.';
  if (wanted.endsAt <= wanted.startsAt) return 'The end time has to be after the start time.';
  if (existing.some((b) => clashes(wanted, b))) return 'That room is already booked then. Pick another time or room.';
  return null;
}
