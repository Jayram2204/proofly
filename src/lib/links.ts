import type { Certificate } from '../types';

export function verifyUrl(hash: string): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?verify=${encodeURIComponent(hash)}`;
}

export function certificateVerifyUrl(cert: Certificate): string {
  const url = new URL(window.location.href);
  url.searchParams.set('verify', cert.hash);
  if (cert.issuer) {
    url.searchParams.set('issuer', cert.issuer);
  }
  return url.toString();
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
