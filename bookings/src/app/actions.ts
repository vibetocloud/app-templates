'use server';

// Every export here is a public HTTP endpoint — a form is only the polite way in.
// So this file validates, then delegates: rules live in lib/overlap.ts, queries in lib/bookings.ts.

import { revalidatePath } from 'next/cache';

import * as bookings from '../lib/bookings';
import { bookingProblem } from '../lib/overlap.ts';
import { fromInputValue } from '../lib/week.ts';
import type { BookingFields, BookingResult } from '../lib/types.ts';

function read(form: FormData): BookingFields | string {
  const roomId = String(form.get('roomId') ?? '');
  const title = String(form.get('title') ?? '').trim();
  const bookedBy = String(form.get('bookedBy') ?? '').trim();

  if (!roomId) return 'Pick a room.';
  if (!title) return 'Give the booking a short name.';
  if (!bookedBy) return 'Fill in your name.';

  return {
    roomId,
    title,
    bookedBy,
    startsAt: fromInputValue(String(form.get('startsAt') ?? '')),
    endsAt: fromInputValue(String(form.get('endsAt') ?? '')),
  };
}

export async function createBooking(_prev: BookingResult, form: FormData): Promise<BookingResult> {
  const fields = read(form);
  if (typeof fields === 'string') return { ok: false, error: fields };

  const problem = bookingProblem(fields, await bookings.clashCandidates(fields.roomId, fields.startsAt));
  if (problem) return { ok: false, error: problem };

  await bookings.createBooking(fields);
  revalidatePath('/');
  return { ok: true };
}

export async function updateBooking(_prev: BookingResult, form: FormData): Promise<BookingResult> {
  const id = String(form.get('id') ?? '');
  if (!id) return { ok: false, error: 'That booking no longer exists.' };

  const fields = read(form);
  if (typeof fields === 'string') return { ok: false, error: fields };

  const problem = bookingProblem(fields, await bookings.clashCandidates(fields.roomId, fields.startsAt, id));
  if (problem) return { ok: false, error: problem };

  await bookings.updateBooking(id, fields);
  revalidatePath('/');
  return { ok: true };
}

export async function cancelBooking(form: FormData) {
  await bookings.removeBooking(String(form.get('id')));
  revalidatePath('/');
}

export async function clearDemoData() {
  await bookings.removeDemoBookings();
  revalidatePath('/');
}
