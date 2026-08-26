import assert from 'node:assert/strict';
import { test } from 'node:test';

import { bookingProblem, clashes } from '../src/lib/overlap.ts';

const at = (h) => new Date(`2026-01-01T${String(h).padStart(2, '0')}:00:00Z`);
const range = (from, to) => ({ startsAt: at(from), endsAt: at(to) });

test('ranges that share time clash', () => {
  assert.ok(clashes(range(9, 11), range(10, 12)), 'partial overlap');
  assert.ok(clashes(range(9, 12), range(10, 11)), 'fully contained');
  assert.ok(clashes(range(10, 11), range(9, 12)), 'fully containing');
  assert.ok(clashes(range(9, 10), range(9, 10)), 'identical');
});

test('back-to-back ranges do not clash', () => {
  assert.ok(!clashes(range(9, 10), range(10, 11)));
  assert.ok(!clashes(range(10, 11), range(9, 10)));
});

test('bookingProblem rejects bad input', () => {
  assert.match(bookingProblem(range(11, 10), []), /after the start/);
  assert.match(bookingProblem(range(10, 10), []), /after the start/);
  assert.match(bookingProblem({ startsAt: new Date('nope'), endsAt: at(10) }, []), /start time/);
});

test('bookingProblem rejects a double booking but allows a free slot', () => {
  const existing = [range(9, 10), range(14, 15)];
  assert.match(bookingProblem(range(9, 10), existing), /already booked/);
  assert.equal(bookingProblem(range(10, 14), existing), null, 'fits exactly between two bookings');
  assert.equal(bookingProblem(range(16, 17), existing), null);
});
