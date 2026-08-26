'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { signInVisitor, type SignInResult } from '../app/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="primary big" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

export function SignInForm() {
  const [state, action] = useFormState<SignInResult, FormData>(signInVisitor, null);
  const form = useRef<HTMLFormElement>(null);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.ok) {
      form.current?.reset();
      // Ready for the next person without anyone touching the keyboard.
      firstField.current?.focus();
    }
  }, [state]);

  return (
    <form ref={form} action={action} className="form signin">
      <label>
        Your name
        <input ref={firstField} name="name" required autoComplete="off" placeholder="Priya Raman" />
      </label>

      <label>
        Company <span className="optional">optional</span>
        <input name="company" autoComplete="off" placeholder="Northwind Design" />
      </label>

      <label>
        Who are you visiting?
        <input name="host" required autoComplete="off" placeholder="Sam" />
      </label>

      {state && !state.ok && (
        <p role="alert" className="error">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="success">
          Signed in. Welcome — someone will come and get you.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
