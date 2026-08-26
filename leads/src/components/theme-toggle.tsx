'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  // The real theme was already applied by the script in layout.tsx before paint;
  // this just catches up the button label.
  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? 'dark');
  }, []);

  function flip() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Private browsing can refuse storage. The theme still switches for this visit.
    }
    setTheme(next);
  }

  return (
    <button type="button" className="ghost" onClick={flip} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      {theme === 'dark' ? '☀ Light' : '☾ Dark'}
    </button>
  );
}
