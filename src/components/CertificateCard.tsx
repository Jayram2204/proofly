import { useState } from 'react';
import { Check, Copy, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Certificate } from '../types';
import { certificateVerifyUrl, formatDate } from '../lib/links';

interface CertificateCardProps {
  cert: Certificate;
  onPrint: (cert: Certificate) => void;
}

export function CertificateCard({ cert, onPrint }: CertificateCardProps) {
  const [copied, setCopied] = useState(false);
  const url = certificateVerifyUrl(cert);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <article className="cert-card">
      <div className="cert-body">
        <div className="cert-head">
          <div>
            <p className="cert-title">{cert.title}</p>
            <p className="cert-recipient">
              {cert.studentName}
              <span className="muted"> · {cert.studentId}</span>
            </p>
          </div>
          <span className="status-badge verified">
            <Check size={13} /> verified
          </span>
        </div>

        <dl className="cert-meta">
          <div>
            <dt>Course</dt>
            <dd>{cert.course}</dd>
          </div>
          <div>
            <dt>Issued</dt>
            <dd>{formatDate(cert.issueDate)}</dd>
          </div>
          {cert.details && (
            <div>
              <dt>Details</dt>
              <dd>{cert.details}</dd>
            </div>
          )}
        </dl>

        <div className="cert-hash">
          <dt>SHA-256</dt>
          <dd title={cert.hash}>{cert.hash}</dd>
        </div>
      </div>

      <div className="cert-actions">
        <div className="qr" title="Scan to verify">
          <QRCodeSVG value={url} size={88} level="M" marginSize={1} />
        </div>
        <div className="action-buttons">
          <button className="btn btn-ghost" onClick={copyLink}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Share link'}
          </button>
          <button className="btn btn-ghost" onClick={() => onPrint(cert)}>
            <Printer size={15} />
            Print / PDF
          </button>
        </div>
      </div>
    </article>
  );
}
