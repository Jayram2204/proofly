import { motion } from 'framer-motion';
import { GraduationCap, Landmark, ScanLine } from 'lucide-react';

interface LandingProps {
  onSelectCollege: () => void;
  onSelectStudent: () => void;
  issuedCount: number;
}

export function Landing({
  onSelectCollege,
  onSelectStudent,
  issuedCount,
}: LandingProps) {
  const roles = [
    {
      icon: <Landmark size={26} />,
      title: 'College',
      description: 'Mint credentials, manage issued certificates and share them.',
      action: onSelectCollege,
      accent: 'accent-blue',
    },
    {
      icon: <GraduationCap size={26} />,
      title: 'Student',
      description: 'Access your certificates with your student ID.',
      action: onSelectStudent,
      accent: 'accent-green',
    },
  ];

  return (
    <div className="landing">
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="pill">
            <ScanLine size={14} />
            SHA-256 hashed · QR verified
          </span>
          <h1>Certificates you can prove.</h1>
          <p>
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
            onClick={role.action}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 * (index + 1) }}
          >
            <span className="role-icon">{role.icon}</span>
            <span className="role-title">{role.title}</span>
            <span className="role-description">{role.description}</span>
            <span className="role-cta">Continue →</span>
          </motion.button>
        ))}
      </section>
    </div>
  );
}
