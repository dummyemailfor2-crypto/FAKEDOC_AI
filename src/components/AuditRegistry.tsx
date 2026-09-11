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
  Fingerprint
} from 'lucide-react';
import { AuditRecord, ScreeningResult } from '../types';

interface AuditRegistryProps {
  records: AuditRecord[];
  onClearRegistry: () => void;
  onOpenCertificate: (result: ScreeningResult, docImage: string, fileName: string) => void;
}

export const AuditRegistry: React.FC<AuditRegistryProps> = ({
  records,
  onClearRegistry,
  onOpenCertificate
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
    downloadAnchor.setAttribute('download', `fakedoc_audit_registry_${Date.now()}.json`);
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Cryptographic Document Registry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Verification Audit Registry
          </h1>
          <p className="text-xs text-slate-500">
            Immutable audit trail of screened documents, cryptographic fingerprints, and biometric face matches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <>
              <button
                onClick={exportJson}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={onClearRegistry}
                className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, doc #, or SHA-256..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'REAL', 'FAKE', 'UNABLE_TO_VERIFY'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL'
                ? 'All Records'
                : status === 'REAL'
                ? 'Genuine'
                : status === 'FAKE'
                ? 'Forged'
                : 'Inconclusive'}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Records */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Document / Bearer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Assessment</th>
                  <th className="py-3 px-4">SHA-256 Fingerprint</th>
                  <th className="py-3 px-4">Face Match</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{record.extractedInfo.holderName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{record.extractedInfo.documentNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{record.documentType}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          record.screeningResult === 'REAL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.screeningResult === 'FAKE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {record.screeningResult === 'REAL' ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        ) : record.screeningResult === 'FAKE' ? (
                          <XCircle className="w-3 h-3 text-red-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{record.screeningResult}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                        <span className="truncate max-w-[120px]">{record.fingerprintSha256}</span>
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
                    <td className="py-3.5 px-4">
                      {record.faceMatchUsed ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            record.faceMatchResult === 'FACE MATCH'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {record.faceMatchResult}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Not Evaluated</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
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
                            sha256: record.fingerprintSha256,
                            timestamp: record.timestamp
                          };
                          onOpenCertificate(mockResult, '', record.documentName);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Certificate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <Fingerprint className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No Registry Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Screen and certify documents in General or Advanced mode to populate this cryptographic audit log.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
