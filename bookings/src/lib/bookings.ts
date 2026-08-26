// Every database query lives here. Nothing else in the app talks to Prisma,
// so a change to how bookings are stored or filtered happens in one file.

import { prisma } from './prisma';
import type { BookingFields, CalendarBooking } from './types';

export function listRooms() {
  return prisma.room.findMany({ orderBy: { name: 'asc' } });
}

/** Bookings overlapping a window, for the calendar. `end` is exclusive. */
export async function bookingsBetween(start: Date, end: Date): Promise<CalendarBooking[]> {
  const rows = await prisma.booking.findMany({
    where: { startsAt: { lt: end }, endsAt: { gt: start } },
    orderBy: { startsAt: 'asc' },
    include: { room: true },
  });

  // Dates become ISO strings here because these cross to a client component.
  return rows.map((b) => ({
    id: b.id,
    title: b.title,
    bookedBy: b.bookedBy,
    roomId: b.roomId,
    roomName: b.room.name,
    isDemo: b.isDemo,
    startsAt: b.startsAt.toISOString(),
    endsAt: b.endsAt.toISOString(),
  }));
}

/** Bookings that have not finished yet, soonest first. */
export function upcoming(limit = 10) {
  return prisma.booking.findMany({
    where: { endsAt: { gte: new Date() } },
    orderBy: { startsAt: 'asc' },
    take: limit,
    include: { room: true },
  });
}

/** Bookings in the same room that could clash, ignoring the one being edited. */
export function clashCandidates(roomId: string, from: Date, exceptId?: string) {
  return prisma.booking.findMany({
    where: { roomId, endsAt: { gt: from }, ...(exceptId ? { id: { not: exceptId } } : {}) },
    select: { startsAt: true, endsAt: true },
  });
}

export function createBooking(fields: BookingFields) {
  return prisma.booking.create({ data: fields });
}

export function updateBooking(id: string, fields: BookingFields) {
  // Editing an example booking makes it real, so clearing the demo data
  // will not throw away someone's actual work.
  return prisma.booking.update({ where: { id }, data: { ...fields, isDemo: false } });
}

export function removeBooking(id: string) {
  return prisma.booking.delete({ where: { id } });
}

export function removeDemoBookings() {
  return prisma.booking.deleteMany({ where: { isDemo: true } });
}
