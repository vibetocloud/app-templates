'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { sendEnquiry, type SendResult } from '../app/actions';
import { MESSAGE_MAX } from '../lib/leads.ts';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="primary big" disabled={pending}>
      {pending ? 'Sending…' : 'Send message'}
    </button>
  );
}

export function EnquiryForm() {
  const [state, action] = useFormState<SendResult, FormData>(sendEnquiry, null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="form">
      <label>
        Your name
        <input name="name" required autoComplete="name" placeholder="Hannah Weiss" />
      </label>

      <label>
        Email
        <input name="email" type="email" required autoComplete="email" placeholder="hannah@example.com" />
      </label>

      <label>
        Company <span className="optional">optional</span>
        <input name="company" autoComplete="organization" placeholder="Meadow Cafe" />
      </label>

      <label>
        Message
        <textarea name="message" required rows={5} maxLength={MESSAGE_MAX} placeholder="How can we help?" />
      </label>

      {/* A honeypot: hidden from people, irresistible to bots. Anything typed here is spam. */}
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state && !state.ok && (
        <p role="alert" className="error">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="success">
          Thanks — your message has been sent. We will get back to you by email.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
