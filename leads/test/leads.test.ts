import assert from 'node:assert/strict';
import { test } from 'node:test';

import { agoLabel, leadProblem, looksLikeEmail, looksLikeSpam, MESSAGE_MAX, startOfDay } from '../src/lib/leads.ts';

const ok = { name: 'Hannah', email: 'hannah@example.com', company: null, message: 'Hello there.' };

test('email check accepts real addresses and rejects typos', () => {
  assert.ok(looksLikeEmail('hannah@example.com'));
  assert.ok(looksLikeEmail('d.okafor+quotes@mail.co.uk'));
  assert.ok(!looksLikeEmail('hannah@example'), 'no dot in the domain');
  assert.ok(!looksLikeEmail('hannah.example.com'), 'no @ at all');
  assert.ok(!looksLikeEmail('two@@example.com'));
  assert.ok(!looksLikeEmail('has space@example.com'));
  assert.ok(!looksLikeEmail(''));
});

test('an enquiry needs a name, a usable email and a message', () => {
  assert.equal(leadProblem(ok), null);
  assert.match(leadProblem({ ...ok, name: '  ' }), /your name/);
  assert.match(leadProblem({ ...ok, email: '' }), /your email/);
  assert.match(leadProblem({ ...ok, email: 'nope' }), /does not look right/);
  assert.match(leadProblem({ ...ok, message: '   ' }), /short message/);
});

test('a very long message is refused rather than silently truncated', () => {
  assert.equal(leadProblem({ ...ok, message: 'x'.repeat(MESSAGE_MAX) }), null, 'exactly at the limit is fine');
  assert.match(leadProblem({ ...ok, message: 'x'.repeat(MESSAGE_MAX + 1) }), /too long/);
});

test('the honeypot catches bots that fill in every field', () => {
  assert.equal(looksLikeSpam('A normal message.', ''), false);
  assert.equal(looksLikeSpam('A normal message.', 'http://spam.example'), true);
  assert.equal(looksLikeSpam('A normal message.', '   '), false, 'whitespace is not a fill');
});

test('a message that is mostly links is treated as spam', () => {
  assert.equal(looksLikeSpam('See https://a.example for details.', ''), false, 'one link is normal');
  assert.equal(looksLikeSpam('https://a.example https://b.example', ''), false, 'two is still plausible');
  assert.equal(looksLikeSpam('https://a.example https://b.example http://c.example', ''), true);
});

test('arrival times read the way people say them', () => {
  const now = new Date(Date.UTC(2026, 7, 26, 12, 0));
  const ago = (mins: number) => new Date(now.getTime() - mins * 60000);
  assert.equal(agoLabel(ago(0), now), 'just now');
  assert.equal(agoLabel(ago(25), now), '25 min ago');
  assert.equal(agoLabel(ago(60), now), '1 hour ago', 'singular at exactly one hour');
  assert.equal(agoLabel(ago(180), now), '3 hours ago');
  assert.equal(agoLabel(ago(60 * 24), now), 'yesterday');
  assert.equal(agoLabel(ago(60 * 24 * 3), now), '3 days ago');
  assert.equal(agoLabel(new Date(now.getTime() + 60000), now), 'just now', 'never negative');
});

test('startOfDay is midnight of the same calendar day', () => {
  const midnight = startOfDay(new Date(2026, 7, 26, 12, 30));
  assert.equal(midnight.getDate(), 26);
  assert.equal(midnight.getHours(), 0);
});
