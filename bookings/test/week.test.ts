import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  addDays,
  assignLanes,
  fromInputValue,
  placeInDay,
  rangeFor,
  startOfWeek,
  toInputValue,
  ymd,
} from '../src/lib/week.ts';

const day = (s) => new Date(`${s}T00:00:00Z`);
const at = (s, h, m = 0) => new Date(Date.UTC(...s.split('-').map(Number).map((n, i) => (i === 1 ? n - 1 : n)), h, m));

test('the week starts on Monday', () => {
  // 2026-08-26 is a Wednesday.
  assert.equal(ymd(startOfWeek(day('2026-08-26'))), '2026-08-24');
  // A Monday is already the start.
  assert.equal(ymd(startOfWeek(day('2026-08-24'))), '2026-08-24');
  // A Sunday belongs to the week that began the previous Monday.
  assert.equal(ymd(startOfWeek(day('2026-08-30'))), '2026-08-24');
});

test('rangeFor covers 7 days for a week and 1 for a day', () => {
  const week = rangeFor('week', '2026-08-26');
  assert.equal(ymd(week.start), '2026-08-24');
  assert.equal(week.dayCount, 7);
  assert.equal(ymd(week.end), '2026-08-31', 'end is exclusive');

  const single = rangeFor('day', '2026-08-26');
  assert.equal(ymd(single.start), '2026-08-26');
  assert.equal(single.dayCount, 1);
  assert.equal(ymd(single.end), '2026-08-27');
});

test('placeInDay positions a booking within the visible hours', () => {
  const d = day('2026-08-26');
  // Visible window is 08:00-20:00, so 12 hours.
  const midday = placeInDay({ startsAt: at('2026-08-26', 14), endsAt: at('2026-08-26', 15) }, d);
  assert.equal(Math.round(midday.top), 50, '14:00 is halfway through 08:00-20:00');
  assert.equal(Math.round(midday.height), 8, 'one hour of twelve');

  const early = placeInDay({ startsAt: at('2026-08-26', 8), endsAt: at('2026-08-26', 20) }, d);
  assert.equal(early.top, 0);
  assert.equal(early.height, 100);
});

test('placeInDay clamps a booking that starts before or ends after the window', () => {
  const d = day('2026-08-26');
  const overnight = placeInDay({ startsAt: at('2026-08-26', 6), endsAt: at('2026-08-26', 23) }, d);
  assert.equal(overnight.top, 0, 'clamped to the top of the window');
  assert.equal(overnight.height, 100, 'clamped to the bottom');
});

test('assignLanes puts clashing bookings side by side and reuses free lanes', () => {
  const a = { startsAt: at('2026-08-26', 9), endsAt: at('2026-08-26', 11) };
  const b = { startsAt: at('2026-08-26', 10), endsAt: at('2026-08-26', 12) };
  const c = { startsAt: at('2026-08-26', 13), endsAt: at('2026-08-26', 14) };

  const { placed, laneCount } = assignLanes([b, a, c]);
  assert.equal(laneCount, 2, 'two bookings overlap, so two lanes');
  assert.equal(placed.find((p) => p.booking === a).lane, 0);
  assert.equal(placed.find((p) => p.booking === b).lane, 1, 'b clashes with a');
  assert.equal(placed.find((p) => p.booking === c).lane, 0, 'c is after both, lane 0 is free again');
});

test('addDays does not drift', () => {
  assert.equal(ymd(addDays(day('2026-08-31'), 1)), '2026-09-01');
  assert.equal(ymd(addDays(day('2026-01-01'), -1)), '2025-12-31');
});

test('a datetime-local value is read as UTC, with or without seconds', () => {
  assert.equal(fromInputValue('2026-08-26T14:00').toISOString(), '2026-08-26T14:00:00.000Z');
  assert.equal(fromInputValue('2026-08-26T14:00:30').toISOString(), '2026-08-26T14:00:30.000Z');
});

test('a booking survives a round trip through the form', () => {
  // This is the point of pinning to UTC: 14:00 in, 14:00 out, on any server.
  const entered = '2026-08-26T14:00';
  const stored = fromInputValue(entered);
  assert.equal(toInputValue(stored.toISOString()), entered);
});
