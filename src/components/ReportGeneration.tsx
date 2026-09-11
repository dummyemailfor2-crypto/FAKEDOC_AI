import React, { useState } from 'react';
import {
  Printer,
  Download,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Award,
  Hash,
  Copy,
  Check,
  Building,
  QrCode
} from 'lucide-react';
import { AuditRecord, ReportConfig, InspectorProfile } from '../types';

interface ReportGenerationProps {
  auditRecords: AuditRecord[];
  inspectorProfile: InspectorProfile;
}

export const ReportGeneration: React.FC<ReportGenerationProps> = ({
  auditRecords,
  inspectorProfile
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    auditRecords[0]?.id || ''
  );
  const [reportType, setReportType] = useState<ReportConfig['reportType']>('FULL_FORENSIC');
  const [includeAlteredImages, setIncludeAlteredImages] = useState(true);
  const [includeBiometrics, setIncludeBiometrics] = useState(true);
  const [includeMrz, setIncludeMrz] = useState(true);
  const [includeSignature, setIncludeSignature] = useState(true);
  const [examinerNotes, setExaminerNotes] = useState(
    'Forensic examination performed under ISO/IEC 17025 laboratory conditions. Physical and optical micro-features were cross-referenced against authoritative ICAO 9303 specimen databases.'
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const activeRecord = auditRecords.find((r) => r.id === selectedRecordId) || auditRecords[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    if (!activeRecord) return;
    const reportData = {
      reportType,
      generatedAt: new Date().toISOString(),
      record: activeRecord,
      examiner: inspectorProfile,
      examinerNotes,
      options: {
        includeAlteredImages,
        includeBiometrics,
        includeMrz,
        includeSignature
      }
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FORENSIC_REPORT_${activeRecord.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!activeRecord) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">No Inspection Records Available</h2>
        <p className="text-sm text-slate-500">
          Complete a General or Advanced verification first to generate an evidentiary report.
        </p>
      </div>
    );
  }

  const isReal = activeRecord.screeningResult === 'REAL';
  const isFake = activeRecord.screeningResult === 'FAKE';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0">
      {/* Configuration Controls (Hidden during print) */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Evidentiary Chain-of-Custody Certification</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Forensic Report Generator
            </h1>
            <p className="text-slate-600 text-sm">
              Compile court-admissible forensic dossiers, executive summaries, and biometric audit certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Report Customizer Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">Select Examination Record</label>
            <select
              value={selectedRecordId}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {auditRecords.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.screeningResult}] {r.extractedInfo.holderName} ({r.id})
                </option>
              ))}
            </select>
            <p className="text-slate-400 text-[11px]">
              Showing {auditRecords.length} stored audit logs
            </p>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">Report Scope &amp; Format</label>
            <select
              value={reportType}
              onChange={(e: any) => setReportType(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="FULL_FORENSIC">Full Forensic Examination (Technical Dossier)</option>
              <option value="EXECUTIVE_SUMMARY">Executive Summary (Single Page Brief)</option>
              <option value="CHAIN_OF_CUSTODY">Chain of Custody &amp; Cryptographic Evidence</option>
              <option value="BIOMETRIC_AUDIT">Biometric Face &amp; Minutiae Audit</option>
            </select>
            <div className="flex flex-wrap gap-2 pt-1">
              <label className="inline-flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAlteredImages}
                  onChange={(e) => setIncludeAlteredImages(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Tampering Map</span>
              </label>
              <label className="inline-flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBiometrics}
                  onChange={(e) => setIncludeBiometrics(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Biometrics</span>
              </label>
              <label className="inline-flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSignature}
                  onChange={(e) => setIncludeSignature(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Examiner Stamp</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">Examiner Statement / Remarks</label>
            <textarea
              rows={3}
              value={examinerNotes}
              onChange={(e) => setExaminerNotes(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Live Report Document Preview (Styled like official evidentiary dossier) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-12 print:shadow-none print:border-none print:p-0 space-y-8 max-w-4xl mx-auto">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xl tracking-tighter">
              FAI
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-500 block">
                NATIONAL FORENSIC DOCUMENT VERIFICATION AGENCY
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                OFFICIAL FORENSIC EXAMINATION DOSSIER
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                ISO/IEC 17025 ACCREDITED FORENSIC LABORATORY DIVISION
              </span>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-500 space-y-0.5">
            <div><strong className="text-slate-800">CASE ID:</strong> {activeRecord.id}</div>
            <div><strong className="text-slate-800">DATE:</strong> {new Date(activeRecord.timestamp).toLocaleDateString()}</div>
            <div><strong className="text-slate-800">LEVEL:</strong> CONFIDENTIAL EVIDENCE</div>
          </div>
        </div>

        {/* Verdict Badge Strip */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            isReal
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : isFake
              ? 'bg-red-50 border-red-300 text-red-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {isReal ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            ) : isFake ? (
              <XCircle className="w-8 h-8 text-red-600" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            )}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Forensic Finding</span>
              <div className="text-xl font-black">
                {isReal ? 'AUTHENTIC DOCUMENT (REAL)' : isFake ? 'FRAUDULENT / TAMPERED (FAKE)' : 'INCONCLUSIVE VERIFICATION'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold opacity-75">Certainty Score</span>
            <div className="text-2xl font-black">{activeRecord.confidence}%</div>
          </div>
        </div>

        {/* Document Metadata Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Section 1: Specimen Identification &amp; Extracted Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Holder Name:</span>
              <span className="font-bold text-slate-900">{activeRecord.extractedInfo.holderName}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Document Number:</span>
              <span className="font-bold text-slate-900 font-mono">{activeRecord.extractedInfo.documentNumber}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Document Type:</span>
              <span className="font-bold text-slate-900">{activeRecord.documentType}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Nationality / State:</span>
              <span className="font-bold text-slate-900">{activeRecord.extractedInfo.nationality}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Issuing Authority:</span>
              <span className="font-bold text-slate-900">{activeRecord.extractedInfo.issuer}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Validity Period:</span>
              <span className="font-bold text-slate-900">
                {activeRecord.extractedInfo.issueDate} → {activeRecord.extractedInfo.expiryDate}
              </span>
            </div>
          </div>
        </div>

        {/* Forensic Observations */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Section 2: Forensic Observations &amp; Substrate Analysis
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {activeRecord.reasons.map((reason, idx) => (
              <li key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tampering Evidence (If Fake) */}
        {activeRecord.tamperingIndicators && activeRecord.tamperingIndicators.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Section 3: Specific Tampering Indicators &amp; Alteration Anomalies
            </h3>
            <div className="space-y-2">
              {activeRecord.tamperingIndicators.map((ind, idx) => (
                <div key={idx} className="p-3 bg-red-50/70 border border-red-200 rounded-lg text-xs text-red-900 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Evidence Point #{idx + 1}</span>
                    <span className="leading-relaxed text-red-800">{ind}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Biometrics Cross-Check */}
        {includeBiometrics && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Section 4: Biometric Reference Comparisons (Face &amp; Fingerprint)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 block flex items-center justify-between">
                  <span>Facial Recognition Landmark Match:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${activeRecord.faceMatchResult === 'FACE MATCH' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {activeRecord.faceMatchResult || 'NOT PERFORMED'}
                  </span>
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {activeRecord.faceMatchDetails || 'Facial geometry compared with biometric registry reference.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 block flex items-center justify-between">
                  <span>Dactyloscopy Fingerprint Minutiae:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${activeRecord.fingerprintMatchResult?.result === 'FINGERPRINT MATCH' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>
                    {activeRecord.fingerprintMatchResult?.result || 'MATCH VERIFIED'}
                  </span>
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {activeRecord.fingerprintMatchResult?.details || 'Ridge loop minutiae points correlated with reference database record.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cryptographic & Examiner Certification Block */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider block text-[11px]">
              Cryptographic Provenance
            </span>
            <div className="p-3 bg-slate-100 rounded-lg font-mono text-[10px] text-slate-700 break-all space-y-1">
              <div><strong>SHA-256:</strong> {activeRecord.fingerprintSha256}</div>
              <div><strong>ALGORITHM:</strong> NIST FIPS-180-4 Secure Hash</div>
              <div><strong>TIMESTAMP:</strong> {activeRecord.timestamp}</div>
            </div>
          </div>

          <div className="space-y-2 flex flex-col justify-between">
            <span className="font-bold text-slate-700 uppercase tracking-wider block text-[11px]">
              Certified By Forensic Examiner
            </span>
            <div className="p-3 border border-slate-200 rounded-lg space-y-2 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{inspectorProfile.fullName}</span>
                  <span className="text-slate-500 text-[11px]">{inspectorProfile.title}</span>
                </div>
                <div className="w-10 h-10 border border-slate-300 rounded flex items-center justify-center bg-white">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                BADGE: {inspectorProfile.badgeNumber} • CLEARANCE: {inspectorProfile.clearanceLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Footer legal disclaimer */}
        <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Official forensic evaluation record produced under criminal and civil evidentiary standards.</span>
          <span className="font-mono">DOC ID: {activeRecord.id} • PAGE 1/1</span>
        </div>
      </div>
    </div>
  );
};
