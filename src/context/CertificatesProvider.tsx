import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Certificate } from '../types';
import {
  loadCertificates,
  saveCertificates,
} from '../lib/verification';
import { CertificatesContext } from './certificatesContext';

export function CertificatesProvider({ children }: { children: ReactNode }) {
  const [certificates, setCertificates] = useState<Certificate[]>(() =>
    loadCertificates(),
  );

  useEffect(() => {
    saveCertificates(certificates);
  }, [certificates]);

  const addCertificate = useCallback((cert: Certificate) => {
    setCertificates((prev) => [cert, ...prev]);
  }, []);

  const findById = useCallback(
    (id: string) => certificates.find((cert) => cert.id === id),
    [certificates],
  );

  const findByHash = useCallback(
    (hash: string) =>
      certificates.find(
        (cert) => cert.hash.toLowerCase() === hash.toLowerCase(),
      ),
    [certificates],
  );

  const findByStudentId = useCallback(
    (studentId: string) =>
      certificates
        .filter(
          (cert) =>
            cert.studentId.toLowerCase() === studentId.trim().toLowerCase(),
        )
        .sort((a, b) => b.issuedAt - a.issuedAt),
    [certificates],
  );

  const value = useMemo(
    () => ({
      certificates,
      addCertificate,
      findById,
      findByHash,
      findByStudentId,
    }),
    [certificates, addCertificate, findById, findByHash, findByStudentId],
  );

  return (
    <CertificatesContext.Provider value={value}>
      {children}
    </CertificatesContext.Provider>
  );
}
