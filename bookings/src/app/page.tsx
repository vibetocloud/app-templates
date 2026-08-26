import { Calendar } from '../components/calendar';
import { UpcomingList, type UpcomingItem } from '../components/upcoming-list';
import type { CalendarSearch } from '../lib/types.ts';
import { clearDemoData } from './actions';
import { bookingsBetween, listRooms, upcoming } from '../lib/bookings';
import { addDays, rangeFor, ymd } from '../lib/week.ts';

// Reads live data on every request — no build-time prerender (no database exists during `docker build`).
export const dynamic = 'force-dynamic';

const whenLong = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
});
const rangeLabel = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const dayLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

export default async function Home({ searchParams }: { searchParams: CalendarSearch }) {
  const view = searchParams.view === 'day' ? 'day' : 'week';
  const today = ymd(new Date());
  const date = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.date ?? '') ? (searchParams.date as string) : today;

  const { start, end, dayCount } = rangeFor(view, date);
  const dayKeys = Array.from({ length: dayCount }, (_, i) => ymd(addDays(start, i)));

  const [rooms, bookings, next] = await Promise.all([listRooms(), bookingsBetween(start, end), upcoming()]);

  const upcomingItems: UpcomingItem[] = next.map((b) => ({
    id: b.id,
    title: b.title,
    roomName: b.room.name,
    bookedBy: b.bookedBy,
    when: whenLong.format(b.startsAt),
    isDemo: b.isDemo,
  }));

  const label =
    view === 'week'
      ? `${rangeLabel.format(start)} – ${rangeLabel.format(addDays(end, -1))}`
      : dayLabel.format(start);

  return (
    <main className="page">
      <header className="page-head">
        <h1>Room bookings</h1>
        <p className="sub">{label}</p>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <section className="card">
            <h2>Upcoming</h2>
            <UpcomingList items={upcomingItems} />
            {upcomingItems.some((b) => b.isDemo) && (
              <form action={clearDemoData} className="clear-demo">
                <button type="submit" className="link">
                  Remove the example bookings
                </button>
              </form>
            )}
          </section>

          <section className="card hints">
            <h2>Make it yours</h2>
            <p className="sub">Ask Claude Code for changes in plain language. For example:</p>
            <ul>
              <li>“Put a password on this page so only my team can open it.”</li>
              <li>“Add a phone number to each booking.”</li>
              <li>“Let people book equipment as well as rooms.”</li>
              <li>“Don’t allow bookings outside 08:00–18:00.”</li>
              <li>“Email me whenever someone books the workshop space.”</li>
            </ul>
          </section>
        </aside>

        <div className="main">
          <Calendar
            view={view}
            dayKeys={dayKeys}
            todayKey={today}
            todayDate={today}
            prevDate={ymd(addDays(start, -dayCount))}
            nextDate={ymd(addDays(start, dayCount))}
            rooms={rooms}
            bookings={bookings}
          />
        </div>
      </div>
    </main>
  );
}
