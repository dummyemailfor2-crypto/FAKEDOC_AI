import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { GeneralScreening } from './components/GeneralScreening';
import { AdvancedVerification } from './components/AdvancedVerification';
import { AuditRegistry } from './components/AuditRegistry';
import { SecureDocuments } from './components/SecureDocuments';
import { ReportGeneration } from './components/ReportGeneration';
import { AccountSection } from './components/AccountSection';
import { SettingsSection } from './components/SettingsSection';
import { CertificateModal } from './components/CertificateModal';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { GoogleAuthGate } from './components/GoogleAuthGate';
import {
  ScreeningResult,
  AuditRecord,
  SecureDocument,
  InspectorProfile,
  AppSettings,
  NavTab,
  GoogleUser
} from './types';
import {
  sampleDocuments,
  initialSecureDocuments,
  defaultInspectorProfile,
  defaultAppSettings
} from './data/sampleDocuments';

// Initial pre-loaded audit records for demonstration
const initialAuditRecords: AuditRecord[] = [
  {
    id: 'REC-GBR-782194',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    documentType: 'Passport',
    documentName: 'sample_passport_sarah_chen.svg',
    extractedInfo: {
      holderName: 'SARAH CHEN',
      documentNumber: 'N7821940',
      nationality: 'British Citizen (GBR)',
      issuer: 'HM Passport Office / IPS Glasgow',
      issueDate: '29 Nov 2021',
      expiryDate: '28 Nov 2031'
    },
    screeningResult: 'REAL',
    internalAssessment: 'AUTHENTIC',
    confidence: 99,
    reasons: [
      'Compliant ICAO 9303 TD3 standard passport with verified MRZ checksums.',
      'Continuous security guilloche pattern with intact microprint lines.'
    ],
    tamperingIndicators: [],
    fingerprintUsed: true,
    fingerprintSha256: '8f434346648f6b96df89dda901c5176b10e6d059612d556b925284173ac54096',
    fingerprintStatus: 'MATCH_FOUND',
    faceMatchUsed: true,
    faceMatchResult: 'FACE MATCH',
    faceMatchDetails: 'Facial structural alignment and biometric features correlate with reference image (Similarity: 96%)',
    fingerprintBiometricUsed: true,
    fingerprintMatchResult: {
      result: 'FINGERPRINT MATCH',
      confidence: 96,
      patternType: 'RIGHT LOOP',
      minutiaeCount: 38,
      ridgeCount: 17,
      details: 'Minutiae ridge flow and core delta coordinates align with reference profile GBR-9105-FP01.'
    },
    verifiedBy: 'Dr. Evelyn Vance (EXP-8891)'
  },
  {
    id: 'REC-DEU-551209',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    documentType: 'Entry Visa',
    documentName: 'forged_schengen_visa_steiner.svg',
    extractedInfo: {
      holderName: 'MARCUS V. STEINER',
      documentNumber: 'V-55120938',
      nationality: 'German (DEU)',
      issuer: 'Consular Affairs Division',
      issueDate: '10 Jan 2025',
      expiryDate: '09 Jan 2026'
    },
    screeningResult: 'FAKE',
    internalAssessment: 'FAKE',
    confidence: 97,
    reasons: [
      'Anomalous font rendering detected in bearer field. Splicing indicators present.',
      'Spliced baseline alignment and mismatched anti-aliasing.'
    ],
    tamperingIndicators: [
      'Digital splicing detected in bearer field',
      'Irregular kerning and font mismatch'
    ],
    alteredRegions: [
      {
        id: 'alt-1',
        field: 'holderName',
        label: 'Bearer Name',
        originalOrExpected: 'VERIFIED RECIPIENT NAME',
        alteredValue: 'MARCUS V. STEINER',
        technique: 'Digital Typography Splicing & Kerning Anomaly',
        severity: 'CRITICAL',
        confidence: 97,
        description: 'Mismatched Courier typewriter font overlaid onto high-security intaglio background.',
        boundingBox: { x: 31, y: 31, width: 35, height: 7 }
      }
    ],
    fingerprintUsed: true,
    fingerprintSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    fingerprintStatus: 'MATCH_FOUND',
    faceMatchUsed: true,
    faceMatchResult: 'FACE MISMATCH',
    faceMatchDetails: 'Facial landmarks do not align with reference subject archive.',
    fingerprintBiometricUsed: true,
    fingerprintMatchResult: {
      result: 'FINGERPRINT MISMATCH',
      confidence: 18,
      patternType: 'ARCH',
      minutiaeCount: 14,
      ridgeCount: 9,
      details: 'Ridge pattern divergence detected: Arch morphology vs. registered Loop.'
    },
    verifiedBy: 'Dr. Evelyn Vance (EXP-8891)'
  }
];

export default function App() {
  // Google User Authentication State
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const stored = localStorage.getItem('fakedoc_google_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore json parse failure
    }
    return null;
  });

  // Google Login Modal State
  const [googleModalState, setGoogleModalState] = useState<{
    isOpen: boolean;
    targetTabName?: string;
    pendingTab?: NavTab;
  }>({
    isOpen: false
  });

  // Default to 'general' if unauthenticated, otherwise restore to 'dashboard'
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    try {
      const storedUser = localStorage.getItem('fakedoc_google_user');
      if (storedUser) {
        return 'dashboard';
      }
    } catch {
      // Fallback
    }
    return 'general';
  });

  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(initialAuditRecords);
  const [secureDocs, setSecureDocs] = useState<SecureDocument[]>(initialSecureDocuments);
  const [inspectorProfile, setInspectorProfile] = useState<InspectorProfile>(defaultInspectorProfile);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings);

  // Sync inspector profile when Google user changes
  useEffect(() => {
    if (googleUser) {
      setInspectorProfile((prev) => ({
        ...prev,
        fullName: googleUser.name,
        name: googleUser.name,
        email: googleUser.email,
        badgeNumber: googleUser.badgeId,
        badgeId: googleUser.badgeId,
        clearanceLevel: googleUser.clearanceLevel,
        googleUser: googleUser
      }));
    }
  }, [googleUser]);

  // Transferred data between General and Advanced modes
  const [transferredDoc, setTransferredDoc] = useState<{
    imageUrl: string;
    fileName: string;
    result?: ScreeningResult;
    sampleFace?: string;
  } | null>(null);

  // Certificate modal state
  const [certificateModal, setCertificateModal] = useState<{
    isOpen: boolean;
    result: ScreeningResult | null;
    docImage?: string;
    docFileName?: string;
  }>({
    isOpen: false,
    result: null
  });

  // Check if a tab is restricted behind Google Login
  const isRestrictedTab = (tab: NavTab) => tab !== 'general';

  const handleTabSelection = (tab: NavTab) => {
    if (isRestrictedTab(tab) && !googleUser) {
      // Open Google Login modal with target tab context
      const tabNames: Record<NavTab, string> = {
        dashboard: 'Dashboard',
        general: 'General Verification',
        advanced: 'Advanced Forensic Mode',
        history: 'Cryptographic Audit Registry',
        'secure-docs': 'Secure Documents Vault',
        reports: 'Forensic Reports',
        account: 'Inspector Account',
        settings: 'System Settings'
      };
      setGoogleModalState({
        isOpen: true,
        targetTabName: tabNames[tab],
        pendingTab: tab
      });
      return;
    }
    setActiveTab(tab);
  };

  const handleOpenGoogleLogin = (targetTabName?: string) => {
    setGoogleModalState({
      isOpen: true,
      targetTabName: targetTabName || 'Restricted Forensic Suite',
      pendingTab: undefined
    });
  };

  const handleGoogleLoginSuccess = (user: GoogleUser) => {
    setGoogleUser(user);
    const target = googleModalState.pendingTab;
    setGoogleModalState({ isOpen: false });

    // Transition to requested tab or dashboard
    if (target) {
      setActiveTab(target);
    } else if (activeTab === 'general') {
      setActiveTab('dashboard');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('fakedoc_google_user');
    setGoogleUser(null);
    // Return to public general verification mode
    setActiveTab('general');
  };

  const handleSaveToRegistry = (record: AuditRecord) => {
    setAuditRecords((prev) => [record, ...prev]);
  };

  const handleClearRegistry = () => {
    setAuditRecords([]);
  };

  const handleAddSecureDoc = (doc: SecureDocument) => {
    setSecureDocs((prev) => [doc, ...prev]);
  };

  const handleTransferToAdvanced = (docData: {
    imageUrl: string;
    fileName: string;
    result?: ScreeningResult;
    sampleFace?: string;
  }) => {
    setTransferredDoc(docData);
    if (!googleUser) {
      setGoogleModalState({
        isOpen: true,
        targetTabName: 'Advanced Forensic Mode',
        pendingTab: 'advanced'
      });
      return;
    }
    setActiveTab('advanced');
  };

  const handleOpenCertificate = (result: ScreeningResult, docImage: string, fileName: string) => {
    setCertificateModal({
      isOpen: true,
      result,
      docImage,
      docFileName: fileName
    });
  };

  const handleSelectSampleFromNav = (sampleId: string) => {
    const sample = sampleDocuments.find((s) => s.id === sampleId);
    if (sample) {
      setTransferredDoc({
        imageUrl: sample.imageUrl,
        fileName: `${sample.category.toLowerCase()}_sample.svg`,
        sampleFace: sample.sampleReferenceFace
      });
      if (!googleUser) {
        setGoogleModalState({
          isOpen: true,
          targetTabName: 'Advanced Forensic Mode',
          pendingTab: 'advanced'
        });
      } else {
        setActiveTab('advanced');
      }
    }
  };

  const handleInspectRecordFromDashboard = (record: AuditRecord) => {
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
    handleOpenCertificate(mockResult, '', record.documentName);
  };

  const handleResetDemoData = () => {
    setAuditRecords(initialAuditRecords);
    setSecureDocs(initialSecureDocuments);
    setInspectorProfile(defaultInspectorProfile);
    setAppSettings(defaultAppSettings);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabSelection}
        registryCount={auditRecords.length}
        secureDocsCount={secureDocs.length}
        onSelectSample={handleSelectSampleFromNav}
        googleUser={googleUser}
        onOpenGoogleLogin={handleOpenGoogleLogin}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* PUBLIC MODE: General Verification (Accessible without login) */}
        {activeTab === 'general' && (
          <GeneralScreening
            onTransferToAdvanced={handleTransferToAdvanced}
            onSaveToRegistry={handleSaveToRegistry}
            onOpenCertificate={handleOpenCertificate}
            isGoogleAuthenticated={!!googleUser}
            onOpenGoogleLogin={handleOpenGoogleLogin}
          />
        )}

        {/* RESTRICTED SUITE: Gated behind Google Login */}
        {isRestrictedTab(activeTab) && !googleUser ? (
          <GoogleAuthGate
            tab={activeTab}
            onOpenGoogleLogin={() => handleOpenGoogleLogin()}
            onGoToGeneralScreening={() => setActiveTab('general')}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                auditRecords={auditRecords}
                secureDocs={secureDocs}
                onNavigate={(tab) => handleTabSelection(tab)}
                onSelectSample={handleSelectSampleFromNav}
                onInspectRecord={handleInspectRecordFromDashboard}
              />
            )}

            {activeTab === 'advanced' && (
              <AdvancedVerification
                initialDocData={transferredDoc}
                auditRegistry={auditRecords}
                onSaveToRegistry={handleSaveToRegistry}
                onOpenCertificate={handleOpenCertificate}
                onVaultDocument={handleAddSecureDoc}
              />
            )}

            {activeTab === 'history' && (
              <AuditRegistry
                records={auditRecords}
                onClearRegistry={handleClearRegistry}
                onOpenCertificate={handleOpenCertificate}
                onNavigateToReports={(recId) => {
                  setActiveTab('reports');
                }}
              />
            )}

            {activeTab === 'secure-docs' && (
              <SecureDocuments
                documents={secureDocs}
                onAddDocument={handleAddSecureDoc}
              />
            )}

            {activeTab === 'reports' && (
              <ReportGeneration
                auditRecords={auditRecords}
                inspectorProfile={inspectorProfile}
              />
            )}

            {activeTab === 'account' && (
              <AccountSection
                profile={inspectorProfile}
                onUpdateProfile={setInspectorProfile}
                googleUser={googleUser}
                onOpenGoogleLogin={handleOpenGoogleLogin}
                onSignOut={handleSignOut}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsSection
                settings={appSettings}
                onSaveSettings={setAppSettings}
                onResetDemoData={handleResetDemoData}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">FAKEDOC-AI</span>
            <span>•</span>
            <span>Forensic Document Screening &amp; Tampering Analysis Platform</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by Google Gemini Multi-Modal, ICAO 9303 Checksum Engine &amp; FIPS SHA-256 Vaulting
          </div>
        </div>
      </footer>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certificateModal.isOpen}
        onClose={() => setCertificateModal({ isOpen: false, result: null })}
        result={certificateModal.result}
        docImage={certificateModal.docImage}
        docFileName={certificateModal.docFileName}
      />

      {/* Google Login Modal */}
      <GoogleLoginModal
        isOpen={googleModalState.isOpen}
        onClose={() => setGoogleModalState({ isOpen: false })}
        onLoginSuccess={handleGoogleLoginSuccess}
        onSuccess={handleGoogleLoginSuccess}
        targetTabName={googleModalState.targetTabName}
      />
    </div>
  );
}
