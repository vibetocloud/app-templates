// Every database query lives here. Nothing else in the app talks to Prisma.

import { prisma } from './prisma';
import type { Lead, LeadFields } from './leads.ts';

function toLead(row: {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  createdAt: Date;
  handledAt: Date | null;
  isDemo: boolean;
}): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    message: row.message,
    createdAt: row.createdAt.toISOString(),
    handledAt: row.handledAt ? row.handledAt.toISOString() : null,
    isDemo: row.isDemo,
  };
}

/** Enquiries nobody has dealt with yet, newest first. */
export async function newLeads(): Promise<Lead[]> {
  const rows = await prisma.lead.findMany({
    where: { handledAt: null },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(toLead);
}

/** Enquiries already dealt with, most recently handled first. */
export async function handledLeads(limit = 20): Promise<Lead[]> {
  const rows = await prisma.lead.findMany({
    where: { handledAt: { not: null } },
    orderBy: { handledAt: 'desc' },
    take: limit,
  });
  return rows.map(toLead);
}

export function addLead(fields: LeadFields) {
  return prisma.lead.create({ data: fields });
}

/** Marking as handled is only allowed once, so a second click cannot move the time. */
export function markHandled(id: string, now = new Date()) {
  return prisma.lead.updateMany({ where: { id, handledAt: null }, data: { handledAt: now } });
}

export function reopen(id: string) {
  return prisma.lead.updateMany({ where: { id, handledAt: { not: null } }, data: { handledAt: null } });
}

export function removeDemoLeads() {
  return prisma.lead.deleteMany({ where: { isDemo: true } });
}
