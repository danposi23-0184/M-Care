import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, CheckCircle2, Share2, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full' | 'banner';
  className?: string;
  onOpenPlayStoreHub?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  className = '',
  onOpenPlayStoreHub,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      try {
        await install();
      } finally {
        setInstalling(false);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else if (onOpenPlayStoreHub) {
      onOpenPlayStoreHub();
    }
  };

  // If already running in standalone PWA / TWA mode
  if (isInstalled) {
    if (variant === 'banner') return null;
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Installed App</span>
      </span>
    );
  }

  return (
    <>
      {variant === 'banner' ? (
        <div className={`bg-gradient-to-r from-[#0057B8] to-[#0A2540] text-white p-3.5 rounded-2xl shadow-md border border-[#4EA1F3]/30 flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Smartphone className="w-5 h-5 text-[#93C5FD]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Install M-Care Mobile App</span>
                <span className="px-1.5 py-0.2 bg-[#38BDF8]/20 text-[#BAE6FD] text-[9px] rounded font-mono font-bold">
                  Play Store Ready
                </span>
              </div>
              <p className="text-[11px] text-[#BAE6FD] leading-tight">
                Add to home screen for offline access & instant appointment alerts.
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            disabled={installing}
            className="px-3.5 py-1.5 rounded-xl bg-white text-[#0057B8] text-xs font-extrabold hover:bg-white/95 active:scale-95 shadow transition shrink-0 cursor-pointer"
          >
            {installing ? 'Installing...' : 'Install Now'}
          </button>
        </div>
      ) : variant === 'full' ? (
        <button
          onClick={handleInstallClick}
          disabled={installing}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0057B8] hover:bg-[#004494] text-white text-xs font-bold shadow-md transition active:scale-95 cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>{isIOS ? 'Install on iPhone / iPad' : 'Install Patient App (PWA)'}</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          disabled={installing}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0057B8]/20 hover:bg-[#0057B8]/30 text-[#0057B8] dark:text-[#93C5FD] border border-[#0057B8]/40 text-xs font-bold transition active:scale-95 cursor-pointer ${className}`}
          title="Install app to your device"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#0B1527] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-[#0A2540] dark:text-white space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-[#0057B8]/10 text-[#0057B8] flex items-center justify-center mx-auto">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-extrabold">Install on Apple iOS</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Install M-Care Patient App to your Home Screen in 2 simple taps:
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 text-xs space-y-2.5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#0057B8] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Tap the <strong>Share</strong> icon in the bottom Safari toolbar.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#0057B8] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Scroll down and tap <strong>Add to Home Screen</strong>.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-2.5 text-xs font-bold transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
