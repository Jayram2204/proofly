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
