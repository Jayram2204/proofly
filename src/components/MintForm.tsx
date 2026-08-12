import { useState, type FormEvent } from 'react';
import { BadgeCheck, Loader2 } from 'lucide-react';
import type { CertificateInput } from '../types';
import { computeHash, generateId } from '../lib/verification';
import { useCertificates } from '../context/useCertificates';

const EMPTY: CertificateInput = {
  studentId: '',
  studentName: '',
  course: '',
  title: '',
  details: '',
  issueDate: '',
};

export function MintForm() {
  const { addCertificate } = useCertificates();
  const [form, setForm] = useState<CertificateInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState<{ hash: string } | null>(null);

  function setField(field: keyof CertificateInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMinted(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMinted(null);

    const missing = (
      [
        'studentId',
        'studentName',
        'course',
        'title',
        'issueDate',
      ] as (keyof CertificateInput)[]
    ).find((field) => !form[field].trim());

    if (missing) {
      setError('Please fill in all required fields.');
      return;
    }

    setMinting(true);
    try {
      const id = generateId();
      const hash = await computeHash(form);
      addCertificate({
        id,
        ...form,
        hash,
        issuedAt: Date.now(),
      });
      setForm(EMPTY);
      setMinted({ hash });
    } catch {
      setError('Something went wrong while hashing the certificate.');
    } finally {
      setMinting(false);
    }
  }

  return (
    <div className="card">
      <h3 className="card-title">Mint Certificate</h3>
      <form className="mint-form" onSubmit={handleSubmit}>
        <label>
          <span>Student ID *</span>
          <input
            value={form.studentId}
            onChange={(e) => setField('studentId', e.target.value)}
            placeholder="e.g. CS2023-001"
          />
        </label>
        <label>
          <span>Student Name *</span>
          <input
            value={form.studentName}
            onChange={(e) => setField('studentName', e.target.value)}
            placeholder="e.g. Priya Sharma"
          />
        </label>
        <label>
          <span>Course *</span>
          <input
            value={form.course}
            onChange={(e) => setField('course', e.target.value)}
            placeholder="e.g. B.Sc. Computer Science"
          />
        </label>
        <label>
          <span>Certificate Title *</span>
          <input
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="e.g. Degree Certificate"
          />
        </label>
        <label className="field-wide">
          <span>Details</span>
          <input
            value={form.details}
            onChange={(e) => setField('details', e.target.value)}
            placeholder="e.g. Graduated with First Class Distinction"
          />
        </label>
        <label>
          <span>Issue Date *</span>
          <input
            type="date"
            value={form.issueDate}
            onChange={(e) => setField('issueDate', e.target.value)}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        {minted && (
          <p className="form-success field-wide">
            <BadgeCheck size={16} />
            Certificate minted. Hash: <code>{minted.hash.slice(0, 16)}…</code>
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary field-wide"
          disabled={minting}
        >
          {minting ? (
            <>
              <Loader2 size={16} className="spin" /> Hashing…
            </>
          ) : (
            'Mint Certificate'
          )}
        </button>
      </form>
    </div>
  );
}
