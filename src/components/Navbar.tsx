import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Fingerprint, FileSearch, Database, Sparkles, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'general' | 'advanced' | 'registry';
  setActiveTab: (tab: 'general' | 'advanced' | 'registry') => void;
  registryCount: number;
  onSelectSample: (sampleId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  registryCount,
  onSelectSample
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white">FAKEDOC<span className="text-blue-400">-AI</span></span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                  Forensic Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI-Powered Document Screening &amp; Biometric Verification</p>
            </div>
          </div>

          {/* Navigation Modes */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-tab-general"
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'general'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>General Screening</span>
            </button>

            <button
              id="nav-tab-advanced"
              onClick={() => setActiveTab('advanced')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'advanced'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span>Advanced Mode</span>
            </button>

            <button
              id="nav-tab-registry"
              onClick={() => setActiveTab('registry')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'registry'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Audit Registry</span>
              {registryCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-slate-700 text-blue-300 rounded-full text-[10px] font-bold">
                  {registryCount}
                </span>
              )}
            </button>
          </nav>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>Gemini 3.8 Multi-Modal</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
