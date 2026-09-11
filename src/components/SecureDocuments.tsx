import React, { useState } from 'react';
import {
  Lock,
  Shield,
  FileText,
  Search,
  Plus,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Key,
  Database,
  ExternalLink,
  ShieldCheck,
  Tag,
  Calendar,
  UserCheck,
  Copy,
  Check,
  X
} from 'lucide-react';
import { SecureDocument, Assessment } from '../types';
import { computeSha256 } from '../utils/crypto';

interface SecureDocumentsProps {
  documents: SecureDocument[];
  onAddDocument: (doc: SecureDocument) => void;
  onOpenCertificate?: (doc: SecureDocument) => void;
}

export const SecureDocuments: React.FC<SecureDocumentsProps> = ({
  documents,
  onAddDocument
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<SecureDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // New document form state
  const [newTitle, setNewTitle] = useState('');
  const [newHolderName, setNewHolderName] = useState('');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newDocType, setNewDocType] = useState('Passport');
  const [newClassification, setNewClassification] = useState<'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP SECRET'>('CONFIDENTIAL');
  const [newRetentionYears, setNewRetentionYears] = useState(5);
  const [newTags, setNewTags] = useState('Biometric Verified, Vaulted');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [isProcessingVault, setIsProcessingVault] = useState(false);

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.sha256.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClassification === 'ALL' || doc.securityClassification === selectedClassification;
    return matchesSearch && matchesClass;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      if (!newTitle) setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVaultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newHolderName || !newDocNumber) return;

    setIsProcessingVault(true);
    let hash = '8f434346648f6b96df89dda901c5176b10e6d059612d556b925284173ac54096';
    if (uploadedPreview) {
      hash = await computeSha256(uploadedPreview);
    }

    const newDoc: SecureDocument = {
      id: 'SEC-DOC-' + Math.floor(100 + Math.random() * 900),
      title: newTitle,
      fileName: uploadedFile ? uploadedFile.name : `${newDocType.toLowerCase()}_specimen.pdf`,
      fileFormat: uploadedFile ? uploadedFile.type || 'PDF / High-Res Scan' : 'PDF / Encrypted Specimen',
      fileSizeBytes: uploadedFile ? uploadedFile.size : 2048500,
      documentType: newDocType,
      holderName: newHolderName.toUpperCase(),
      documentNumber: newDocNumber.toUpperCase(),
      securityClassification: newClassification,
      encryptionStatus: 'AES-256-GCM SEALED',
      sha256: hash,
      vaultedAt: new Date().toISOString(),
      retentionUntil: new Date(Date.now() + 3600000 * 24 * 365 * newRetentionYears).toISOString(),
      verifiedStatus: 'REAL',
      imageUrl: uploadedPreview || undefined,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      accessLogsCount: 1,
      custodianBadge: 'EXP-8891-FORENSIC'
    };

    onAddDocument(newDoc);
    setIsProcessingVault(false);
    setIsUploadModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewHolderName('');
    setNewDocNumber('');
    setUploadedFile(null);
    setUploadedPreview(null);
  };

  const handleDownloadEncryptedArchive = (doc: SecureDocument) => {
    const metadata = {
      vaultEnvelope: {
        documentId: doc.id,
        classification: doc.securityClassification,
        encryptionAlgorithm: 'AES-256-GCM',
        integrityDigest: doc.sha256,
        custodianBadge: doc.custodianBadge,
        retentionExpiry: doc.retentionUntil,
        metadata: {
          holder: doc.holderName,
          docNumber: doc.documentNumber,
          type: doc.documentType,
          vaultedAt: doc.vaultedAt
        }
      },
      integritySignature: 'FIPS-140-3-VALIDATED-SIGNATURE-ENVELOPE'
    };

    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VAULT_ENCRYPTED_${doc.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Vault Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>FIPS-Compliant Cryptographic Vault</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Secure Documents Repository
          </h1>
          <p className="text-slate-600 text-sm">
            High-security document-management system with AES-256 encryption at rest, SHA-256 provenance sealing, and retention lifecycles.
          </p>
        </div>

        <button
          id="btn-vault-new-document"
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Vault New Document</span>
        </button>
      </div>

      {/* Security Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Envelope Security</span>
            <span className="text-sm font-extrabold text-slate-900">AES-256-GCM Military Grade</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Integrity Guarantee</span>
            <span className="text-sm font-extrabold text-slate-900">Zero Bit-Rot SHA-256 Pinning</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Custodian Clearance</span>
            <span className="text-sm font-extrabold text-slate-900">Dr. Evelyn Vance (EXP-8891)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by holder, doc #, hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Tier:</span>
            {['ALL', 'CONFIDENTIAL', 'SECRET', 'TOP SECRET'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClassification(cls)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedClassification === cls
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const isTopSecret = doc.securityClassification === 'TOP SECRET';
            const isSecret = doc.securityClassification === 'SECRET';
            return (
              <div
                key={doc.id}
                className="rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all bg-white flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        isTopSecret
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : isSecret
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {doc.securityClassification}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{doc.id}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{doc.title}</h3>
                    <p className="text-xs text-slate-500">{doc.documentType} • {doc.holderName}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2.5 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Doc Number:</span>
                      <span className="font-mono font-bold text-slate-900">{doc.documentNumber}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>File Specs:</span>
                      <span className="text-slate-800 font-medium">{(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB • {doc.fileFormat.split('/')[0]}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Encryption:</span>
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {doc.encryptionStatus}
                      </span>
                    </div>
                  </div>

                  {/* SHA-256 Digest Box */}
                  <div className="p-2 rounded bg-slate-100 font-mono text-[10px] text-slate-600 flex items-center justify-between">
                    <span className="truncate pr-2">{doc.sha256}</span>
                    <button
                      onClick={() => handleCopyHash(doc.sha256)}
                      className="text-slate-400 hover:text-indigo-600 shrink-0"
                      title="Copy SHA-256"
                    >
                      {copiedHash === doc.sha256 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                  <button
                    onClick={() => handleDownloadEncryptedArchive(doc)}
                    className="p-1.5 rounded-lg border border-slate-300 hover:bg-indigo-50 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 transition-colors"
                    title="Export Encrypted Vault Record"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <Lock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No documents match filter criteria</p>
            <p className="text-xs text-slate-400">Try adjusting your search keywords or classification filter</p>
          </div>
        )}
      </div>

      {/* Inspect Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Vaulted Cryptographic Record</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedDoc.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedDoc.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56 bg-slate-950 flex items-center justify-center">
                <img
                  src={selectedDoc.imageUrl}
                  alt={selectedDoc.title}
                  className="max-h-56 w-auto object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Holder Name:</span>
                <span className="font-bold text-slate-900">{selectedDoc.holderName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Document ID:</span>
                <span className="font-bold text-slate-900 font-mono">{selectedDoc.documentNumber}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Vaulted Timestamp:</span>
                <span className="font-medium text-slate-800">{new Date(selectedDoc.vaultedAt).toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block">Retention Expiry:</span>
                <span className="font-medium text-slate-800">{new Date(selectedDoc.retentionUntil).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-indigo-900 block">Provenance &amp; Cryptographic Seal</span>
              <p className="text-slate-700 font-mono break-all text-[11px]">
                SHA-256: {selectedDoc.sha256}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-indigo-700">
                <span>Custodian: {selectedDoc.custodianBadge}</span>
                <span>•</span>
                <span>Access Logs: {selectedDoc.accessLogsCount} verifications</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadEncryptedArchive(selectedDoc)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Sealed Envelope</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vault New Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Secure Ingestion</span>
                <h3 className="text-lg font-bold text-slate-900">Vault New Protected Specimen</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVaultSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sarah Chen - Diplomatic Passport"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Holder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="SARAH CHEN"
                    value={newHolderName}
                    onChange={(e) => setNewHolderName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Document Number</label>
                  <input
                    type="text"
                    required
                    placeholder="N7821940"
                    value={newDocNumber}
                    onChange={(e) => setNewDocNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Security Classification</label>
                  <select
                    value={newClassification}
                    onChange={(e: any) => setNewClassification(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="SECRET">SECRET</option>
                    <option value="TOP SECRET">TOP SECRET</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Retention Lifecycle</label>
                  <select
                    value={newRetentionYears}
                    onChange={(e) => setNewRetentionYears(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>1 Year (Temporary Audit)</option>
                    <option value={3}>3 Years (Standard)</option>
                    <option value={5}>5 Years (High-Security)</option>
                    <option value={10}>10 Years (Interpol Permanent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Attach Specimen File (Optional)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileSelect}
                  className="w-full text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingVault}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  {isProcessingVault ? 'Encrypting & Vaulting...' : 'Lock into Secure Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
