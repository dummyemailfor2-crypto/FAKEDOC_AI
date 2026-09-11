import React from 'react';
import {
  Lock,
  ShieldCheck,
  Fingerprint,
  Database,
  FileText,
  Sliders,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { GoogleIcon } from './GoogleLoginModal';
import { NavTab } from '../types';

interface GoogleAuthGateProps {
  tab: NavTab;
  onOpenGoogleLogin: () => void;
  onGoToGeneralScreening: () => void;
}

const tabDescriptions: Record<
  string,
  { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }
> = {
  dashboard: {
    title: 'Executive Laboratory Dashboard',
    subtitle: 'System-wide tampering metrics, fraud interception ledger, and inspector workloads.',
    icon: LayoutDashboard
  },
  advanced: {
    title: 'Advanced Forensic Biometrics Mode',
    subtitle: '1:1 facial contour comparison, dactyloscopy ridge minutiae, and digital tamper maps.',
    icon: Fingerprint
  },
  history: {
    title: 'Cryptographic Audit Registry',
    subtitle: 'FIPS SHA-256 chained evidence trail and historical screening records.',
    icon: Database
  },
  'secure-docs': {
    title: 'Classified Secure Documents Vault',
    subtitle: 'AES-256 encrypted archival vault for intercepted and authentic documents.',
    icon: Lock
  },
  reports: {
    title: 'Evidentiary Dossier & Legal Reports',
    subtitle: 'Formal court-admissible forensic dossiers and inspector verification sign-offs.',
    icon: FileText
  },
  account: {
    title: 'Inspector Clearance & Credentials',
    subtitle: 'Accreditation IDs, PGP evidence signing keys, and Google Identity tokens.',
    icon: UserCheck
  },
  settings: {
    title: 'System Sensitivity & Thresholds',
    subtitle: 'Biometric matching tolerances, OCR strictness, and AI model parameters.',
    icon: Sliders
  }
};

export const GoogleAuthGate: React.FC<GoogleAuthGateProps> = ({
  tab,
  onOpenGoogleLogin,
  onGoToGeneralScreening
}) => {
  const currentTabInfo = tabDescriptions[tab] || {
    title: 'Restricted Forensic Module',
    subtitle: 'Restricted access zone requiring Google Authentication.',
    icon: Lock
  };
  const Icon = currentTabInfo.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-8 text-white text-center relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Forensic Clearance Required</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                {currentTabInfo.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {currentTabInfo.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Public vs Restricted Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Restricted Zone */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span>Requires Google Sign-In</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                To safeguard chain-of-custody protocols and sensitive biometric identifiers, access to the following is restricted:
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Dashboard &amp; Fraud Surveillance Metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Advanced Biometric Face &amp; Fingerprint Lab</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Cryptographic Audit Registry &amp; Vault</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Evidentiary Dossier &amp; Account Clearance</span>
                </li>
              </ul>
            </div>

            {/* Right: Public Access Notice */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>General Verification Is Public</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                You do <strong>not</strong> need to log in to screen documents! General Verification remains completely separated and free for all users:
              </p>
              <ul className="text-xs text-emerald-800 space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant Multi-Modal AI Document Screening</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ICAO 9303 MRZ &amp; OCR Checksum Engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tampering Indicators &amp; Inspection Certificate</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="btn-gate-google-signin"
              onClick={onOpenGoogleLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Sign in with Google to Unlock</span>
            </button>

            <button
              id="btn-gate-goto-general"
              onClick={onGoToGeneralScreening}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <span>Continue to General Verification (No Login)</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
