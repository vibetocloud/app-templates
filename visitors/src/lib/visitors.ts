// Every database query lives here. Nothing else in the app talks to Prisma.

import { prisma } from './prisma';
import { startOfDay, type Visit, type VisitFields } from './visits.ts';

function toVisit(row: {
  id: string;
  name: string;
  company: string | null;
  host: string;
  signedInAt: Date;
  signedOutAt: Date | null;
  isDemo: boolean;
}): Visit {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    host: row.host,
    signedInAt: row.signedInAt.toISOString(),
    signedOutAt: row.signedOutAt ? row.signedOutAt.toISOString() : null,
    isDemo: row.isDemo,
  };
}

/** Everyone currently in the building, longest first. */
export async function onSite(): Promise<Visit[]> {
  const rows = await prisma.visit.findMany({
    where: { signedOutAt: null },
    orderBy: { signedInAt: 'asc' },
  });
  return rows.map(toVisit);
}

/** Visits that finished today, most recent first. */
export async function signedOutToday(now = new Date()): Promise<Visit[]> {
  const rows = await prisma.visit.findMany({
    where: { signedOutAt: { not: null, gte: startOfDay(now) } },
    orderBy: { signedOutAt: 'desc' },
    take: 20,
  });
  return rows.map(toVisit);
}

export function signIn(fields: VisitFields) {
  return prisma.visit.create({ data: fields });
}

/** Signing out is only allowed once — a second click must not move the time. */
export function signOut(id: string, now = new Date()) {
  return prisma.visit.updateMany({
    where: { id, signedOutAt: null },
    data: { signedOutAt: now },
  });
}

export function removeDemoVisits() {
  return prisma.visit.deleteMany({ where: { isDemo: true } });
}
