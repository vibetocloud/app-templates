import assert from 'node:assert/strict';
import { test } from 'node:test';

import { durationLabel, isOnSite, sameName, signInProblem, startOfDay } from '../src/lib/visits.ts';

const at = (h: number, m = 0) => new Date(Date.UTC(2026, 7, 26, h, m));

test('someone is on site until they sign out', () => {
  assert.equal(isOnSite({ signedOutAt: null }), true);
  assert.equal(isOnSite({ signedOutAt: '2026-08-26T10:00:00Z' }), false);
});

test('names match regardless of case and spacing', () => {
  assert.ok(sameName('Priya Raman', 'priya raman'));
  assert.ok(sameName('  Tom Buckley ', 'Tom Buckley'));
  assert.ok(!sameName('Tom Buckley', 'Tom Bucklee'));
});

test('a sign-in needs a name and a host', () => {
  assert.match(signInProblem({ name: '', company: null, host: 'Sam' }, []), /your name/);
  assert.match(signInProblem({ name: '   ', company: null, host: 'Sam' }, []), /your name/);
  assert.match(signInProblem({ name: 'Ana', company: null, host: '' }, []), /who you are visiting/);
  assert.equal(signInProblem({ name: 'Ana', company: null, host: 'Sam' }, []), null);
});

test('signing in twice is refused until the first visit is closed', () => {
  const onSite = [{ name: 'Priya Raman' }];
  assert.match(signInProblem({ name: 'priya raman', company: null, host: 'Sam' }, onSite), /already signed in/);
  assert.equal(signInProblem({ name: 'Someone Else', company: null, host: 'Sam' }, onSite), null);
});

test('durations read the way people say them', () => {
  assert.equal(durationLabel(at(9), at(9)), 'just now');
  assert.equal(durationLabel(at(9), at(9, 1)), '1 min');
  assert.equal(durationLabel(at(9), at(9, 45)), '45 min');
  assert.equal(durationLabel(at(9), at(10)), '1 hr', 'exactly an hour has no stray minutes');
  assert.equal(durationLabel(at(9), at(11, 20)), '2 hr 20 min');
});

test('a duration is never negative, even if the clocks disagree', () => {
  assert.equal(durationLabel(at(10), at(9)), 'just now');
});

test('startOfDay is midnight of the same calendar day', () => {
  const noon = new Date(2026, 7, 26, 12, 30);
  const midnight = startOfDay(noon);
  assert.equal(midnight.getDate(), 26);
  assert.equal(midnight.getHours(), 0);
  assert.equal(midnight.getMinutes(), 0);
});
