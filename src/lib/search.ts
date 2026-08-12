import type { Certificate, SearchField } from '../types';

const SEARCH_FIELDS: SearchField[] = [
  'studentName',
  'studentId',
  'course',
  'title',
  'hash',
];

export function filterCertificates(
  certificates: Certificate[],
  query: string,
): Certificate[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return certificates;

  return certificates.filter((cert) =>
    SEARCH_FIELDS.some((field) =>
      cert[field].toLowerCase().includes(needle),
    ),
  );
}
