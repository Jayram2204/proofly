import { QRCodeSVG } from 'qrcode.react';
import type { Certificate } from '../types';
import { certificateVerifyUrl, formatDate } from '../lib/links';

export function PrintCertificate({ cert }: { cert: Certificate }) {
  const url = certificateVerifyUrl(cert);
  return (
    <div className="print-only" aria-hidden>
      <div className="print-sheet">
        <header className="print-header">
          <p className="print-brand">proofly</p>
          <p className="print-org">Verifiable Credential</p>
        </header>
        <main className="print-main">
          <h1>{cert.title}</h1>
          <p className="print-awarded">This is to certify that</p>
          <p className="print-name">{cert.studentName}</p>
          <p className="print-course">
            has successfully completed <strong>{cert.course}</strong>
          </p>
          {cert.details && <p className="print-details">{cert.details}</p>}
          <p className="print-issued">
            Issued on {formatDate(cert.issueDate)} · Student ID {cert.studentId}
          </p>
        </main>
        <footer className="print-footer">
          <div className="print-qr">
            <QRCodeSVG value={url} size={96} level="M" marginSize={1} />
            <span>Scan to verify</span>
          </div>
          <div className="print-hash">
            <dt>SHA-256</dt>
            <dd>{cert.hash}</dd>
          </div>
        </footer>
      </div>
    </div>
  );
}
