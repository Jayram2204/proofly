import type { Certificate, CertificateInput } from '../types';

const STORAGE_KEY = 'proofly.certificates.v1';

export function loadCertificates(): Certificate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveCertificates(certificates: Certificate[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
}

export function toCanonicalString(input: CertificateInput): string {
  return [
    input.studentId.trim().toLowerCase(),
    input.studentName.trim().toLowerCase(),
    input.course.trim().toLowerCase(),
    input.title.trim().toLowerCase(),
    input.details.trim().toLowerCase(),
    input.issueDate,
  ].join('|');
}

export async function computeHash(input: CertificateInput): Promise<string> {
  const data = toCanonicalString(input);
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `pf-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
