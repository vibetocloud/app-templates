import { OnSiteList } from '../components/on-site-list';
import { SignInForm } from '../components/sign-in-form';
import { clearDemoVisits } from './actions';
import { onSite, signedOutToday } from '../lib/visitors';
import { durationLabel } from '../lib/visits.ts';

// Reads live data on every request — no build-time prerender (no database exists during `docker build`).
export const dynamic = 'force-dynamic';

const clock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

export default async function Home() {
  const now = new Date();
  const [here, earlier] = await Promise.all([onSite(), signedOutToday(now)]);

  const withDuration = here.map((v) => ({
    ...v,
    duration: durationLabel(new Date(v.signedInAt), now),
  }));

  const hasDemo = [...here, ...earlier].some((v) => v.isDemo);

  return (
    <main className="page">
      <header className="page-head">
        <h1>Welcome</h1>
        <p className="sub">Please sign in below. If you are leaving, sign yourself out on the right.</p>
      </header>

      <div className="layout">
        <div className="main-col">
          <section className="card">
            <h2>Sign in</h2>
            <SignInForm />
          </section>

          <section className="card hints">
            <h2>Make it yours</h2>
            <p className="sub">Ask Claude Code for changes in plain language. For example:</p>
            <ul>
              <li>“Put a password on this page so only my team can open it.”</li>
              <li>“Ask visitors to agree to the safety rules before signing in.”</li>
              <li>“Email the host when their visitor signs in.”</li>
              <li>“Sign everyone out automatically at 18:00.”</li>
              <li>“Let me download today’s visitors as a spreadsheet.”</li>
            </ul>
          </section>
        </div>

        <div className="side">
          <section className="card">
            <h2>
              In the building <span className="count">{here.length}</span>
            </h2>
            <OnSiteList visits={withDuration} since={`As of ${clock.format(now)}`} />
          </section>

          <section className="card">
            <h2>Signed out today</h2>
            {earlier.length === 0 ? (
              <p className="empty">Nobody has signed out yet today.</p>
            ) : (
              <ul className="visits short">
                {earlier.map((v) => (
                  <li key={v.id}>
                    <div className="who">
                      <strong>{v.name}</strong>
                      {v.isDemo && <span className="tag">example</span>}
                      <div className="meta">
                        visiting {v.host} ·{' '}
                        {durationLabel(new Date(v.signedInAt), new Date(v.signedOutAt as string))}
                      </div>
                    </div>
                    <span className="meta">{clock.format(new Date(v.signedOutAt as string))}</span>
                  </li>
                ))}
              </ul>
            )}

            {hasDemo && (
              <form action={clearDemoVisits} className="clear-demo">
                <button type="submit" className="link">
                  Remove the example visitors
                </button>
              </form>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
