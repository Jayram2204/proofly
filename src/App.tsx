import { useEffect, useState } from 'react';
import type { AppView, Certificate } from './types';
import { CertificatesProvider } from './context/CertificatesProvider';
import { useCertificates } from './context/useCertificates';
import { Layout } from './components/Layout';
import { Landing } from './components/Landing';
import { CollegeView } from './components/CollegeView';
import { StudentView } from './components/StudentView';
import { VerifyPage } from './components/VerifyPage';
import { PrintCertificate } from './components/PrintCertificate';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  return (
    <CertificatesProvider>
      <CustomCursor />
      <AppContent />
    </CertificatesProvider>
  );
}

function AppContent() {
  const { certificates } = useCertificates();
  const [view, setView] = useState<AppView>('landing');
  const [verifyHash, setVerifyHash] = useState<string | null>(null);
  const [printCert, setPrintCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verify = params.get('verify');
    if (verify) {
      setVerifyHash(verify);
      setView('landing');
    }
  }, []);

  useEffect(() => {
    if (!printCert) return;
    window.print();
    const clear = () => setPrintCert(null);
    window.addEventListener('afterprint', clear);
    return () => window.removeEventListener('afterprint', clear);
  }, [printCert]);

  function goHome() {
    setView('landing');
    setVerifyHash(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('verify');
    window.history.replaceState({}, '', url);
  }

  if (verifyHash) {
    return (
      <>
        <Layout onHome={goHome}>
          <VerifyPage hash={verifyHash} />
        </Layout>
        {printCert && <PrintCertificate cert={printCert} />}
      </>
    );
  }

  return (
    <>
      <Layout onHome={goHome}>
        {view === 'landing' && (
          <Landing
            issuedCount={certificates.length}
            onSelectCollege={() => setView('college')}
            onSelectStudent={() => setView('student')}
          />
        )}
        {view === 'college' && (
          <CollegeView certificates={certificates} onPrint={setPrintCert} />
        )}
        {view === 'student' && <StudentView onPrint={setPrintCert} />}
      </Layout>
      {printCert && <PrintCertificate cert={printCert} />}
    </>
  );
}
