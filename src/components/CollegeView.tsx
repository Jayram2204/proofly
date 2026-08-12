import { useMemo, useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import type { Certificate } from '../types';
import { filterCertificates } from '../lib/search';
import { CertificateCard } from './CertificateCard';
import { MintForm } from './MintForm';

interface CollegeViewProps {
  certificates: Certificate[];
  onPrint: (cert: Certificate) => void;
}

export function CollegeView({ certificates, onPrint }: CollegeViewProps) {
  const [query, setQuery] = useState('');
  const results = useMemo(
    () => filterCertificates(certificates, query),
    [certificates, query],
  );

  return (
    <div className="view">
      <MintForm />

      <div className="card">
        <div className="card-head">
          <div>
            <h3 className="card-title">Issued Certificates</h3>
            <p className="card-subtitle">
              {certificates.length} issued · search by name, ID, course, title
              or hash
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
              <CertificateCard key={cert.id} cert={cert} onPrint={onPrint} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
