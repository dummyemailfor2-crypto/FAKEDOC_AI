import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Cpu,
  Fingerprint,
  FileSearch,
  Database,
  Lock,
  FileText,
  User,
  Sliders,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
  Key,
  Globe
} from 'lucide-react';
import { NavTab, GoogleUser } from '../types';
import { GoogleIcon } from './GoogleLoginModal';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  registryCount: number;
  secureDocsCount?: number;
  onSelectSample: (sampleId: string) => void;
  googleUser: GoogleUser | null;
  onOpenGoogleLogin: (targetTabName?: string) => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  registryCount,
  secureDocsCount = 0,
  onSelectSample,
  googleUser,
  onOpenGoogleLogin,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    isPublic?: boolean;
  }[] = [
    // Public general verification is separated out of login
    { id: 'general', label: 'General Verification', icon: FileSearch, isPublic: true },
    // Restricted tabs behind Google Login
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'advanced', label: 'Advanced Mode', icon: Fingerprint },
    { id: 'history', label: 'History', icon: Database, count: registryCount },
    { id: 'secure-docs', label: 'Secure Docs', icon: Lock, count: secureDocsCount },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'account', label: 'Account', icon: User },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  const handleTabClick = (item: (typeof navItems)[0]) => {
    if (!item.isPublic && !googleUser) {
      // Require Google Login for restricted tabs
      onOpenGoogleLogin(item.label);
      setMobileMenuOpen(false);
      return;
    }
    setActiveTab(item.id);
    setMobileMenuOpen(false);
  };

  const handleBrandClick = () => {
    if (googleUser) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('general');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            onClick={handleBrandClick}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 border border-blue-400/40 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-wider text-white">
                  FAKEDOC<span className="text-blue-400">-AI</span>
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                  v3.8
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden xl:block">
                Forensic Screening &amp; Tampering Analysis Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLocked = !item.isPublic && !googleUser;

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleTabClick(item)}
                  title={isLocked ? `Sign in with Google to access ${item.label}` : item.label}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : isLocked
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.isPublic && !isActive ? 'text-emerald-400' : ''}`} />
                  <span>{item.label}</span>

                  {/* Public Open Access Tag on General Screen */}
                  {item.isPublic && (
                    <span
                      className={`ml-1 px-1 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                        isActive
                          ? 'bg-blue-800 text-blue-100'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      Public
                    </span>
                  )}

                  {/* Lock icon for restricted tabs when logged out */}
                  {isLocked && (
                    <Lock className="w-3 h-3 text-slate-400 ml-0.5" />
                  )}

                  {/* Count badge for history/secure-docs */}
                  {!isLocked && typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-blue-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Status / Google Auth Control */}
          <div className="hidden sm:flex items-center gap-3">
            {googleUser ? (
              /* Authenticated Google User Pill & Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  id="user-account-dropdown-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs transition"
                >
                  <div className="relative">
                    <img
                      src={googleUser.picture || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(googleUser.email)}`}
                      alt={googleUser.name}
                      className="w-7 h-7 rounded-full bg-slate-700 object-cover border border-blue-400/50"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
                  </div>
                  <div className="text-left hidden md:block max-w-[130px] truncate">
                    <span className="block font-bold text-white text-[11px] truncate leading-tight">
                      {googleUser.name}
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate leading-tight font-mono">
                      {googleUser.email}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 text-slate-900 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Profile Header */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <GoogleIcon className="w-4 h-4 shrink-0" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Google Identity Verified
                        </span>
                      </div>
                      <p className="font-bold text-sm text-slate-900 truncate">
                        {googleUser.name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono truncate">
                        {googleUser.email}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-extrabold border border-purple-200">
                          {googleUser.clearanceLevel}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Quick Links */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('account');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Inspector Account &amp; Clearance</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('settings');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition"
                      >
                        <Sliders className="w-4 h-4 text-slate-500" />
                        <span>Forensic System Settings</span>
                      </button>
                    </div>

                    {/* Sign Out Action */}
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        id="btn-navbar-signout"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSignOut();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span>Sign Out of Google</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Google Sign-In Action */
              <div className="flex items-center gap-2">
                <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>General Tool: Open</span>
                </div>

                <button
                  id="btn-navbar-google-signin"
                  onClick={() => onOpenGoogleLogin()}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold hover:bg-slate-100 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            {!googleUser && (
              <button
                onClick={() => onOpenGoogleLogin()}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-slate-800 text-xs font-bold shadow-sm"
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {googleUser && (
            <div className="p-3 mb-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={googleUser.picture || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(googleUser.email)}`}
                  alt={googleUser.name}
                  className="w-8 h-8 rounded-full bg-slate-700 border border-blue-400"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="block font-bold text-xs text-white truncate max-w-[160px]">
                    {googleUser.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                    {googleUser.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="px-2.5 py-1 text-[11px] font-semibold text-red-400 hover:text-red-300 bg-red-950/40 border border-red-800/40 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = !item.isPublic && !googleUser;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isLocked
                    ? 'text-slate-400 hover:bg-slate-800/60'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.isPublic && !isActive ? 'text-emerald-400' : ''}`} />
                  <span>{item.label}</span>
                  {item.isPublic && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                      Public
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {isLocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                  {!isLocked && typeof item.count === 'number' && item.count > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-blue-300">
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {!googleUser && (
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenGoogleLogin();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-800 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Sign in with Google to Unlock All Tabs</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
