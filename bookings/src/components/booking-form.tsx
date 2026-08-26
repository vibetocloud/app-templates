'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { createBooking, updateBooking } from '../app/actions';
import { toInputValue } from '../lib/week.ts';
import type { BookingResult, CalendarBooking, Room } from '../lib/types.ts';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="primary" disabled={pending}>
      {pending ? 'Saving…' : label}
    </button>
  );
}

type Props = {
  rooms: Room[];
  editing?: CalendarBooking | null;
  defaultStart?: string;
  defaultEnd?: string;
  onDone?: () => void;
  /** Sits at the left of the button row — the delete control when editing. */
  footerStart?: ReactNode;
  onClose?: () => void;
};

export function BookingForm({ rooms, editing, defaultStart, defaultEnd, onDone, footerStart, onClose }: Props) {
  const [state, action] = useFormState<BookingResult, FormData>(editing ? updateBooking : createBooking, null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      form.current?.reset();
      onDone?.();
    }
  }, [state, onDone]);

  return (
    <form ref={form} action={action} className="form">
      {editing && <input type="hidden" name="id" value={editing.id} />}

      <label>
        Room
        <select name="roomId" required defaultValue={editing?.roomId ?? rooms[0]?.id}>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} — up to {r.capacity} people
            </option>
          ))}
        </select>
      </label>

      <label>
        What is it for?
        <input name="title" required placeholder="Team meeting" defaultValue={editing?.title} />
      </label>

      <label>
        Your name
        <input name="bookedBy" required placeholder="Sam" defaultValue={editing?.bookedBy} />
      </label>

      <div className="row">
        <label>
          From
          <input
            type="datetime-local"
            name="startsAt"
            required
            defaultValue={editing ? toInputValue(editing.startsAt) : defaultStart}
          />
        </label>
        <label>
          Until
          <input
            type="datetime-local"
            name="endsAt"
            required
            defaultValue={editing ? toInputValue(editing.endsAt) : defaultEnd}
          />
        </label>
      </div>

      {state && !state.ok && (
        <p role="alert" className="error">
          {state.error}
        </p>
      )}

      <div className="form-actions">
        <div className="form-actions-left">{footerStart}</div>
        <div className="form-actions-right">
          <button type="button" className="link" onClick={onClose}>
            Close
          </button>
          <SubmitButton label={editing ? 'Save changes' : 'Book it'} />
        </div>
      </div>
    </form>
  );
}
