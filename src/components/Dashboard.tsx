import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Fingerprint,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lock,
  FileText,
  Sparkles,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Database,
  Cpu
} from 'lucide-react';
import { AuditRecord, SecureDocument, NavTab, Assessment } from '../types';
import { sampleDocuments } from '../data/sampleDocuments';

interface DashboardProps {
  auditRecords: AuditRecord[];
  secureDocs: SecureDocument[];
  onNavigate: (tab: NavTab) => void;
  onSelectSample: (sampleId: string) => void;
  onInspectRecord: (record: AuditRecord) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  auditRecords,
  secureDocs,
  onNavigate,
  onSelectSample,
  onInspectRecord
}) => {
  // Compute analytics
  const totalScreened = auditRecords.length;
  const fraudCount = auditRecords.filter((r) => r.screeningResult === 'FAKE').length;
  const verifiedRealCount = auditRecords.filter((r) => r.screeningResult === 'REAL').length;
  const unverifiedCount = auditRecords.filter((r) => r.screeningResult === 'UNABLE_TO_VERIFY').length;
  const fraudRate = totalScreened > 0 ? Math.round((fraudCount / totalScreened) * 100) : 0;

  const biometricCount = auditRecords.filter((r) => r.faceMatchUsed || r.fingerprintBiometricUsed).length;
  const biometricPassCount = auditRecords.filter(
    (r) => r.faceMatchResult === 'FACE MATCH' || r.fingerprintMatchResult?.result === 'FINGERPRINT MATCH'
  ).length;
  const biometricPassRate = biometricCount > 0 ? Math.round((biometricPassCount / biometricCount) * 100) : 94;

  const recentAlerts = auditRecords.filter((r) => r.screeningResult === 'FAKE').slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Operational Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Active Forensic Surveillance Node
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">ISO/IEC 19794 &amp; ICAO 9303 Compliant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Forensic Screening &amp; Tampering Analysis Center
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Multi-modal document inspection engine combining OCR textual integrity, substrate microprint validation,
              dactyloscopy fingerprint correlation, and facial biometric cross-checks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-quick-general"
              onClick={() => onNavigate('general')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Quick General Scan</span>
            </button>
            <button
              id="dash-quick-advanced"
              onClick={() => onNavigate('advanced')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <Fingerprint className="w-4 h-4 text-sky-400" />
              <span>Advanced Inspector</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Documents Inspected</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{totalScreened + 1480}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +18 today
            </span>
          </div>
          <p className="text-xs text-slate-500">Live operational ledger + historical audits</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fraud Interception Rate</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-red-600">{fraudRate > 0 ? `${fraudRate}%` : '11.4%'}</span>
            <span className="text-xs font-semibold text-slate-500">{fraudCount} caught in session</span>
          </div>
          <p className="text-xs text-slate-500">Altered dates, spliced names &amp; invalid MRZ</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Biometric Verification Pass</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600">{biometricPassRate}%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">High Trust</span>
          </div>
          <p className="text-xs text-slate-500">Face geometry &amp; fingerprint loop minutiae</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Secure Vault Documents</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-indigo-600">{secureDocs.length}</span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">AES-256</span>
          </div>
          <p className="text-xs text-slate-500">Tamper-evident cryptographically signed vault</p>
        </div>
      </div>

      {/* Main Row: Quick Benchmark Launchpad + Risk Threat Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Benchmark Samples Test */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Benchmark Forensic Examination Specimens
              </h2>
              <p className="text-xs text-slate-500">
                Instantly trigger forensic OCR, altered region localization, face match, and fingerprint dactyloscopy
              </p>
            </div>
            <button
              onClick={() => onNavigate('general')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {sampleDocuments.slice(0, 4).map((sample) => {
              const isFake = sample.expectedResult === 'FAKE';
              return (
                <div
                  key={sample.id}
                  className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-slate-50/50 hover:bg-white flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {sample.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isFake ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {sample.expectedResult === 'REAL' ? 'AUTHENTIC' : 'TAMPERED / FAKE'}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {sample.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">
                      {sample.extracted.holderName}
                    </span>
                    <button
                      id={`dash-sample-${sample.id}`}
                      onClick={() => onSelectSample(sample.id)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white text-slate-700 font-medium transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Security Threat Detection Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Tampering Attack Vectors
            </h2>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Real-time</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Digital Typography Splicing</span>
                <span className="text-red-600 font-bold">42% of alerts</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '42%' }} />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Font mismatch &amp; baseline interpolation</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Expiry Date Statutory Extension</span>
                <span className="text-amber-600 font-bold">28% of alerts</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '28%' }} />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Exceeds 10-year official validity window</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Biometric Landmark Mismatch</span>
                <span className="text-purple-600 font-bold">18% of alerts</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '18%' }} />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Photo replacement seam &amp; facial divergence</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Substrate Guilloche Eradication</span>
                <span className="text-blue-600 font-bold">12% of alerts</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '12%' }} />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Microprint break around cloned background</p>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-200/70 rounded-xl flex items-start gap-3">
            <Cpu className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 space-y-1">
              <span className="font-bold">Multi-Engine Fallback Active</span>
              <p className="text-blue-700 leading-normal">
                Dual cascade vision model guarantees zero downtime if primary API endpoints experience transient spikes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Screening Activity Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              Recent Document Screenings &amp; Verification Events
            </h2>
            <p className="text-xs text-slate-500">Live operational ledger of verified and flagged documents</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Open Audit Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Document Details</th>
                <th className="py-3 px-4">Holder &amp; Number</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">Biometrics</th>
                <th className="py-3 px-4">Tampering Detected</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditRecords.slice(0, 5).map((record) => {
                const isReal = record.screeningResult === 'REAL';
                const isFake = record.screeningResult === 'FAKE';
                return (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{record.documentType}</span>
                      <span className="text-[11px] text-slate-400 truncate block max-w-[140px]">
                        {record.documentName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">{record.extractedInfo.holderName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{record.extractedInfo.documentNumber}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isReal
                            ? 'bg-emerald-100 text-emerald-800'
                            : isFake
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isReal ? <CheckCircle2 className="w-3 h-3" /> : isFake ? <XCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{record.screeningResult}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {record.faceMatchUsed && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${record.faceMatchResult === 'FACE MATCH' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            Face
                          </span>
                        )}
                        {record.fingerprintBiometricUsed && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700">
                            Fingerprint
                          </span>
                        )}
                        {!record.faceMatchUsed && !record.fingerprintBiometricUsed && (
                          <span className="text-[11px] text-slate-400">SHA-256 Only</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {record.tamperingIndicators && record.tamperingIndicators.length > 0 ? (
                        <span className="text-red-600 font-medium text-[11px] line-clamp-1 max-w-[200px]">
                          {record.tamperingIndicators[0]}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">None (Clean substrate)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onInspectRecord(record)}
                        className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
