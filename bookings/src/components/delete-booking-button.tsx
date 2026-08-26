'use client';

import { useState, useTransition } from 'react';

import { cancelBooking } from '../app/actions';

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

/**
 * Deleting asks first, in place. A second dialog on top of this one would work,
 * but two stacked modals to remove one booking is a lot of ceremony.
 */
export function DeleteBookingButton({ id, onDone }: { id: string; onDone: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function remove() {
    const form = new FormData();
    form.set('id', id);
    startTransition(async () => {
      await cancelBooking(form);
      onDone();
    });
  }

  if (!confirming) {
    return (
      <button
        type="button"
        className="icon-button danger"
        onClick={() => setConfirming(true)}
        aria-label="Delete this booking"
        title="Delete this booking"
      >
        <TrashIcon />
      </button>
    );
  }

  return (
    <span className="confirm-inline">
      <button type="button" className="link" onClick={() => setConfirming(false)} disabled={pending}>
        Keep
      </button>
      <button type="button" className="destructive small" onClick={remove} disabled={pending}>
        {pending ? 'Deleting…' : 'Delete'}
      </button>
    </span>
  );
}
