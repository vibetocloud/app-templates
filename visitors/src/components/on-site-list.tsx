'use client';

import { useRef, useState } from 'react';

import { signOutVisitor } from '../app/actions';
import type { Visit } from '../lib/visits.ts';

export function OnSiteList({ visits, since }: { visits: (Visit & { duration: string })[]; since: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState<Visit | null>(null);

  function ask(visit: Visit) {
    setPending(visit);
    dialog.current?.showModal();
  }

  return (
    <>
      {visits.length === 0 ? (
        <div className="list-box empty-box">
          <p className="empty">Nobody is signed in right now.</p>
        </div>
      ) : (
        <ul className="visits list-box">
          {visits.map((v) => (
            <li key={v.id}>
              <div className="who">
                <strong>{v.name}</strong>
                {v.isDemo && <span className="tag">example</span>}
                <div className="meta">
                  {v.company ? `${v.company} · ` : ''}visiting {v.host} · {v.duration}
                </div>
              </div>
              <button type="button" className="ghost" onClick={() => ask(v)}>
                Sign out
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="since">{since}</p>

      <dialog ref={dialog} className="modal" onClose={() => setPending(null)}>
        <div className="modal-head">
          <h2>Sign out {pending?.name}?</h2>
        </div>
        <p className="sub">They will be removed from the list of people in the building.</p>
        <div className="confirm-actions">
          <button type="button" className="link" onClick={() => dialog.current?.close()}>
            Not yet
          </button>
          <form action={signOutVisitor}>
            <input type="hidden" name="id" value={pending?.id ?? ''} />
            <button type="submit" className="primary" onClick={() => setTimeout(() => dialog.current?.close(), 0)}>
              Sign out
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
