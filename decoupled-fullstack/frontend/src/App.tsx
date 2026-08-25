import { useEffect, useState } from 'react';

export function App() {
  const [status, setStatus] = useState('…');
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL ?? '';
    fetch(`${base}/health`)
      .then((r) => r.json())
      .then((j) => setStatus(JSON.stringify(j.data)))
      .catch(() => setStatus('api unreachable'));
  }, []);
  return (
    <main style={{ fontFamily: 'system-ui', padding: 48 }}>
      <h1>__APP_NAME__</h1>
      <p>API health: {status}</p>
    </main>
  );
}
