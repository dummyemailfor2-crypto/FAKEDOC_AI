import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Eye,
  Trash2,
  FileText,
  Fingerprint,
  FileSearch,
  UserCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { AuditRecord, ScreeningResult, NavTab } from '../types';

interface AuditRegistryProps {
  records: AuditRecord[];
  onClearRegistry: () => void;
  onOpenCertificate: (result: ScreeningResult, docImage: string, fileName: string) => void;
  onNavigateToReports?: (recordId: string) => void;
}

export const AuditRegistry: React.FC<AuditRegistryProps> = ({
  records,
  onClearRegistry,
  onOpenCertificate,
  onNavigateToReports
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'REAL' | 'FAKE' | 'UNABLE_TO_VERIFY'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.extractedInfo.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.extractedInfo.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.fingerprintSha256.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.documentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || r.screeningResult === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const exportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fakedoc_audit_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Forensic Ledger &amp; Provenance Record</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Verification History &amp; Audit Registry
          </h1>
          <p className="text-slate-600 text-sm">
            Searchable historical audit ledger of all processed documents, detected tampering events, and biometric outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <>
              <button
                onClick={exportJson}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export Ledger JSON</span>
              </button>
              <button
                onClick={onClearRegistry}
                className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear History</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by holder name, doc #, hash, or filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap mr-1">Status:</span>
          {(['ALL', 'REAL', 'FAKE', 'UNABLE_TO_VERIFY'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL'
                ? `All (${records.length})`
                : status === 'REAL'
                ? 'Authentic'
                : status === 'FAKE'
                ? 'Tampered'
                : 'Inconclusive'}
            </button>
          ))}
        </div>
      </div>

      {/* Registry Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Holder &amp; Document #</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Screening Verdict</th>
                  <th className="py-3 px-4">Biometrics</th>
                  <th className="py-3 px-4">Tampering Evidence</th>
                  <th className="py-3 px-4">Cryptographic Hash</th>
                  <th className="py-3 px-4">Logged At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRecords.map((record) => {
                  const isReal = record.screeningResult === 'REAL';
                  const isFake = record.screeningResult === 'FAKE';
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{record.extractedInfo.holderName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{record.extractedInfo.documentNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{record.documentType}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isReal
                              ? 'bg-emerald-100 text-emerald-800'
                              : isFake
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isReal ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                          ) : isFake ? (
                            <XCircle className="w-3 h-3 text-red-600" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{record.screeningResult}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 text-[10px]">
                          {record.faceMatchUsed && (
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold inline-block w-fit ${
                                record.faceMatchResult === 'FACE MATCH'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              Face: {record.faceMatchResult}
                            </span>
                          )}
                          {record.fingerprintBiometricUsed && (
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold inline-block w-fit ${
                                record.fingerprintMatchResult?.result === 'FINGERPRINT MATCH'
                                  ? 'bg-sky-50 text-sky-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              Fingerprint: {record.fingerprintMatchResult?.result || 'MATCH'}
                            </span>
                          )}
                          {!record.faceMatchUsed && !record.fingerprintBiometricUsed && (
                            <span className="text-slate-400 italic">SHA-256 Seal</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-[200px]">
                        {record.tamperingIndicators && record.tamperingIndicators.length > 0 ? (
                          <span className="text-red-600 font-medium text-[11px] line-clamp-1">
                            {record.tamperingIndicators[0]}
                          </span>
                        ) : (
                          <span className="text-emerald-700 text-[11px] font-medium">Clean Substrate</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                          <span className="truncate max-w-[100px]">{record.fingerprintSha256}</span>
                          <button
                            onClick={() => copyHash(record.fingerprintSha256, record.id)}
                            className="text-slate-400 hover:text-blue-600 p-0.5"
                            title="Copy SHA-256"
                          >
                            {copiedId === record.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(record.timestamp).toLocaleDateString()}{' '}
                        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            const mockResult: ScreeningResult = {
                              documentType: record.documentType,
                              extractedDetails: record.extractedInfo,
                              assessment: record.screeningResult,
                              internalAssessment: record.internalAssessment || 'AUTHENTIC',
                              confidence: record.confidence || 98,
                              reasons: record.reasons,
                              tamperingIndicators: record.tamperingIndicators,
                              inconsistencies: record.inconsistencies || [],
                              alteredRegions: record.alteredRegions,
                              sha256: record.fingerprintSha256,
                              timestamp: record.timestamp
                            };
                            onOpenCertificate(mockResult, '', record.documentName);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Cert</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <Fingerprint className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No History Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Screen and certify documents in General or Advanced mode to populate this cryptographic audit ledger.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
