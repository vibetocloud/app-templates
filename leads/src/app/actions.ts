'use server';

// Every export here is a public HTTP endpoint — a form is only the polite way in.
// So this file validates, then delegates: rules live in lib/leads.ts, queries in lib/inbox.ts.

import { revalidatePath } from 'next/cache';

import * as inbox from '../lib/inbox';
import { leadProblem, looksLikeSpam, type LeadFields } from '../lib/leads.ts';

export type SendResult = { ok: true } | { ok: false; error: string } | null;

export async function sendEnquiry(_prev: SendResult, form: FormData): Promise<SendResult> {
  const fields: LeadFields = {
    name: String(form.get('name') ?? '').trim(),
    email: String(form.get('email') ?? '').trim(),
    company: String(form.get('company') ?? '').trim() || null,
    message: String(form.get('message') ?? '').trim(),
  };

  const problem = leadProblem(fields);
  if (problem) return { ok: false, error: problem };

  // Bots are told the same thing as everyone else — a spam bot that knows it was
  // caught just tries again differently.
  if (looksLikeSpam(fields.message, String(form.get('website') ?? ''))) {
    return { ok: true };
  }

  await inbox.addLead(fields);
  revalidatePath('/');
  return { ok: true };
}

export async function markHandled(form: FormData) {
  await inbox.markHandled(String(form.get('id')));
  revalidatePath('/');
}

export async function reopenLead(form: FormData) {
  await inbox.reopen(String(form.get('id')));
  revalidatePath('/');
}

export async function clearDemoLeads() {
  await inbox.removeDemoLeads();
  revalidatePath('/');
}
