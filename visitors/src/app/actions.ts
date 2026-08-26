'use server';

// Every export here is a public HTTP endpoint — a form is only the polite way in.
// So this file validates, then delegates: rules live in lib/visits.ts, queries in lib/visitors.ts.

import { revalidatePath } from 'next/cache';

import * as visitors from '../lib/visitors';
import { signInProblem, type VisitFields } from '../lib/visits.ts';

export type SignInResult = { ok: true } | { ok: false; error: string } | null;

export async function signInVisitor(_prev: SignInResult, form: FormData): Promise<SignInResult> {
  const fields: VisitFields = {
    name: String(form.get('name') ?? '').trim(),
    company: String(form.get('company') ?? '').trim() || null,
    host: String(form.get('host') ?? '').trim(),
  };

  const problem = signInProblem(fields, await visitors.onSite());
  if (problem) return { ok: false, error: problem };

  await visitors.signIn(fields);
  revalidatePath('/');
  return { ok: true };
}

export async function signOutVisitor(form: FormData) {
  await visitors.signOut(String(form.get('id')));
  revalidatePath('/');
}

export async function clearDemoVisits() {
  await visitors.removeDemoVisits();
  revalidatePath('/');
}
