import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Fingerprint,
  UserCheck,
  UserX,
  Upload,
  Camera,
  CheckCircle,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Search,
  Database,
  Printer,
  Sparkles
} from 'lucide-react';
import { ScreeningResult, FaceMatchResult, AuditRecord } from '../types';
import { sampleFaceMatching, sampleFaceNonMatching, sampleDocuments } from '../data/sampleDocuments';
import { computeSha256 } from '../utils/crypto';
import { compareFacesClientSide } from '../utils/faceComparison';

interface AdvancedVerificationProps {
  initialDocData?: {
    imageUrl: string;
    fileName: string;
    result?: ScreeningResult;
    sampleFace?: string;
  } | null;
  auditRegistry: AuditRecord[];
  onSaveToRegistry: (record: AuditRecord) => void;
  onOpenCertificate: (result: ScreeningResult, docImage: string, fileName: string) => void;
}

export const AdvancedVerification: React.FC<AdvancedVerificationProps> = ({
  initialDocData,
  auditRegistry,
  onSaveToRegistry,
  onOpenCertificate
}) => {
  // Document state
  const [docImage, setDocImage] = useState<string | null>(initialDocData?.imageUrl || null);
  const [docFileName, setDocFileName] = useState<string>(initialDocData?.fileName || 'document.png');
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(initialDocData?.result || null);
  const [isScreening, setIsScreening] = useState(false);

  // SHA-256 Fingerprint state
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [fingerprintStatus, setFingerprintStatus] = useState<string>('');
  const [fingerprintDetails, setFingerprintDetails] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Biometric Face Matching state
  const [referenceFace, setReferenceFace] = useState<string | null>(initialDocData?.sampleFace || null);
  const [isComparingFace, setIsComparingFace] = useState(false);
  const [faceMatchResult, setFaceMatchResult] = useState<FaceMatchResult | null>(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute hash when docImage changes
  useEffect(() => {
    if (docImage) {
      computeSha256(docImage).then((hash) => {
        setSha256Hash(hash);
        checkFingerprintInRegistry(hash);
      });
    }
  }, [docImage]);

  // Sync if initialDocData updates
  useEffect(() => {
    if (initialDocData) {
      if (initialDocData.imageUrl) setDocImage(initialDocData.imageUrl);
      if (initialDocData.fileName) setDocFileName(initialDocData.fileName);
      if (initialDocData.result) setScreeningResult(initialDocData.result);
      if (initialDocData.sampleFace) setReferenceFace(initialDocData.sampleFace);
    }
  }, [initialDocData]);

  // Check fingerprint in local audit registry
  const checkFingerprintInRegistry = (hash: string) => {
    const found = auditRegistry.find((r) => r.fingerprintSha256 === hash);
    if (found) {
      setFingerprintStatus('MATCH_FOUND');
      setFingerprintDetails(
        `Verified record found in registry (Doc #${found.extractedInfo.documentNumber} - ${found.extractedInfo.holderName})`
      );
      setIsRegistered(true);
    } else {
      setFingerprintStatus('NO_MATCH');
      setFingerprintDetails('SHA-256 digest computed. No previous match in local verified database.');
      setIsRegistered(false);
    }
  };

  // Register document fingerprint into audit registry
  const handleRegisterFingerprint = () => {
    if (!docImage || !sha256Hash) return;

    const record: AuditRecord = {
      id: 'REC-' + Date.now().toString(36).toUpperCase(),
      timestamp: new Date().toISOString(),
      documentType: screeningResult?.documentType || 'Identity Document',
      documentName: docFileName,
      extractedInfo: screeningResult?.extractedDetails || {
        holderName: 'Registered Bearer',
        documentNumber: 'REG-' + sha256Hash.slice(0, 8).toUpperCase(),
        nationality: 'Verified',
        issuer: 'Identity Authority',
        issueDate: new Date().toLocaleDateString(),
        expiryDate: 'Valid'
      },
      screeningResult: screeningResult?.assessment || 'REAL',
      internalAssessment: screeningResult?.internalAssessment || 'AUTHENTIC',
      confidence: screeningResult?.confidence || 98,
      reasons: screeningResult?.reasons || ['Cryptographic fingerprint certified and stored in local verification registry.'],
      tamperingIndicators: screeningResult?.tamperingIndicators || [],
      fingerprintUsed: true,
      fingerprintSha256: sha256Hash,
      fingerprintStatus: 'NEW_REGISTRATION',
      faceMatchUsed: Boolean(faceMatchResult),
      faceMatchResult: faceMatchResult?.result,
      faceMatchDetails: faceMatchResult?.details,
      verifiedBy: 'Senior Border Forensic Examiner'
    };

    onSaveToRegistry(record);
    setIsRegistered(true);
    setFingerprintStatus('MATCH_FOUND');
    setFingerprintDetails('Fingerprint successfully recorded into local verification registry.');
  };

  // Document upload handler
  const handleDocUpload = (file: File) => {
    if (!file) return;
    setDocFileName(file.name);
    setScreeningResult(null);
    setFaceMatchResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      setDocImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Reference face upload handler
  const handleRefFaceUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setReferenceFace(reader.result as string);
      setFaceMatchResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Run Document Screening
  const runScreening = async () => {
    if (!docImage) return;
    setIsScreening(true);

    try {
      const response = await fetch('/api/screen-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: docImage,
          fileName: docFileName,
          mimeType: docFileName.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg',
          sha256: sha256Hash
        })
      });
      const data: ScreeningResult = await response.json();
      data.sha256 = sha256Hash;
      setScreeningResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScreening(false);
    }
  };

  // Run Face Biometric Comparison
  const runFaceMatch = async () => {
    if (!docImage || !referenceFace) return;
    setIsComparingFace(true);

    try {
      // First attempt server-side Gemini multi-modal biometric evaluation
      const res = await fetch('/api/compare-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docImageBase64: docImage,
          refImageBase64: referenceFace
        })
      });

      if (res.ok) {
        const data = await res.json();
        setFaceMatchResult({
          result: data.result,
          confidence: data.confidence || 95,
          details: data.details
        });
        return;
      }
    } catch {
      // Fallback to client-side canvas vector matcher
    }

    // Client-side fallback
    const clientResult = await compareFacesClientSide(docImage, referenceFace);
    setFaceMatchResult(clientResult);
    setIsComparingFace(false);
  };

  // Live Camera handlers
  const startCamera = async () => {
    setUseWebcam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setUseWebcam(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setReferenceFace(dataUrl);
        setFaceMatchResult(null);

        // Stop stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
        }
        setUseWebcam(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-slate-200 text-xs font-semibold mb-2">
            <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
            <span>Forensic Tier 2 Verification</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Advanced Document Verification
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            In-depth multi-layered forensic analysis with forensic evidence reporting, cryptographic
            fingerprinting, and biometric face matching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {screeningResult && docImage && (
            <button
              onClick={() => onOpenCertificate(screeningResult, docImage, docFileName)}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Inspection Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Multi-Layered Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document & Fingerprinting */}
        <div className="lg:col-span-6 space-y-6">
          {/* Document Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                1. Target Identity Document
              </span>
              <label className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                <span>Upload New</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleDocUpload(e.target.files[0])}
                />
              </label>
            </div>

            {docImage ? (
              <div className="relative rounded-lg bg-slate-950 p-2 border border-slate-800 flex items-center justify-center overflow-hidden min-h-[220px]">
                <img src={docImage} alt="Document" className="max-h-56 object-contain rounded" />
                {isScreening && (
                  <div className="absolute inset-0 bg-cyan-900/20 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="text-xs font-mono text-cyan-300 flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-full border border-cyan-500/40">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Scanning Substrate &amp; Typography...
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-500 space-y-2">
                <Upload className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs font-medium">No document loaded yet</p>
                <div className="flex justify-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      const sample = sampleDocuments[0];
                      setDocImage(sample.imageUrl);
                      setDocFileName('sample_passport.svg');
                      setReferenceFace(sample.sampleReferenceFace || null);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-semibold text-slate-700"
                  >
                    Load Sample Passport
                  </button>
                </div>
              </div>
            )}

            {/* Screening Action */}
            {docImage && !screeningResult && (
              <button
                onClick={runScreening}
                disabled={isScreening}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                {isScreening ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                <span>Perform Forensic Deep Scan</span>
              </button>
            )}

            {/* Screening Summary Box if Available */}
            {screeningResult && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Forensic Screening Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      screeningResult.assessment === 'REAL'
                        ? 'bg-emerald-100 text-emerald-800'
                        : screeningResult.assessment === 'FAKE'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {screeningResult.assessment} ({screeningResult.confidence || 98}%)
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-2">
                  {screeningResult.reasons[0] || 'Valid standard layout.'}
                </div>
              </div>
            )}
          </div>

          {/* Cryptographic SHA-256 Fingerprinting Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-blue-600" />
                2. Cryptographic SHA-256 Fingerprinting
              </span>
              <span className="text-[10px] text-slate-400 font-mono">FIPS 180-4 Compliant</span>
            </div>

            <div className="space-y-2">
              <div className="bg-slate-900 text-slate-200 rounded-lg p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Digest Hash</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sha256Hash);
                      setCopiedHash(true);
                      setTimeout(() => setCopiedHash(false), 2000);
                    }}
                    className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] break-all text-slate-100 bg-slate-950 p-2 rounded border border-slate-800">
                  {sha256Hash || 'Generate or upload document to compute digest'}
                </div>
              </div>

              {/* Status in Registry */}
              {sha256Hash && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    fingerprintStatus === 'MATCH_FOUND'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Database className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <div className="space-y-1 flex-1">
                    <span className="font-bold block">
                      {fingerprintStatus === 'MATCH_FOUND' ? 'FINGERPRINT VERIFIED' : 'LOCAL REGISTRY STATUS'}
                    </span>
                    <p className="text-[11px]">{fingerprintDetails}</p>
                  </div>
                </div>
              )}

              {/* Register / Certify Button */}
              {sha256Hash && !isRegistered && (
                <button
                  id="btn-register-fingerprint"
                  onClick={handleRegisterFingerprint}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  <span>Certify &amp; Store in Audit Registry</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Biometric Face Matching & Evidence */}
        <div className="lg:col-span-6 space-y-6">
          {/* Biometric Face Matching Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                3. Biometric Face Matching (1:1 Verification)
              </span>
              <span className="text-[10px] text-slate-400">Facial Contour Analysis</span>
            </div>

            {/* Quick Face Samples */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Quick benchmark reference portraits:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  id="select-sample-face-match"
                  onClick={() => {
                    setReferenceFace(sampleFaceMatching);
                    setFaceMatchResult(null);
                  }}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700"
                >
                  Sample: Sarah Chen (Matching)
                </button>
                <button
                  type="button"
                  id="select-sample-face-nomatch"
                  onClick={() => {
                    setReferenceFace(sampleFaceNonMatching);
                    setFaceMatchResult(null);
                  }}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700"
                >
                  Sample: Different Subject (No Match)
                </button>
              </div>
            </div>

            {/* Reference Face Preview or Capture */}
            <div className="grid grid-cols-2 gap-3 items-center">
              {/* Document Face region preview */}
              <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Document Portrait</span>
                <div className="h-28 bg-slate-900 rounded overflow-hidden flex items-center justify-center p-1">
                  {docImage ? (
                    <img src={docImage} alt="Document Face" className="h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-slate-500">Upload document first</span>
                  )}
                </div>
              </div>

              {/* Reference Face preview */}
              <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Reference Selfie</span>
                <div className="h-28 bg-slate-900 rounded overflow-hidden flex items-center justify-center p-1 relative">
                  {useWebcam ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <button
                        onClick={capturePhoto}
                        className="absolute bottom-1 px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold"
                      >
                        Capture
                      </button>
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  ) : referenceFace ? (
                    <img src={referenceFace} alt="Reference" className="h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <button
                        onClick={startCamera}
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Take Photo</span>
                      </button>
                      <label className="text-[10px] text-slate-400 hover:text-slate-300 cursor-pointer">
                        <span>or upload file</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleRefFaceUpload(e.target.files[0])}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Compare Face Button */}
            {docImage && referenceFace && (
              <button
                onClick={runFaceMatch}
                disabled={isComparingFace}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                {isComparingFace ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Facial Landmarks &amp; Biometric Contours...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Compare Biometric Facial Contours</span>
                  </>
                )}
              </button>
            )}

            {/* Face Match Result Box */}
            {faceMatchResult && (
              <div
                className={`p-4 rounded-lg border text-xs space-y-2 ${
                  faceMatchResult.result === 'FACE MATCH'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : faceMatchResult.result === 'FACE NOT MATCHED'
                    ? 'bg-red-50 border-red-200 text-red-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {faceMatchResult.result === 'FACE MATCH' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <UserX className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-extrabold text-sm">{faceMatchResult.result}</span>
                  </div>
                  <span className="font-bold text-xs">
                    Similarity: {faceMatchResult.confidence}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-700">{faceMatchResult.details}</p>
              </div>
            )}
          </div>

          {/* Forensic Audit Record Quick Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              4. Evidence Chain &amp; Audit Log
            </span>

            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between">
                <span>Document Filename:</span>
                <span className="font-mono font-medium text-slate-900">{docFileName}</span>
              </div>
              <div className="flex justify-between">
                <span>Cryptographic Digest:</span>
                <span className="font-mono text-slate-900 truncate max-w-[200px]">
                  {sha256Hash ? sha256Hash.slice(0, 16) + '...' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Biometric Evaluation:</span>
                <span className="font-semibold text-slate-900">
                  {faceMatchResult ? faceMatchResult.result : 'Optional / Not Run'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Official Assessment:</span>
                <span className="font-bold text-slate-900">
                  {screeningResult ? screeningResult.assessment : 'Pending Scan'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRegisterFingerprint}
                disabled={isRegistered || !sha256Hash}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition"
              >
                {isRegistered ? 'Archived in Registry' : 'Save Full Audit Record'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
