import { CheckCircle2, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Certificate } from '../types';
import { useCertificates } from '../context/useCertificates';
import { certificateVerifyUrl, formatDate } from '../lib/links';

interface VerifyPageProps {
  hash: string;
}

export function VerifyPage({ hash }: VerifyPageProps) {
  const { findByHash } = useCertificates();
  const cert = findByHash(hash);

  return (
    <div className="view view-narrow">
      <div className="verify-hero">
        {cert ? (
          <>
            <CheckCircle2 size={44} className="verify-icon ok" />
            <h2>Certificate Verified</h2>
            <p>
              This credential matches a certificate issued through Proofly.
            </p>
          </>
        ) : (
          <>
            <ShieldAlert size={44} className="verify-icon bad" />
            <h2>Certificate Not Found</h2>
            <p>
              No matching certificate for this hash in the current browser
              store.
            </p>
          </>
        )}
      </div>

      <div className="card">
        <div className="hash-detail">
          <dt>Verified hash</dt>
          <dd title={hash}>{hash}</dd>
        </div>
      </div>

      {cert ? <CertDetail cert={cert} /> : <EmptyState />}
    </div>
  );
}

function CertDetail({ cert }: { cert: Certificate }) {
  const url = certificateVerifyUrl(cert);
  return (
    <div className="card">
      <div className="cert-head">
        <div>
          <p className="cert-title">{cert.title}</p>
          <p className="cert-recipient">
            {cert.studentName}
            <span className="muted"> · {cert.studentId}</span>
          </p>
        </div>
        <span className="status-badge verified">
          <ShieldQuestion size={13} /> authentic
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
      <div className="verify-qr">
        <span>Scan to re-verify</span>
        <QRCodeSVG value={url} size={120} level="M" marginSize={1} />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card">
      <div className="empty-state">
        <ShieldQuestion size={28} />
        <p>
          This demo stores certificates locally in the issuing browser. Open a
          share link from the browser where the certificate was minted to see
          full details.
        </p>
      </div>
    </div>
  );
}
