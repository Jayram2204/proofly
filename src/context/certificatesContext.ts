import { createContext } from 'react';
import type { CertificatesContextValue } from './useCertificates';

export const CertificatesContext =
  createContext<CertificatesContextValue | null>(null);
