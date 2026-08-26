'use client';

import { useRef, useState } from 'react';

import { markHandled, reopenLead } from '../app/actions';
import type { Lead } from '../lib/leads.ts';

type Item = Lead & { ago: string };

const PREVIEW = 3;
const PER_PAGE = 6;
const SNIPPET = 110;

function ActionButton({ lead, handled, onReopen }: { lead: Item; handled: boolean; onReopen: (l: Item) => void }) {
  if (handled) {
    return (
      <button type="button" className="ghost action" onClick={() => onReopen(lead)}>
        Reopen
      </button>
    );
  }
  return (
    <form action={markHandled}>
      <input type="hidden" name="id" value={lead.id} />
      <button type="submit" className="ghost action">
        Mark done
      </button>
    </form>
  );
}

function Row({
  lead,
  handled,
  onReopen,
  onView,
}: {
  lead: Item;
  handled: boolean;
  onReopen: (l: Item) => void;
  onView: (l: Item) => void;
}) {
  const isLong = lead.message.length > SNIPPET;

  return (
    <li>
      <div className="lead-head">
        <div>
          <strong>{lead.name}</strong>
          {lead.isDemo && <span className="tag">example</span>}
          <div className="meta">
            {lead.company ? `${lead.company} · ` : ''}
            <a href={`mailto:${lead.email}`}>{lead.email}</a> · {lead.ago}
          </div>
        </div>
        <ActionButton lead={lead} handled={handled} onReopen={onReopen} />
      </div>

      <p className="message">
        {isLong ? `${lead.message.slice(0, SNIPPET).trimEnd()}… ` : lead.message}
        {isLong && (
          <button type="button" className="link" onClick={() => onView(lead)}>
            Show more
          </button>
        )}
      </p>
    </li>
  );
}

export function InboxList({ items, handled = false }: { items: Item[]; handled?: boolean }) {
  const all = useRef<HTMLDialogElement>(null);
  const detail = useRef<HTMLDialogElement>(null);
  const confirm = useRef<HTMLDialogElement>(null);

  const [pending, setPending] = useState<Item | null>(null);
  const [viewing, setViewing] = useState<Item | null>(null);
  const [page, setPage] = useState(0);

  function askReopen(lead: Item) {
    setPending(lead);
    confirm.current?.showModal();
  }

  function view(lead: Item) {
    setViewing(lead);
    detail.current?.showModal();
  }

  if (items.length === 0) {
    return <p className="empty">{handled ? 'Nothing has been dealt with yet.' : 'No new enquiries right now.'}</p>;
  }

  const pageCount = Math.ceil(items.length / PER_PAGE);
  const shown = items.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <>
      <ul className="leads">
        {items.slice(0, PREVIEW).map((lead) => (
          <Row key={lead.id} lead={lead} handled={handled} onReopen={askReopen} onView={view} />
        ))}
      </ul>

      {items.length > PREVIEW && (
        <button
          type="button"
          className="see-more"
          onClick={() => {
            setPage(0);
            all.current?.showModal();
          }}
        >
          See all {items.length}
        </button>
      )}

      <dialog ref={all} className="modal wide" onClose={() => setPage(0)}>
        <div className="modal-head">
          <h2>{handled ? 'Dealt with' : 'New enquiries'}</h2>
          <button type="button" className="icon-button" onClick={() => all.current?.close()} aria-label="Close">
            ✕
          </button>
        </div>

        <ul className="leads scroller">
          {shown.map((lead) => (
            <Row key={lead.id} lead={lead} handled={handled} onReopen={askReopen} onView={view} />
          ))}
        </ul>

        {pageCount > 1 && (
          <div className="pager">
            <button type="button" className="ghost" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
              ‹ Newer
            </button>
            <span className="meta">
              Page {page + 1} of {pageCount}
            </span>
            <button
              type="button"
              className="ghost"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pageCount - 1}
            >
              Older ›
            </button>
          </div>
        )}
      </dialog>

      <dialog ref={detail} className="modal wide" onClose={() => setViewing(null)}>
        <div className="modal-head">
          <h2>{viewing?.name}</h2>
          <button type="button" className="icon-button" onClick={() => detail.current?.close()} aria-label="Close">
            ✕
          </button>
        </div>

        {viewing && (
          <>
            <p className="meta detail-meta">
              {viewing.company ? `${viewing.company} · ` : ''}
              <a href={`mailto:${viewing.email}`}>{viewing.email}</a> · {viewing.ago}
            </p>
            <div className="scroller">
              <p className="message full">{viewing.message}</p>
            </div>
            <div className="confirm-actions">
              <a className="ghost" href={`mailto:${viewing.email}`}>
                Reply by email
              </a>
              <ActionButton lead={viewing} handled={handled} onReopen={askReopen} />
            </div>
          </>
        )}
      </dialog>

      <dialog ref={confirm} className="modal" onClose={() => setPending(null)}>
        <div className="modal-head">
          <h2>Reopen this enquiry?</h2>
        </div>
        <p className="sub">
          {pending ? `“${pending.name}” goes back to New enquiries, as if nobody had dealt with it yet.` : ''}
        </p>
        <div className="confirm-actions">
          <button type="button" className="link" onClick={() => confirm.current?.close()}>
            Leave it
          </button>
          <form action={reopenLead}>
            <input type="hidden" name="id" value={pending?.id ?? ''} />
            <button type="submit" className="primary" onClick={() => setTimeout(() => confirm.current?.close(), 0)}>
              Reopen
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
