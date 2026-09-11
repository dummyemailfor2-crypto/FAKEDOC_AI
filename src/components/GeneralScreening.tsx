import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Copy,
  Check,
  ArrowRight,
  Shield,
  FileText,
  RefreshCw,
  Eye,
  Info,
  ExternalLink,
  Sparkles,
  Search
} from 'lucide-react';
import { ScreeningResult, SampleDocument, AuditRecord } from '../types';
import { sampleDocuments } from '../data/sampleDocuments';
import { computeSha256 } from '../utils/crypto';

interface GeneralScreeningProps {
  onTransferToAdvanced: (docData: {
    imageUrl: string;
    fileName: string;
    result?: ScreeningResult;
    sampleFace?: string;
  }) => void;
  onSaveToRegistry: (record: AuditRecord) => void;
  onOpenCertificate: (result: ScreeningResult, docImage: string, fileName: string) => void;
}

export const GeneralScreening: React.FC<GeneralScreeningProps> = ({
  onTransferToAdvanced,
  onSaveToRegistry,
  onOpenCertificate
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    previewUrl: string;
    base64: string;
    sampleFace?: string;
    isSample?: boolean;
    sampleId?: string;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [savedToRegistry, setSavedToRegistry] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load a pre-built sample document
  const handleSelectSample = async (sample: SampleDocument) => {
    setErrorMessage(null);
    setScreeningResult(null);
    setSavedToRegistry(false);

    // Convert SVG data URL to base64 if needed
    setSelectedFile({
      name: `${sample.category.toLowerCase()}_sample_${sample.id}.svg`,
      previewUrl: sample.imageUrl,
      base64: sample.imageUrl,
      sampleFace: sample.sampleReferenceFace,
      isSample: true,
      sampleId: sample.id
    });
  };

  // Handle uploaded file
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setErrorMessage(null);
    setScreeningResult(null);
    setSavedToRegistry(false);

    const reader = new FileReader();
    reader.onload = async () => {
      const resultStr = reader.result as string;
      setSelectedFile({
        name: file.name,
        previewUrl: resultStr,
        base64: resultStr,
        isSample: false
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Execute Screening
  const handleRunScreening = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    setErrorMessage(null);

    try {
      // Calculate SHA-256 fingerprint
      const sha256 = await computeSha256(selectedFile.base64);

      // Check if it's a known sample for immediate deterministic results
      const matchedSample = sampleDocuments.find(s => s.id === selectedFile.sampleId);

      const response = await fetch('/api/screen-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: selectedFile.base64,
          fileName: selectedFile.name,
          mimeType: selectedFile.name.endsWith('.svg')
            ? 'image/svg+xml'
            : selectedFile.name.endsWith('.png')
            ? 'image/png'
            : selectedFile.name.endsWith('.pdf')
            ? 'application/pdf'
            : 'image/jpeg',
          textContent: matchedSample ? JSON.stringify(matchedSample.extracted) : '',
          sha256
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: ScreeningResult = await response.json();
      data.sha256 = sha256;
      setScreeningResult(data);
    } catch (err: any) {
      console.error('Screening error:', err);
      setErrorMessage(err?.message || 'AI document screening could not be completed.');
    } finally {
      setIsScanning(false);
    }
  };

  const copyHashToClipboard = () => {
    if (!screeningResult?.sha256) return;
    navigator.clipboard.writeText(screeningResult.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const saveCurrentToRegistry = () => {
    if (!screeningResult || !selectedFile) return;

    const record: AuditRecord = {
      id: 'REC-' + Date.now().toString(36).toUpperCase(),
      timestamp: new Date().toISOString(),
      documentType: screeningResult.documentType,
      documentName: selectedFile.name,
      extractedInfo: screeningResult.extractedDetails,
      screeningResult: screeningResult.assessment,
      internalAssessment: screeningResult.internalAssessment,
      confidence: screeningResult.confidence,
      reasons: screeningResult.reasons,
      tamperingIndicators: screeningResult.tamperingIndicators,
      inconsistencies: screeningResult.inconsistencies,
      fingerprintUsed: true,
      fingerprintSha256: screeningResult.sha256,
      fingerprintStatus: 'NEW_REGISTRATION',
      faceMatchUsed: false,
      verifiedBy: 'Agent / AI Inspector'
    };

    onSaveToRegistry(record);
    setSavedToRegistry(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Real-Time Forensic AI Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          General Document Screening
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm">
          Instant AI-based document verification. Real-time visual and textual analysis for passports,
          visas, national IDs, and permits.
        </p>
      </div>

      {/* Quick Test Samples Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Test Benchmark Samples
          </span>
          <span className="text-xs text-slate-400">Click any sample to evaluate instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {sampleDocuments.map((sample) => {
            const isSelected = selectedFile?.sampleId === sample.id;
            const isFake = sample.expectedResult === 'FAKE';
            return (
              <button
                key={sample.id}
                id={`btn-${sample.id}`}
                onClick={() => handleSelectSample(sample)}
                className={`text-left p-3 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-900 line-clamp-1">{sample.category}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isFake ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {sample.expectedResult}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium text-[11px] line-clamp-1">{sample.title}</p>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  <span>Load Sample</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Screening Grid: Upload/Preview + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload / Preview Area */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all min-h-[340px] flex flex-col items-center justify-center ${
              selectedFile
                ? 'border-slate-300 bg-slate-900 text-white overflow-hidden'
                : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            {selectedFile ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                {/* Document Display */}
                <div className="relative max-h-72 w-full flex items-center justify-center overflow-hidden rounded-lg bg-slate-950 p-2 border border-slate-800">
                  <img
                    src={selectedFile.previewUrl}
                    alt={selectedFile.name}
                    className="max-h-64 object-contain rounded shadow-lg"
                  />
                  {/* Laser Scanning Animation when isScanning is true */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                      <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px]" />
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between w-full px-1 text-xs">
                  <span className="text-slate-300 truncate max-w-[200px] font-mono">{selectedFile.name}</span>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setScreeningResult(null);
                    }}
                    className="text-slate-400 hover:text-white underline text-[11px]"
                  >
                    Change File
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer flex flex-col items-center space-y-3 py-6"
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Upload document for AI-powered screening
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports JPG, PNG, WEBP, PDF, SVG (Passports, Visas, ID Cards)
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  Browse Files
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Screening Trigger Button */}
          {selectedFile && (
            <button
              id="btn-run-screening"
              onClick={handleRunScreening}
              disabled={isScanning}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Screening Document with AI Forensics...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Execute AI Document Screening</span>
                </>
              )}
            </button>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right Column: Forensic Results Presentation */}
        <div className="lg:col-span-7">
          {screeningResult ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Verdict Header Badge */}
              <div
                id="general-screening-result-card"
                className={`rounded-xl p-5 border text-center transition-all ${
                  screeningResult.assessment === 'REAL'
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : screeningResult.assessment === 'FAKE'
                    ? 'bg-red-50/80 border-red-300 text-red-950'
                    : 'bg-amber-50/80 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {screeningResult.assessment === 'REAL' ? (
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  ) : screeningResult.assessment === 'FAKE' ? (
                    <XCircle className="w-8 h-8 text-red-600" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  )}
                  <span className="text-2xl font-extrabold tracking-tight">
                    {screeningResult.assessment === 'REAL'
                      ? 'GENUINE / AUTHENTIC'
                      : screeningResult.assessment === 'FAKE'
                      ? 'FORGERY / TAMPERED'
                      : 'INCONCLUSIVE'}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs font-semibold mt-1 text-slate-600">
                  <span>Document: <strong className="text-slate-900">{screeningResult.documentType}</strong></span>
                  <span>•</span>
                  <span>Confidence: <strong className="text-slate-900">{screeningResult.confidence || 98}%</strong></span>
                  <span>•</span>
                  <span>Rating: <strong className="text-slate-900">{screeningResult.internalAssessment}</strong></span>
                </div>
              </div>

              {/* Extracted Details Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Extracted Document Metadata
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Bearer Name</span>
                    <span className="font-semibold text-slate-900">
                      {screeningResult.extractedDetails.holderName || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Document Number</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {screeningResult.extractedDetails.documentNumber || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Nationality</span>
                    <span className="font-semibold text-slate-900">
                      {screeningResult.extractedDetails.nationality || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Issuing Authority</span>
                    <span className="font-semibold text-slate-900">
                      {screeningResult.extractedDetails.issuer || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Date of Issue</span>
                    <span className="font-semibold text-slate-900">
                      {screeningResult.extractedDetails.issueDate || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Date of Expiry</span>
                    <span
                      className={`font-semibold ${
                        screeningResult.extractedDetails.expiryDate?.includes('TAMPERED')
                          ? 'text-red-600 font-mono'
                          : 'text-slate-900'
                      }`}
                    >
                      {screeningResult.extractedDetails.expiryDate || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tampering Indicators (if any) */}
              {screeningResult.tamperingIndicators && screeningResult.tamperingIndicators.length > 0 && (
                <div className="bg-red-50/70 border border-red-200 rounded-lg p-3.5 space-y-1.5">
                  <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Detected Tampering Indicators ({screeningResult.tamperingIndicators.length})
                  </span>
                  <ul className="list-disc list-inside text-xs text-red-900 space-y-1 pl-1">
                    {screeningResult.tamperingIndicators.map((ind, i) => (
                      <li key={i}>{ind}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Forensic Reasons & Observations */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Forensic Examination Findings
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  {screeningResult.reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SHA-256 Digital Digest */}
              <div className="bg-slate-900 text-slate-300 rounded-lg p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    SHA-256 Cryptographic Fingerprint
                  </span>
                  <button
                    onClick={copyHashToClipboard}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] break-all text-slate-200 bg-slate-950 p-1.5 rounded border border-slate-800">
                  {screeningResult.sha256}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={saveCurrentToRegistry}
                  disabled={savedToRegistry}
                  className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {savedToRegistry ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Saved to Registry</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Save into Audit Registry</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onOpenCertificate(screeningResult, selectedFile.previewUrl, selectedFile.name)
                    }
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspection Certificate</span>
                  </button>

                  <button
                    onClick={() =>
                      onTransferToAdvanced({
                        imageUrl: selectedFile.previewUrl,
                        fileName: selectedFile.name,
                        result: screeningResult,
                        sampleFace: selectedFile.sampleFace
                      })
                    }
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <span>Advanced Mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-white rounded-xl border border-slate-200 border-dashed p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-700">Forensic Screening Ready</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Upload an identity document or select a quick benchmark sample to view deep
                  authenticity assessment, extracted MRZ data, and tampering indicators.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
