'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { BookingForm } from './booking-form';
import { DeleteBookingButton } from './delete-booking-button';
import { DAY_END_HOUR, DAY_START_HOUR, assignLanes, placeInDay } from '../lib/week.ts';
import type { CalendarBooking, Room } from '../lib/types.ts';

type Props = {
  view: 'day' | 'week';
  dayKeys: string[];
  todayKey: string;
  prevDate: string;
  nextDate: string;
  todayDate: string;
  rooms: Room[];
  bookings: CalendarBooking[];
};

const HOURS = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, i) => DAY_START_HOUR + i);

const dayName = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' });
const dayNum = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const clock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

export function Calendar(props: Props) {
  const { view, dayKeys, todayKey, prevDate, nextDate, todayDate, rooms, bookings } = props;

  const dialog = useRef<HTMLDialogElement>(null);
  const [slot, setSlot] = useState<{ start: string; end: string } | null>(null);
  const [editing, setEditing] = useState<CalendarBooking | null>(null);

  function openNew(dayKey: string, hour: number) {
    const pad = (n: number) => String(n).padStart(2, '0');
    setEditing(null);
    setSlot({ start: `${dayKey}T${pad(hour)}:00`, end: `${dayKey}T${pad(hour + 1)}:00` });
    dialog.current?.showModal();
  }

  function openEdit(booking: CalendarBooking) {
    setSlot(null);
    setEditing(booking);
    dialog.current?.showModal();
  }

  function close() {
    dialog.current?.close();
  }

  function reset() {
    setSlot(null);
    setEditing(null);
  }

  const href = (v: string, d: string) => `/?view=${v}&date=${d}`;

  return (
    <>
      <div className="toolbar">
        <nav className="pager">
          <Link href={href(view, prevDate)} aria-label="Previous">
            ‹
          </Link>
          <Link href={href(view, todayDate)}>Today</Link>
          <Link href={href(view, nextDate)} aria-label="Next">
            ›
          </Link>
        </nav>

        <div className="toolbar-right">
          <div className="switch" role="group" aria-label="Calendar view">
            <Link href={href('day', dayKeys[0])} className={view === 'day' ? 'on' : ''}>
              Day
            </Link>
            <Link href={href('week', dayKeys[0])} className={view === 'week' ? 'on' : ''}>
              Week
            </Link>
          </div>
          <button type="button" className="primary" onClick={() => openNew(todayDate, 9)}>
            Reserve a room
          </button>
        </div>
      </div>

      <div className="calendar card">
        <div className="cal-head" style={{ ['--days' as string]: dayKeys.length }}>
          <div className="gutter" />
          {dayKeys.map((key) => (
            <div key={key} className={`col-head${key === todayKey ? ' today' : ''}`}>
              <span className="dow">{dayName.format(new Date(`${key}T00:00:00Z`))}</span>
              <span className="dom">{dayNum.format(new Date(`${key}T00:00:00Z`))}</span>
            </div>
          ))}
        </div>

        <div className="cal-scroll">
          <div className="cal-body" style={{ ['--days' as string]: dayKeys.length }}>
          <div className="gutter">
            {HOURS.map((h) => (
              <div key={h} className="hour-label">
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {dayKeys.map((key) => {
            const dayStart = new Date(`${key}T00:00:00Z`);
            const dayEnd = new Date(dayStart.getTime() + 86400000);
            const ofDay = bookings
              .map((b) => ({ source: b, startsAt: new Date(b.startsAt), endsAt: new Date(b.endsAt) }))
              .filter((b) => b.startsAt < dayEnd && b.endsAt > dayStart);
            const { placed, laneCount } = assignLanes(ofDay);

            return (
              <div key={key} className={`day-col${key === todayKey ? ' today' : ''}`}>
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className="slot"
                    onClick={() => openNew(key, h)}
                    aria-label={`Reserve a room on ${key} at ${String(h).padStart(2, '0')}:00`}
                  />
                ))}

                {placed.map(({ booking, lane }) => {
                  const { top, height } = placeInDay(booking, dayStart);
                  const { source } = booking;
                  return (
                    <button
                      type="button"
                      key={source.id}
                      className={`event${source.isDemo ? ' demo' : ''}`}
                      onClick={() => openEdit(source)}
                      style={{
                        top: `${top}%`,
                        height: `${height}%`,
                        left: `calc(${(lane / laneCount) * 100}% + 2px)`,
                        width: `calc(${100 / laneCount}% - 4px)`,
                      }}
                      title={`Edit “${source.title}” · ${source.roomName} · ${source.bookedBy}`}
                    >
                      <strong>{source.title}</strong>
                      <span className="ev-meta">
                        {clock.format(booking.startsAt)} · {source.roomName}
                      </span>
                    </button>
                  );
                })}
              </div>
              );
            })}
          </div>
        </div>
      </div>

      <dialog ref={dialog} className="modal" onClose={reset}>
        <div className="modal-head">
          <h2>{editing ? 'Edit booking' : 'Reserve a room'}</h2>
          <button type="button" className="icon-button" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>

        <BookingForm
          key={editing?.id ?? slot?.start ?? 'new'}
          rooms={rooms}
          editing={editing}
          defaultStart={slot?.start}
          defaultEnd={slot?.end}
          onDone={close}
          onClose={close}
          footerStart={editing ? <DeleteBookingButton id={editing.id} onDone={close} /> : null}
        />
      </dialog>
    </>
  );
}
