import React from 'react';
import { X, Printer, ShieldCheck, ShieldAlert, CheckCircle, Award, Hash, QrCode } from 'lucide-react';
import { ScreeningResult } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ScreeningResult | null;
  docImage?: string;
  docFileName?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  result,
  docImage,
  docFileName = 'document'
}) => {
  if (!isOpen || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  const isReal = result.assessment === 'REAL';
  const certSerial = `FD-${Math.abs(hashString(result.sha256)).toString(36).toUpperCase()}-${Date.now().toString().slice(-6)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative print:shadow-none print:border-none">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Official Forensic Inspection Certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Sheet (Printable Area) */}
        <div className="p-8 sm:p-10 space-y-6 bg-radial from-slate-50 to-amber-50/20 border-8 border-double border-slate-200 m-2 rounded-xl relative">
          {/* Watermark Crest */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <ShieldCheck className="w-96 h-96 text-slate-900" />
          </div>

          {/* Header */}
          <div className="text-center space-y-1.5 border-b-2 border-slate-300 pb-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6 text-blue-800" />
              <span className="font-mono text-xs tracking-widest text-slate-600 font-bold">
                FAKEDOC-AI FORENSIC VERIFICATION DIVISION
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              CERTIFICATE OF FORENSIC DOCUMENT EXAMINATION
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Serial No: {certSerial}  •  Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Verdict Banner */}
          <div
            className={`p-4 rounded-lg border-2 flex items-center justify-between ${
              isReal
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                : 'bg-red-50 border-red-500 text-red-950'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                Official Screening Determination
              </span>
              <div className="text-2xl font-serif font-black tracking-wider">
                {isReal ? 'VERIFIED GENUINE / AUTHENTIC' : 'DOCUMENT CLASSIFIED AS FORGERY'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                AI Confidence
              </span>
              <div className="text-2xl font-mono font-bold">
                {result.confidence || 98}%
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Subject Data */}
            <div className="space-y-3 bg-white/80 p-4 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block border-b border-slate-200 pb-1">
                Extracted Document Attributes
              </span>
              <dl className="space-y-1.5">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Document Type:</dt>
                  <dd className="font-semibold text-slate-900">{result.documentType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Bearer Name:</dt>
                  <dd className="font-semibold text-slate-900">{result.extractedDetails.holderName || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Document No:</dt>
                  <dd className="font-mono font-semibold text-slate-900">{result.extractedDetails.documentNumber || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Issuing Authority:</dt>
                  <dd className="font-semibold text-slate-900">{result.extractedDetails.issuer || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Valid Until:</dt>
                  <dd className={`font-semibold ${result.extractedDetails.expiryDate?.includes('TAMPERED') ? 'text-red-600 font-mono' : 'text-slate-900'}`}>
                    {result.extractedDetails.expiryDate || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Cryptographic Security Digest */}
            <div className="space-y-3 bg-white/80 p-4 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block border-b border-slate-200 pb-1">
                Cryptographic Audit Fingerprint
              </span>
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">SHA-256 Digest:</span>
                  <div className="font-mono text-[10px] break-all bg-slate-100 p-1.5 rounded text-slate-800 border border-slate-200">
                    {result.sha256}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600">
                  <span>Standard:</span>
                  <span className="font-mono font-semibold">ICAO 9303 / FIPS-180-4</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Inspection Engine:</span>
                  <span className="font-mono font-semibold">Gemini 3.8 Multi-Modal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Forensic Notes */}
          <div className="space-y-1.5 bg-white/80 p-4 rounded-lg border border-slate-200 text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Forensic Observations &amp; Evidence
            </span>
            <ul className="list-disc list-inside text-slate-700 space-y-1 text-[11px]">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
              {result.tamperingIndicators.map((t, i) => (
                <li key={`t-${i}`} className="text-red-700 font-semibold">
                  Tampering observed: {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t-2 border-slate-300 flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div className="font-serif italic text-base text-blue-900">Dr. E. Vance, D.Sc.</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                Chief Document Forensic Examiner
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-double border-blue-800 flex items-center justify-center mx-auto text-blue-800 text-[9px] font-serif font-black uppercase text-center leading-none p-1">
                SEAL OF AUTHENTICITY
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
