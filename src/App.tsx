import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { GeneralScreening } from './components/GeneralScreening';
import { AdvancedVerification } from './components/AdvancedVerification';
import { AuditRegistry } from './components/AuditRegistry';
import { CertificateModal } from './components/CertificateModal';
import { ScreeningResult, AuditRecord } from './types';
import { sampleDocuments } from './data/sampleDocuments';

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
      issuer: 'IPS Glasgow / United Kingdom',
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
    verifiedBy: 'Border Security Officer #4092'
  },
  {
    id: 'REC-DEU-551209',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    documentType: 'Visa',
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
    fingerprintUsed: true,
    fingerprintSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    fingerprintStatus: 'MATCH_FOUND',
    faceMatchUsed: false,
    verifiedBy: 'Senior Border Forensic Examiner'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'general' | 'advanced' | 'registry'>('general');
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(initialAuditRecords);

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

  const handleSaveToRegistry = (record: AuditRecord) => {
    setAuditRecords((prev) => [record, ...prev]);
  };

  const handleClearRegistry = () => {
    setAuditRecords([]);
  };

  const handleTransferToAdvanced = (docData: {
    imageUrl: string;
    fileName: string;
    result?: ScreeningResult;
    sampleFace?: string;
  }) => {
    setTransferredDoc(docData);
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
      setActiveTab('general');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        registryCount={auditRecords.length}
        onSelectSample={handleSelectSampleFromNav}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'general' && (
          <GeneralScreening
            onTransferToAdvanced={handleTransferToAdvanced}
            onSaveToRegistry={handleSaveToRegistry}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {activeTab === 'advanced' && (
          <AdvancedVerification
            initialDocData={transferredDoc}
            auditRegistry={auditRecords}
            onSaveToRegistry={handleSaveToRegistry}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {activeTab === 'registry' && (
          <AuditRegistry
            records={auditRecords}
            onClearRegistry={handleClearRegistry}
            onOpenCertificate={handleOpenCertificate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">FAKEDOC-AI</span>
            <span>•</span>
            <span>AI Forensic Screening System</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by Google Gemini 3.8 Multi-Modal &amp; FIPS SHA-256 Fingerprinting
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
    </div>
  );
}
