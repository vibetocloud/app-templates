import { EnquiryForm } from '../components/enquiry-form';
import { InboxList } from '../components/inbox-list';
import { ThemeToggle } from '../components/theme-toggle';
import { clearDemoLeads } from './actions';
import { handledLeads, newLeads } from '../lib/inbox';
import { agoLabel } from '../lib/leads.ts';

// Reads live data on every request — no build-time prerender (no database exists during `docker build`).
export const dynamic = 'force-dynamic';

export default async function Home() {
  const now = new Date();
  const [fresh, done] = await Promise.all([newLeads(), handledLeads()]);

  const withAgo = (list: typeof fresh) =>
    list.map((lead) => ({ ...lead, ago: agoLabel(new Date(lead.handledAt ?? lead.createdAt), now) }));

  const hasDemo = [...fresh, ...done].some((l) => l.isDemo);

  return (
    <main className="page">
      <header className="page-head">
        <div>
          <h1>Get in touch</h1>
          <p className="sub">Send us a message and we will come back to you by email.</p>
        </div>
        <ThemeToggle />
      </header>

      <div className="layout">
        <div className="main-col">
          <section className="card">
            <h2>Send a message</h2>
            <EnquiryForm />
          </section>

          <section className="card hints">
            <h2>Make it yours</h2>
            <p className="sub">Ask Claude Code for changes in plain language. For example:</p>
            <ul>
              <li>“Put a password on the inbox so only my team can read it.”</li>
              <li>“Email me whenever a new enquiry comes in.”</li>
              <li>“Ask people which service they are interested in.”</li>
              <li>“Let me download the enquiries as a spreadsheet.”</li>
              <li>“Add a note field so I can record what I told them.”</li>
            </ul>
          </section>
        </div>

        <div className="side">
          <section className="card">
            <h2>
              New enquiries <span className="count">{fresh.length}</span>
            </h2>
            <InboxList items={withAgo(fresh)} />
          </section>

          <section className="card">
            <h2>
              Dealt with <span className="count">{done.length}</span>
            </h2>
            <InboxList items={withAgo(done)} handled />

            {hasDemo && (
              <form action={clearDemoLeads} className="clear-demo">
                <button type="submit" className="link">
                  Remove the example enquiries
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
