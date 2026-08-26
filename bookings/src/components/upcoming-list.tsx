'use client';

import { useRef, useState } from 'react';

import { cancelBooking } from '../app/actions';

/** Pre-formatted for display — the server owns date formatting so it stays UTC. */
export type UpcomingItem = {
  id: string;
  title: string;
  roomName: string;
  bookedBy: string;
  when: string;
  isDemo: boolean;
};

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.6 9a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9L12 4M6.5 7v4M9.5 7v4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UpcomingList({ items }: { items: UpcomingItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState<UpcomingItem | null>(null);

  function ask(item: UpcomingItem) {
    setPending(item);
    dialog.current?.showModal();
  }

  if (items.length === 0) {
    return (
      <div className="bookings-box empty-box">
        <p className="empty">Nothing booked yet. Pick a slot in the calendar to make the first booking.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="bookings bookings-box">
        {items.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.title}</strong>
              {item.isDemo && <span className="tag">example</span>}
              <div className="meta">
                {item.roomName} · {item.when} · {item.bookedBy}
              </div>
            </div>
            <button
              type="button"
              className="icon-button danger"
              onClick={() => ask(item)}
              aria-label={`Cancel ${item.title}`}
              title="Cancel this booking"
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>

      <dialog ref={dialog} className="modal" onClose={() => setPending(null)}>
        <div className="modal-head">
          <h2>Cancel this booking?</h2>
        </div>
        <p className="sub">
          {pending ? `“${pending.title}” — ${pending.roomName}, ${pending.when}.` : ''} This cannot be undone.
        </p>
        <div className="confirm-actions">
          <button type="button" className="link" onClick={() => dialog.current?.close()}>
            Keep it
          </button>
          <form action={cancelBooking}>
            <input type="hidden" name="id" value={pending?.id ?? ''} />
            <button type="submit" className="destructive" onClick={() => setTimeout(() => dialog.current?.close(), 0)}>
              Yes, cancel it
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
