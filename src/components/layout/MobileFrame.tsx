import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Wifi,
  Battery,
  Layers,
  Sparkles,
  RotateCcw,
  Stethoscope,
  BookOpen,
  ChevronRight,
  Maximize2,
  Minimize2,
  LogIn,
  Sun,
  Moon,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { viewMode, setViewMode, deviceFrame, setDeviceFrame, theme, toggleTheme } = useClinic();
  const [time, setTime] = useState<string>('19:02');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#E9F1F9] dark:bg-[#030B14] text-[#0A2540] dark:text-[#F1F5F9] flex flex-col font-sans transition-colors duration-200">
      {/* Top Application Control & Capstone Mode Switcher Header */}
      <header className="bg-[#0A2540] dark:bg-[#040E1B] text-white border-b border-[#1E3A5F] dark:border-[#0F294D] px-4 py-2.5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Capstone Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0057B8] text-white flex items-center justify-center font-black text-sm shadow-md border border-[#4EA1F3]/40">
              MC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  MCARE <span className="font-semibold text-xs text-[#4EA1F3]">OB GYN CLINIC</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#0057B8]/40 text-[#BAE6FD] text-[10px] font-bold border border-[#0057B8]">
                  Mobile Patient App
                </span>
              </div>
              <p className="text-[11px] text-[#93C5FD]">
                CCA ICSLIS Thesis Capstone • Balibago, Angeles City
              </p>
            </div>
          </div>

          {/* Mode Switcher Buttons & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-[#06182B] p-1 rounded-xl flex items-center gap-1 border border-[#1E3A5F] flex-wrap">
              <button
                onClick={() => setViewMode('mobile-app')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'mobile-app'
                    ? 'bg-[#0057B8] text-white shadow-md'
                    : 'text-[#93C5FD] hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Patient Mobile App</span>
              </button>

              <button
                onClick={() => setViewMode('staff-portal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'staff-portal'
                    ? 'bg-[#0057B8] text-white shadow-md'
                    : 'text-[#93C5FD] hover:text-white'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-pink-400" />
                <span>Web Manager (Clinic Desk)</span>
              </button>

              <button
                onClick={() => setViewMode('playstore-hub')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'playstore-hub'
                    ? 'bg-[#0057B8] text-white shadow-md'
                    : 'text-[#93C5FD] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Play Store TWA Hub</span>
              </button>

              <button
                onClick={() => setViewMode('auth-preview')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'auth-preview'
                    ? 'bg-[#0057B8] text-white shadow-md'
                    : 'text-[#93C5FD] hover:text-white'
                }`}
                title="Patient Login & Register Screen"
              >
                <LogIn className="w-3 h-3 text-[#4EA1F3]" />
                <span className="hidden sm:inline">Patient Auth</span>
              </button>

              <button
                onClick={() => setViewMode('thesis-roadmap')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'thesis-roadmap'
                    ? 'bg-[#0057B8] text-white shadow-md'
                    : 'text-[#93C5FD] hover:text-white'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span className="hidden sm:inline">Thesis Specs</span>
              </button>
            </div>

            {/* Device Skin Toggle & Fullscreen Toggle (When in Mobile or Auth view) */}
            {(viewMode === 'mobile-app' || viewMode === 'auth-preview') && (
              <div className="hidden md:flex bg-[#06182B] p-1 rounded-xl items-center gap-1 border border-[#1E3A5F] text-xs">
                <button
                  onClick={() => setDeviceFrame('ios')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    deviceFrame === 'ios' ? 'bg-[#0057B8] text-white' : 'text-[#93C5FD] hover:text-white'
                  }`}
                >
                  iOS (iPhone 16)
                </button>
                <button
                  onClick={() => setDeviceFrame('android')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    deviceFrame === 'android' ? 'bg-[#0057B8] text-white' : 'text-[#93C5FD] hover:text-white'
                  }`}
                >
                  Android (Pixel 9)
                </button>
              </div>
            )}

            {/* Capstone Dark Mode Switcher */}
            <div className="bg-[#06182B] p-1 rounded-xl flex items-center border border-[#1E3A5F]">
              <button
                onClick={toggleTheme}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 text-[#BAE6FD] hover:text-white hover:bg-[#0057B8]/40 cursor-pointer"
                aria-label={`Toggle theme (Current: ${theme})`}
                title={`Click to switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#FBBF24]" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#93C5FD]" />
                    <span>Light</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 flex items-center justify-center p-0 md:p-6 overflow-x-hidden">
        {viewMode === 'mobile-app' || viewMode === 'auth-preview' ? (
          <div className="w-full max-w-[430px] my-auto flex flex-col items-center">
            {/* Realistic Native Device Container */}
            <div
              className={`w-full bg-[#06182B] shadow-2xl overflow-hidden transition-all duration-300 flex flex-col relative ${
                deviceFrame === 'ios'
                  ? 'md:rounded-[52px] md:border-[10px] md:border-[#0E294B] dark:md:border-[#132A46] md:ring-1 md:ring-[#1E3A5F] h-[844px] max-h-[calc(100vh-80px)]'
                  : 'md:rounded-[42px] md:border-[10px] md:border-[#0E294B] dark:md:border-[#132A46] md:ring-1 md:ring-[#1E3A5F] h-[844px] max-h-[calc(100vh-80px)]'
              }`}
            >
              {/* Dynamic Island / Hardware Status Bar */}
              <div
                className={`${
                  viewMode === 'auth-preview'
                    ? 'bg-transparent text-white border-transparent absolute top-0 left-0 right-0 z-40'
                    : 'bg-white dark:bg-[#081525] text-[#0A2540] dark:text-[#E2ECF8] border-b border-[#E2ECF8] dark:border-[#1A365D]'
                } px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold select-none shrink-0 transition-colors duration-200`}
              >
                <span className="text-[13px] font-bold tracking-tight">{time}</span>

                {/* iPhone Dynamic Island or Android Camera Pill */}
                {deviceFrame === 'ios' ? (
                  <div className="w-24 h-5 bg-[#0A2540] dark:bg-[#040B14] rounded-full flex items-center justify-center gap-1.5 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#1E3A5F] border border-[#3B82F6]/40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F]"></div>
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#0A2540] dark:bg-[#040B14] border border-[#1E3A5F]"></div>
                )}

                <div
                  className={`flex items-center gap-1.5 ${
                    viewMode === 'auth-preview'
                      ? 'text-white'
                      : 'text-[#475E7B] dark:text-[#94A3B8]'
                  }`}
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Mobile Screen Content Canvas */}
              <div className="flex-1 min-h-0 bg-[#F4F8FD] dark:bg-[#061524] text-[#0A2540] dark:text-[#F1F5F9] flex flex-col relative overflow-hidden transition-colors duration-200">
                {children}
              </div>

              {/* Native Home Indicator Bar */}
              <div
                className={`${
                  viewMode === 'auth-preview'
                    ? 'bg-transparent border-transparent absolute bottom-0 left-0 right-0 z-40'
                    : 'bg-white dark:bg-[#081525] border-t border-[#E2ECF8] dark:border-[#1A365D]'
                } py-1.5 flex justify-center shrink-0 transition-colors duration-200`}
              >
                <div
                  className={`w-32 h-1 ${
                    viewMode === 'auth-preview'
                      ? 'bg-white/40'
                      : 'bg-[#94A3B8]/60 dark:bg-[#64748B]/60'
                  } rounded-full`}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">{children}</div>
        )}
      </main>
    </div>
  );
};

