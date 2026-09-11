import React, { useState } from 'react';
import {
  User,
  Shield,
  Award,
  Key,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  Building,
  Mail,
  Fingerprint,
  Lock,
  Copy,
  Check,
  Edit2,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { InspectorProfile, GoogleUser } from '../types';
import { GoogleIcon } from './GoogleLoginModal';

interface AccountSectionProps {
  profile: InspectorProfile;
  onUpdateProfile?: (updated: InspectorProfile) => void;
  googleUser?: GoogleUser | null;
  onOpenGoogleLogin?: () => void;
  onSignOut?: () => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  profile,
  googleUser,
  onOpenGoogleLogin,
  onSignOut
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const pgpKey =
    profile.pgpPublicKeyFingerprint ||
    '9B34 8F01 C56A 721D E849  3014 918A 617F 4E0D 8891';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pgpKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleCopyToken = () => {
    if (googleUser?.accessToken) {
      navigator.clipboard.writeText(googleUser.accessToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  const displayName = googleUser?.name || profile.fullName || profile.name;
  const displayBadge = googleUser?.badgeId || profile.badgeNumber || profile.badgeId;
  const displayClearance = googleUser?.clearanceLevel || profile.clearanceLevel;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Accredited Forensic Examiner</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Inspector Account &amp; Clearance
        </h1>
        <p className="text-slate-600 text-sm">
          Credentials, Google OAuth authentication, cryptographic evidence signing keys, and inspection quotas.
        </p>
      </div>

      {/* Google Security & Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <GoogleIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Google Authentication Status</h3>
                {googleUser ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                    AUTHENTICATED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                    SESSION UNLINKED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Google Workspace &amp; Identity OAuth 2.0 Integration
              </p>
            </div>
          </div>

          {googleUser ? (
            <div className="flex items-center gap-2">
              {onOpenGoogleLogin && (
                <button
                  onClick={() => onOpenGoogleLogin()}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Switch Account</span>
                </button>
              )}
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          ) : (
            onOpenGoogleLogin && (
              <button
                onClick={() => onOpenGoogleLogin()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow-xs transition"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Connect Google Account</span>
              </button>
            )
          )}
        </div>

        {googleUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium">Google Account Email</span>
              <span className="font-mono font-bold text-slate-900 block truncate">
                {googleUser.email}
              </span>
              <p className="text-[11px] text-slate-400">Authenticated identity provider</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium">Clearance Level</span>
              <span className="font-extrabold text-purple-700 block">
                {googleUser.clearanceLevel}
              </span>
              <p className="text-[11px] text-slate-400">Top Secret Forensics Permitted</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium">Session Expiry</span>
              <span className="font-mono text-emerald-700 font-bold block">
                {new Date(googleUser.sessionExpiresAt).toLocaleTimeString()} (Active)
              </span>
              <p className="text-[11px] text-slate-400">Auto-refresh enabled</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {displayName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                {profile.title || 'Senior Forensic Document Specialist'}
              </p>
              <p className="text-xs text-slate-400">{profile.agency}</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1">
            <span className="text-xs text-slate-400 font-mono">BADGE IDENTIFIER</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800 text-xs">
              {displayBadge}
            </span>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-500 block">Security Clearance</span>
            <span className="font-extrabold text-purple-700 text-sm">{displayClearance}</span>
            <p className="text-[11px] text-slate-400">Authorized for Top Secret Documents</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-500 block">Accreditation ID</span>
            <span className="font-extrabold text-slate-800 text-sm">
              {profile.accreditationId || 'ICAO-DOC-88910-GBR'}
            </span>
            <p className="text-[11px] text-slate-400">ICAO Document Specialist Validated</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-500 block">Operational Division</span>
            <span className="font-extrabold text-slate-800 text-sm">{profile.department}</span>
            <p className="text-[11px] text-slate-400">High-Risk Port Surveillance</p>
          </div>
        </div>

        {/* Operational Statistics */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Certified Examination Statistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
              <span className="text-blue-700 text-[11px] font-medium block">Total Screenings</span>
              <span className="text-2xl font-extrabold text-blue-900">
                {profile.inspectionsCompleted || profile.documentsVerified}
              </span>
            </div>
            <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-100 space-y-1">
              <span className="text-red-700 text-[11px] font-medium block">Forgeries Intercepted</span>
              <span className="text-2xl font-extrabold text-red-900">
                {profile.forgeriesIntercepted || profile.fraudDetectedCount}
              </span>
            </div>
            <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1">
              <span className="text-purple-700 text-[11px] font-medium block">Biometric Audits</span>
              <span className="text-2xl font-extrabold text-purple-900">
                {profile.biometricsAudited || 342}
              </span>
            </div>
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
              <span className="text-emerald-700 text-[11px] font-medium block">Accuracy Rating</span>
              <span className="text-2xl font-extrabold text-emerald-900">99.8%</span>
            </div>
          </div>
        </div>

        {/* Cryptographic Key Container */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-600" />
              Digital Evidence Signing Key (PGP / RSA-4096)
            </h3>
            <button
              onClick={handleCopyKey}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied' : 'Copy Key Fingerprint'}</span>
            </button>
          </div>
          <div className="p-3 bg-slate-900 text-slate-200 font-mono text-xs rounded-xl break-all">
            {pgpKey}
          </div>
        </div>
      </div>
    </div>
  );
};
