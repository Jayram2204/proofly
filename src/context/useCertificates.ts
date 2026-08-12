import { useContext } from 'react';
import { CertificatesContext } from './certificatesContext';
import type { Certificate } from '../types';

export interface CertificatesContextValue {
  certificates: Certificate[];
  addCertificate: (cert: Certificate) => void;
  findById: (id: string) => Certificate | undefined;
  findByHash: (hash: string) => Certificate | undefined;
  findByStudentId: (studentId: string) => Certificate[];
}

export function useCertificates(): CertificatesContextValue {
  const ctx = useContext(CertificatesContext);
  if (!ctx) {
    throw new Error('useCertificates must be used within CertificatesProvider');
  }
  return ctx;
}
