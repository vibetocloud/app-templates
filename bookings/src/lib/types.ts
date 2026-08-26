export type Room = {
  id: string;
  name: string;
  capacity: number;
};

/** A booking as the calendar receives it — dates are ISO strings, since these cross from server to client. */
export type CalendarBooking = {
  id: string;
  title: string;
  bookedBy: string;
  roomId: string;
  roomName: string;
  isDemo: boolean;
  startsAt: string;
  endsAt: string;
};

/** A booking's details once read off the form and validated. */
export type BookingFields = {
  roomId: string;
  title: string;
  bookedBy: string;
  startsAt: Date;
  endsAt: Date;
};

/** What the create/update actions hand back to the form. `null` is "nothing submitted yet". */
export type BookingResult = { ok: true } | { ok: false; error: string } | null;

/** Query string the calendar page understands: `/?view=week&date=2026-08-26`. */
export type CalendarSearch = { view?: string; date?: string };
