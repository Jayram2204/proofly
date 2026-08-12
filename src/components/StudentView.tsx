import { useState, type FormEvent } from 'react';
import { GraduationCap, SearchX } from 'lucide-react';
import type { Certificate } from '../types';
import { useCertificates } from '../context/useCertificates';
import { CertificateCard } from './CertificateCard';

interface StudentViewProps {
  onPrint: (cert: Certificate) => void;
}

export function StudentView({ onPrint }: StudentViewProps) {
  const { findByStudentId } = useCertificates();
  const [studentId, setStudentId] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Certificate[]>([]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setResults(findByStudentId(studentId));
    setSearched(true);
  }

  return (
    <div className="view view-narrow">
      <div className="card">
        <h3 className="card-title">Access Your Certificates</h3>
        <p className="card-subtitle">
          Enter the student ID used when your certificates were issued.
        </p>
        <form className="student-form" onSubmit={handleSubmit}>
          <div className="search-box search-box-lg">
            <GraduationCap size={16} className="search-icon" />
            <input
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setSearched(false);
              }}
              placeholder="e.g. CS2023-001"
              aria-label="Student ID"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            View Certificates
          </button>
        </form>
      </div>

      {searched && results.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <SearchX size={28} />
            <p>No certificates found for student ID “{studentId}”.</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="cert-grid">
          {results.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} onPrint={onPrint} />
          ))}
        </div>
      )}
    </div>
  );
}
