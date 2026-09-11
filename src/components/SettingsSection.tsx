import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Fingerprint,
  Cpu,
  Bell,
  Database,
  RefreshCw,
  Check,
  Save,
  Volume2,
  Lock
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsSectionProps {
  settings: AppSettings;
  onSaveSettings: (updated: AppSettings) => void;
  onResetDemoData: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings: initialSettings,
  onSaveSettings,
  onResetDemoData
}) => {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>System &amp; Laboratory Parameters</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Forensic Verification Settings
        </h1>
        <p className="text-slate-600 text-sm">
          Fine-tune OCR sensitivity, biometric landmark thresholds, automated archival, and AI fallback rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Forensic Detection Rigor */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Detection Rigor &amp; Sensitivity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Tampering Detection Mode</label>
              <select
                value={settings.tamperingSensitivity}
                onChange={(e: any) =>
                  setSettings({ ...settings, tamperingSensitivity: e.target.value })
                }
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="HIGH">HIGH (Flag minor font kerning &amp; anti-alias anomalies)</option>
                <option value="STANDARD">STANDARD (Recommended for border control)</option>
                <option value="LOW">LOW (Tolerate physical scan wear &amp; compression)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">OCR Strictness Level</label>
              <select
                value={settings.ocrStrictness}
                onChange={(e: any) =>
                  setSettings({ ...settings, ocrStrictness: e.target.value })
                }
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="STRICT">STRICT (Zero tolerance for character substitution)</option>
                <option value="BALANCED">BALANCED (Compensates for slight glare)</option>
                <option value="LENIENT">LENIENT (Accept degraded low-res mobile captures)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Biometric Match Thresholds */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-emerald-600" />
            Biometric Verification Thresholds
          </h2>

          <div className="space-y-5 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1 font-semibold text-slate-700">
                <span>Facial Landmark Similarity Cutoff:</span>
                <span className="font-mono text-blue-600 font-bold">{settings.faceMatchThreshold}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={98}
                value={settings.faceMatchThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, faceMatchThreshold: Number(e.target.value) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Score required to issue an affirmative "FACE MATCH" biometric verdict.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 font-semibold text-slate-700">
                <span>Fingerprint Minutiae Correlation Cutoff:</span>
                <span className="font-mono text-emerald-600 font-bold">{settings.fingerprintMatchThreshold}%</span>
              </div>
              <input
                type="range"
                min={75}
                max={98}
                value={settings.fingerprintMatchThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, fingerprintMatchThreshold: Number(e.target.value) })
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Minimum ridge bifurcation &amp; ending point alignment score required for biometric match.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Automation & Security Vaulting */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            Automated Archival &amp; Vault Policies
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">Automatic Vault Ingestion</span>
                <span className="text-slate-500 text-[11px]">
                  Immediately encrypt and vault every screened document into the Secure Documents repository.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSaveToVault}
                onChange={(e) =>
                  setSettings({ ...settings, autoSaveToVault: e.target.checked })
                }
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">Audible Fraud Alerts</span>
                <span className="text-slate-500 text-[11px]">
                  Play alert chime when a forged or tampered document is detected.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundAlerts}
                onChange={(e) =>
                  setSettings({ ...settings, soundAlerts: e.target.checked })
                }
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">Multi-Model Fallback Engine</span>
                <span className="text-slate-500 text-[11px]">
                  Automatically switch to backup vision models and local heuristic analyzers if demand spikes occur.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.aiModelPriority === 'gemini-2.5-flash'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    aiModelPriority: e.target.checked ? 'gemini-2.5-flash' : 'gemini-2.5-pro'
                  })
                }
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetDemoData}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Settings Applied!' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
