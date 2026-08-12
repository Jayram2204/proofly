import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';

interface LayoutProps {
  onHome: () => void;
  children: ReactNode;
}

export function Layout({ onHome, children }: LayoutProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    setVerifying(Boolean(new URLSearchParams(window.location.search).get('verify')));
  }, []);

  return (
    <div className="app-shell">
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
        aria-hidden
      />
      <header className="app-header">
        <button className="brand" onClick={onHome} aria-label="Go to home">
          <span className="brand-icon">
            <ShieldCheck size={20} strokeWidth={2.2} />
          </span>
          <span className="brand-name">proofly</span>
        </button>
        <p className="tagline">{verifying ? 'verification' : 'verifiable credentials'}</p>
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
