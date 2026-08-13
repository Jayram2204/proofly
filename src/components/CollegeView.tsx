import { useMemo, useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import type { Certificate } from '../types';
import { filterCertificates } from '../lib/search';
import { APTOS_CONFIG } from '../config';
import { useCertificates } from '../context/useCertificates';
import { CertificateCard } from './CertificateCard';
import { MintForm } from './MintForm';
import { WalletPanel } from './WalletPanel';

interface CollegeViewProps {
  certificates: Certificate[];
  onPrint: (cert: Certificate) => void;
}

export function CollegeView({ certificates, onPrint }: CollegeViewProps) {
  const { updateCertificate } = useCertificates();
  const [query, setQuery] = useState('');
  const [anchoringId, setAnchoringId] = useState<string | null>(null);
  const [anchorError, setAnchorError] = useState<string | null>(null);

  const results = useMemo(
    () => filterCertificates(certificates, query),
    [certificates, query],
  );

  const unanchored = results.filter((cert) => !cert.anchored).length;

  async function handleAnchor(cert: Certificate) {
    setAnchorError(null);
    setAnchoringId(cert.id);
    try {
      const { anchorHash } = await import('../lib/aptos');
      await anchorHash(cert.hash);
      const account = await window.aptos?.account();
      updateCertificate(cert.id, {
        anchored: true,
        issuer: account?.address,
      });
    } catch (err) {
      setAnchorError(
        err instanceof Error ? err.message : 'Anchoring transaction failed.',
      );
    } finally {
      setAnchoringId(null);
    }
  }

  return (
    <div className="view">
      <WalletPanel />

      {anchorError && (
        <div className="card">
          <p className="form-error">{anchorError}</p>
        </div>
      )}

      <MintForm />

      <div className="card">
        <div className="card-head">
          <div>
            <h3 className="card-title">Issued Certificates</h3>
            <p className="card-subtitle">
              {certificates.length} issued ·{' '}
              {APTOS_CONFIG.isConfigured ? `${unanchored} pending anchor` : 'anchoring disabled'} · search by name, ID, course, title or hash
            </p>
          </div>
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search certificates…"
              aria-label="Search certificates"
            />
          </div>
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <SearchX size={28} />
            <p>
              {certificates.length === 0
                ? 'No certificates issued yet. Mint your first one above.'
                : 'No certificates match your search.'}
            </p>
          </div>
        ) : (
          <div className="cert-grid">
            {results.map((cert) => (
              <CertificateCard
                key={cert.id}
                cert={cert}
                onPrint={onPrint}
                onAnchor={handleAnchor}
                anchoring={anchoringId === cert.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
