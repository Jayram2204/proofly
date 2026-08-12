import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Landmark, ScanLine } from 'lucide-react';
import { GlitchText } from './GlitchText';

const ThreeScene = lazy(() =>
  import('./ThreeScene').then((module) => ({ default: module.ThreeScene })),
);

interface LandingProps {
  onSelectCollege: () => void;
  onSelectStudent: () => void;
  issuedCount: number;
}

const roles = [
  {
    icon: <Landmark size={24} />,
    title: 'College',
    description: 'Mint credentials, manage issued certificates and share them.',
    action: 'onSelectCollege',
    accent: 'accent-blue',
  },
  {
    icon: <GraduationCap size={24} />,
    title: 'Student',
    description: 'Access your certificates with your student ID.',
    action: 'onSelectStudent',
    accent: 'accent-green',
  },
] as const;

export function Landing({
  onSelectCollege,
  onSelectStudent,
  issuedCount,
}: LandingProps) {
  const actions: Record<(typeof roles)[number]['action'], () => void> = {
    onSelectCollege,
    onSelectStudent,
  };

  return (
    <div className="landing">
      <Suspense fallback={null}>
        <ThreeScene />
      </Suspense>
      <div className="landing-overlay" />

      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="pill">
            <ScanLine size={14} />
            SHA-256 hashed · QR verified
          </span>
          <GlitchText
            text="Certificates you can prove."
            className="hero-title"
          />
          <p className="hero-sub">
            Colleges mint tamper-evident credentials; students share them with a
            single link and anyone can verify authenticity by hash or QR code.
          </p>
          <div className="hero-stats">
            <div>
              <strong>{issuedCount}</strong>
              <span>certificates issued</span>
            </div>
            <div>
              <strong>256-bit</strong>
              <span>SHA-256 integrity</span>
            </div>
            <div>
              <strong>0</strong>
              <span>server required</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="role-grid">
        {roles.map((role, index) => (
          <motion.button
            key={role.title}
            className={`role-card ${role.accent}`}
            onClick={actions[role.action]}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.15 * (index + 1),
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -4 }}
          >
            <span className="role-icon">{role.icon}</span>
            <span className="role-title">{role.title}</span>
            <span className="role-description">{role.description}</span>
            <span className="role-cta">
              Continue <span aria-hidden>→</span>
            </span>
          </motion.button>
        ))}
      </section>
    </div>
  );
}
