export type Assessment = 'REAL' | 'FAKE' | 'UNABLE_TO_VERIFY';
export type InternalAssessment = 'AUTHENTIC' | 'SUSPICIOUS' | 'FAKE' | 'UNABLE_TO_VERIFY';

export interface ExtractedDetails {
  holderName: string;
  documentNumber: string;
  nationality: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  dateOfBirth?: string;
  mrzDetected?: boolean;
  notes?: string;
  placeOfBirth?: string;
  sex?: string;
  mrzLine1?: string;
  mrzLine2?: string;
}

export interface AlteredRegion {
  id: string;
  field: string;
  label: string;
  originalOrExpected: string;
  alteredValue: string;
  technique: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  description: string;
  boundingBox?: {
    x: number; // percentage from left
    y: number; // percentage from top
    width: number; // percentage width
    height: number; // percentage height
  };
}

export interface ScreeningResult {
  documentType: string;
  extractedDetails: ExtractedDetails;
  assessment: Assessment;
  internalAssessment: InternalAssessment;
  confidence: number;
  reasons: string[];
  tamperingIndicators: string[];
  inconsistencies: string[];
  alteredRegions?: AlteredRegion[];
  ocrText?: string;
  formatSupported?: string;
  sha256: string;
  timestamp: string;
}

export interface FaceMatchResult {
  result: 'FACE MATCH' | 'FACE NOT MATCHED' | 'FACE MATCHING UNAVAILABLE';
  confidence: number;
  details: string;
  landmarksCompared?: number;
  facialStructureScore?: number;
}

export interface FingerprintMatchResult {
  result: 'FINGERPRINT MATCH' | 'FINGERPRINT MISMATCH' | 'NO_REFERENCE_FOUND';
  confidence: number;
  patternType: 'WHORL' | 'RIGHT LOOP' | 'LEFT LOOP' | 'ARCH' | 'TENTED ARCH';
  minutiaeCount: number;
  ridgeCount: number;
  details: string;
  matchedSubject?: string;
  referenceId?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  documentType: string;
  documentName: string;
  extractedInfo: ExtractedDetails;
  screeningResult: Assessment;
  internalAssessment?: InternalAssessment;
  confidence?: number;
  reasons: string[];
  tamperingIndicators: string[];
  inconsistencies?: string[];
  alteredRegions?: AlteredRegion[];
  fingerprintUsed: boolean;
  fingerprintSha256: string;
  fingerprintStatus?: 'MATCH_FOUND' | 'NEW_REGISTRATION' | 'NOT_RECORDED';
  faceMatchUsed: boolean;
  faceMatchResult?: string;
  faceMatchDetails?: string;
  fingerprintBiometricUsed?: boolean;
  fingerprintMatchResult?: FingerprintMatchResult;
  verifiedBy?: string;
  notes?: string;
}

export interface SampleDocument {
  id: string;
  title: string;
  category: string;
  expectedResult: Assessment;
  description: string;
  imageUrl: string;
  sampleReferenceFace?: string;
  sampleReferenceFingerprint?: string;
  extracted: Partial<ExtractedDetails> & { notes?: string; mrzDetected?: boolean; documentType: string };
  alteredRegions?: AlteredRegion[];
  knownSha256?: string;
}

export interface SecureDocument {
  id: string;
  title: string;
  fileName: string;
  fileFormat: string;
  fileSizeBytes: number;
  documentType: string;
  holderName: string;
  documentNumber: string;
  securityClassification: 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP SECRET';
  encryptionStatus: 'AES-256-GCM SEALED' | 'SHA-256 SIGNED';
  sha256: string;
  vaultedAt: string;
  retentionUntil: string;
  verifiedStatus: Assessment;
  imageUrl?: string;
  tags: string[];
  accessLogsCount: number;
  custodianBadge: string;
}

export interface ReportConfig {
  reportId: string;
  reportType: 'FULL_FORENSIC' | 'EXECUTIVE_SUMMARY' | 'EVIDENTIARY_CHAIN' | 'BIOMETRIC_AUDIT';
  includeOcrData: boolean;
  includeBiometrics: boolean;
  includeTamperingEvidence: boolean;
  includeCertificate: boolean;
  examinerNotes: string;
  signOffExaminer: string;
  agencyName: string;
  dateGenerated: string;
}

export interface InspectorProfile {
  name: string;
  badgeId: string;
  clearanceLevel: string;
  agency: string;
  department: string;
  documentsVerified: number;
  fraudDetectedCount: number;
  activeSessionId: string;
  lastLogin: string;
}

export interface AppSettings {
  ocrStrictness: 'STRICT' | 'STANDARD' | 'LENIENT';
  tamperingSensitivity: 'HIGH' | 'MEDIUM' | 'LOW';
  biometricFaceThreshold: number; // percentage
  biometricFingerprintThreshold: number; // percentage
  autoVaultOnScreening: boolean;
  enableAIFallback: boolean;
  defaultDocumentFormat: string;
  alertSound: boolean;
}

export type NavTab =
  | 'dashboard'
  | 'general'
  | 'advanced'
  | 'history'
  | 'secure-docs'
  | 'reports'
  | 'account'
  | 'settings';

