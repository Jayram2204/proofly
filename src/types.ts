export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  title: string;
  details: string;
  issueDate: string;
  hash: string;
  issuedAt: number;
  /** Hash anchored on-chain by the issuer's Aptos account. */
  anchored?: boolean;
  /** Aptos address of the issuing account. */
  issuer?: string;
}

export interface CertificateInput {
  studentId: string;
  studentName: string;
  course: string;
  title: string;
  details: string;
  issueDate: string;
}

export type SearchField =
  | 'studentName'
  | 'studentId'
  | 'course'
  | 'title'
  | 'hash';

export type AppView = 'landing' | 'college' | 'student';
