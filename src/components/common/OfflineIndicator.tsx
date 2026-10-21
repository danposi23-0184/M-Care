import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-18 left-4 right-4 z-50 flex items-center justify-between gap-3 rounded-2xl bg-[#0F172A] border border-amber-500/40 p-3 text-xs text-white shadow-2xl backdrop-blur-md animate-fade-in">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-amber-300">Offline Mode Active</div>
          <p className="text-[11px] text-slate-300">
            Cached clinic records & appointments are available. Changes will sync when reconnected.
          </p>
        </div>
      </div>
      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
    </div>
  );
};
