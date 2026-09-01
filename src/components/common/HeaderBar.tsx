import React from 'react';
import { Bell, ShieldCheck, HeartPulse, Moon, Sun } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenNotifications?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title = 'M-Care Patient',
  subtitle,
  showBack = false,
  onBack,
  onOpenNotifications,
}) => {
  const { unreadNotifCount, patient, theme, toggleTheme } = useClinic();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#081525]/95 backdrop-blur-md border-b border-[#E2ECF8] dark:border-[#1A365D] px-4 py-3 shadow-xs transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F4F8FD] dark:bg-[#10243E] text-[#0057B8] dark:text-[#60A5FA] hover:bg-[#E1EFFF] dark:hover:bg-[#1A365D] active:scale-95 transition-all border border-[#D6E4F5] dark:border-[#1E3A5F] cursor-pointer"
              aria-label="Back"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0057B8] to-[#0047A0] dark:from-[#0057B8] dark:to-[#0A2540] flex items-center justify-center text-white shadow-xs border border-[#4EA1F3]/30">
              <HeartPulse className="w-5 h-5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-[#0A2540] dark:text-white tracking-tight leading-tight">
                {title}
              </h1>
              {patient?.isExistingRecordMatched && (
                <span
                  title="Linked to Official Clinic Registry"
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#E1EFFF] dark:bg-[#10243E] text-[#0057B8] dark:text-[#93C5FD] text-[10px] font-bold border border-[#B9DBFE] dark:border-[#1E3A5F]"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{patient.patientCode}</span>
                </span>
              )}
            </div>
            {subtitle ? (
              <p className="text-xs text-[#475E7B] dark:text-[#94A3B8] font-medium">{subtitle}</p>
            ) : (
              <p className="text-[11px] text-[#0057B8] dark:text-[#60A5FA] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                Balibago Clinic Open Today
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[#F4F8FD] dark:bg-[#10243E] text-[#0A2540] dark:text-[#F1F5F9] hover:bg-[#E1EFFF] dark:hover:bg-[#1A365D] hover:text-[#0057B8] dark:hover:text-[#60A5FA] transition-all border border-[#D6E4F5] dark:border-[#1E3A5F] cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FBBF24] animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-[#0057B8]" />
            )}
          </button>

          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-[#F4F8FD] dark:bg-[#10243E] text-[#0A2540] dark:text-[#F1F5F9] hover:bg-[#E1EFFF] dark:hover:bg-[#1A365D] hover:text-[#0057B8] dark:hover:text-[#60A5FA] transition-colors border border-[#D6E4F5] dark:border-[#1E3A5F] cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0057B8] text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadNotifCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

