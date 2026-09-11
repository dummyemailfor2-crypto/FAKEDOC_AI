import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  FileCheck,
  Sparkles,
  ArrowRight,
  Database,
  Building,
  Key
} from 'lucide-react';
import { GoogleUser } from '../types';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: GoogleUser) => void;
  onSuccess?: (user: GoogleUser) => void;
  targetTabName?: string;
  defaultEmail?: string;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSuccess,
  targetTabName,
  defaultEmail = 'dummyemailfor2@gmail.com'
}) => {
  const [selectedEmail, setSelectedEmail] = useState(defaultEmail);
  const [isCustomEmail, setIsCustomEmail] = useState(false);
  const [customEmailInput, setCustomEmailInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = (emailToUse: string) => {
    setError(null);
    if (!emailToUse || !emailToUse.includes('@')) {
      setError('Please enter a valid Google or Workspace email address.');
      return;
    }

    setIsAuthenticating(true);
    setAuthStep('Initializing Google Identity Services (GSI)...');

    // Simulate authentic Google OAuth 2.0 handshake with progressive status
    setTimeout(() => {
      setAuthStep('Authenticating credentials with accounts.google.com...');
    }, 450);

    setTimeout(() => {
      setAuthStep('Authorizing Forensic Laboratory Scopes & Issuing Token...');
    }, 900);

    setTimeout(() => {
      const email = emailToUse.trim();
      const username = email.split('@')[0];
      const displayName =
        email === defaultEmail
          ? 'Special Inspector (Google Auth)'
          : username
              .split(/[._-]/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ') || 'Forensic Investigator';

      const randomToken =
        'ya29.a0AfH6SM' +
        Array.from({ length: 48 }, () =>
          '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'[
            Math.floor(Math.random() * 62)
          ]
        ).join('');

      const googleUser: GoogleUser = {
        id: 'google-sub-' + Math.random().toString(36).substring(2, 11),
        name: displayName,
        email: email,
        givenName: displayName.split(' ')[0],
        familyName: displayName.split(' ').slice(1).join(' ') || 'Examiner',
        picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
          email
        )}&backgroundColor=0369a1,0f172a,1e3a8a`,
        accessToken: randomToken,
        idToken: `eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMyJ9.${btoa(
          JSON.stringify({ email, sub: 'user-google-1092841' })
        )}.signature`,
        role: 'Certified Forensic Examiner',
        agency: 'International Document Security Agency',
        badgeId: 'EXP-8891-FORENSIC',
        clearanceLevel: 'LEVEL 4 - TOP SECRET / SCI',
        signedInAt: new Date().toISOString(),
        sessionExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(), // 8 hr session
        authMethod: 'google_oauth',
        scopes: [
          'openid',
          'email',
          'profile',
          'https://www.googleapis.com/auth/identity.forensics',
          'https://www.googleapis.com/auth/audit.registry'
        ]
      };

      // Save to localStorage for durable user persistence
      try {
        localStorage.setItem('fakedoc_google_user', JSON.stringify(googleUser));
      } catch (e) {
        console.warn('Could not persist Google session in localStorage', e);
      }

      setIsAuthenticating(false);
      const callback = onLoginSuccess || onSuccess;
      if (typeof callback === 'function') {
        callback(googleUser);
      }
      onClose();
    }, 1300);
  };

  return (
    <div
      id="google-login-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="google-login-modal-container"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Banner */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Google Workspace &amp; Identity
                </span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                  OAuth 2.0
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                Secure Forensic Sign-In
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isAuthenticating}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Target Module Notice */}
          {targetTabName && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-950">
                  Restricted Module: {targetTabName}
                </span>
                <p className="text-blue-800 mt-0.5 leading-relaxed">
                  Access to Dashboard, Biometric Mode, History, Encrypted Secure Docs, Reports, and
                  Account Settings is reserved for authenticated personnel. General Verification
                  remains openly accessible.
                </p>
              </div>
            </div>
          )}

          {/* Authentication Progress State */}
          {isAuthenticating ? (
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <GoogleIcon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Connecting to Google Identity</h3>
                <p className="text-xs text-slate-600 font-mono animate-pulse">{authStep}</p>
              </div>
              <div className="w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          ) : (
            <>
              {/* Account Selection Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Select Google Account for Forensic Clearance
                </label>

                {/* Detected / Recommended Account */}
                <div
                  onClick={() => {
                    setIsCustomEmail(false);
                    setSelectedEmail(defaultEmail);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    !isCustomEmail
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {defaultEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {defaultEmail.split('@')[0]}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          Verified
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{defaultEmail}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="google-account"
                      checked={!isCustomEmail}
                      onChange={() => {
                        setIsCustomEmail(false);
                        setSelectedEmail(defaultEmail);
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Custom Google Account Option */}
                <div
                  onClick={() => setIsCustomEmail(true)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2.5 ${
                    isCustomEmail
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center">
                        <GoogleIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900">
                          Use another Google account
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Sign in with any personal Google or Google Workspace email
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="google-account"
                      checked={isCustomEmail}
                      onChange={() => setIsCustomEmail(true)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {isCustomEmail && (
                    <div className="pt-2">
                      <input
                        type="email"
                        placeholder="username@gmail.com or organization.org"
                        value={customEmailInput}
                        onChange={(e) => setCustomEmailInput(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono bg-white"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Error Notification */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Authorized Scopes Preview */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 text-xs text-slate-600 space-y-2">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  Privileges Unlocked with Google Sign-In:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Executive Lab Dashboard</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Biometric Face &amp; Fingerprint</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tamper History &amp; Audit Trail</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>AES-256 Vault &amp; Reports</span>
                  </div>
                </div>
              </div>

              {/* Official Google Sign-In Action Button */}
              <button
                id="btn-google-oauth-submit"
                onClick={() =>
                  handleGoogleSignIn(isCustomEmail ? customEmailInput : selectedEmail)
                }
                className="w-full py-3 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-bold flex items-center justify-center gap-3 shadow-sm hover:shadow transition"
              >
                <GoogleIcon className="w-5 h-5" />
                <span>
                  Sign in with Google (
                  {isCustomEmail ? customEmailInput || 'your account' : defaultEmail}
                  )
                </span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                General Document Verification remains public and never requires an account.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Official Google G 4-Color Vector Icon
export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      fill="#4285F4"
    />
    <path
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.31 24 12 24z"
      fill="#34A853"
    />
    <path
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
      fill="#FBBC05"
    />
    <path
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      fill="#EA4335"
    />
  </svg>
);
