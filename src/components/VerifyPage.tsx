import { useEffect, useState } from 'react';
import {
  Anchor,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  ShieldQuestion,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Certificate } from '../types';
import { useCertificates } from '../context/useCertificates';
import { certificateVerifyUrl, formatDate } from '../lib/links';
import { APTOS_CONFIG } from '../config';

interface VerifyPageProps {
  hash: string;
  issuer?: string | null;
}

export function VerifyPage({ hash, issuer }: VerifyPageProps) {
  const { findByHash } = useCertificates();
  const cert = findByHash(hash);
  const [chainStatus, setChainStatus] = useState<
    'checking' | 'anchored' | 'missing' | 'unavailable'
  >('checking');

  useEffect(() => {
    let cancelled = false;
    setChainStatus('checking');

    if (!issuer || !APTOS_CONFIG.isConfigured) {
      setChainStatus('unavailable');
      return;
    }

    import('../lib/aptos')
      .then(({ isHashAnchored }) => isHashAnchored(issuer, hash))
      .then((anchored) => {
        if (cancelled) return;
        setChainStatus(anchored ? 'anchored' : 'missing');
      })
      .catch(() => {
        if (!cancelled) setChainStatus('missing');
      });

    return () => {
      cancelled = true;
    };
  }, [hash, issuer]);

  const locallyVerified = Boolean(cert);
  const onChainVerified = chainStatus === 'anchored';

  return (
    <div className="view view-narrow">
      <div className="verify-hero">
        {locallyVerified || onChainVerified ? (
          <>
            <CheckCircle2 size={44} className="verify-icon ok" />
            <h2>Certificate Verified</h2>
            <p>This credential matches a certificate issued through Proofly.</p>
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
        <div className="chain-row">
          <dt>On-chain status</dt>
          <dd className={chainStatusClass(chainStatus)}>
            {chainStatus === 'checking' && (
              <>
                <Loader2 size={14} className="spin" /> checking Aptos…
              </>
            )}
            {chainStatus === 'anchored' && (
              <>
                <Anchor size={14} /> anchored on-chain
              </>
            )}
            {chainStatus === 'missing' && <>not anchored on-chain</>}
            {chainStatus === 'unavailable' && (
              <>on-chain check unavailable (not configured)</>
            )}
          </dd>
        </div>
        {issuer && chainStatus !== 'unavailable' && (
          <div className="hash-detail">
            <dt>Issuer</dt>
            <dd title={issuer}>{issuer}</dd>
          </div>
        )}
      </div>

      {cert && <CertDetail cert={cert} />}
      {!cert && chainStatus === 'missing' && (
        <div className="card">
          <div className="empty-state">
            <ShieldQuestion size={28} />
            <p>
              This hash exists on-chain but the certificate details live in the
              issuing browser (client-side storage).
            </p>
          </div>
        </div>
      )}
      {!cert && chainStatus === 'unavailable' && (
        <div className="card">
          <div className="empty-state">
            <ShieldQuestion size={28} />
            <p>
              This demo stores certificates locally in the issuing browser.
              Open a share link from the browser where the certificate was
              minted, or check the hash on Aptos directly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function chainStatusClass(
  status: 'checking' | 'anchored' | 'missing' | 'unavailable',
): string {
  if (status === 'anchored') return 'chain-chip anchored';
  if (status === 'checking') return 'chain-chip';
  return 'chain-chip muted-chip';
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
