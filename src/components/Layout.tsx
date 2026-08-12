import { ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

interface LayoutProps {
  onHome: () => void;
  children: ReactNode;
}

export function Layout({ onHome, children }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="brand" onClick={onHome} aria-label="Go to home">
          <span className="brand-icon">
            <ShieldCheck size={22} strokeWidth={2.2} />
          </span>
          <span className="brand-name">proofly</span>
        </button>
        <p className="tagline">Verifiable credentials, verified in seconds.</p>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>
          Fully client-side demo — certificates are stored in your browser via
          LocalStorage.
        </p>
      </footer>
    </div>
  );
}
