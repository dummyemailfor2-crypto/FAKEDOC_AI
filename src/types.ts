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
  fingerprintUsed: boolean;
  fingerprintSha256: string;
  fingerprintStatus?: 'MATCH_FOUND' | 'NEW_REGISTRATION' | 'NOT_RECORDED';
  faceMatchUsed: boolean;
  faceMatchResult?: string;
  faceMatchDetails?: string;
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
  extracted: Partial<ExtractedDetails> & { notes?: string; mrzDetected?: boolean; documentType: string };
  knownSha256?: string;
}
