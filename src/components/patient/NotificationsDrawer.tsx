import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Calendar,
  Clock,
  Info,
  Check,
  Globe,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import {
  requestBrowserNotificationPermission,
  ReminderLanguage,
} from '../../utils/smartReminders';

interface NotificationsDrawerProps {
  onClose: () => void;
  onNavigateToAppointment?: (appointmentId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  onClose,
  onNavigateToAppointment,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    smartReminderSettings,
    updateSmartReminderSettings,
    triggerSmart24hCheck,
    sendSimulatedPush,
  } = useClinic();

  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    } else {
      setBrowserPermission('unsupported');
    }
  }, []);

  const handleToggleSmartReminders = async () => {
    const nextState = !smartReminderSettings.enabled;
    updateSmartReminderSettings({ enabled: nextState });

    if (nextState && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted') {
        const res = await requestBrowserNotificationPermission();
        setBrowserPermission(res);
      }
    }
  };

  const handleRequestPermission = async () => {
    const res = await requestBrowserNotificationPermission();
    setBrowserPermission(res);
  };

  const handleTriggerTestReminder = (lang?: ReminderLanguage) => {
    const result = triggerSmart24hCheck(true, lang || smartReminderSettings.language);
    setTestFeedback(result.message);
    setTimeout(() => setTestFeedback(null), 3500);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'status_update':
        return <Calendar className="w-4 h-4 text-[#0057B8]" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-[#D97706]" />;
      case 'clinic_info':
        return <Info className="w-4 h-4 text-[#0D9488]" />;
      default:
        return <Bell className="w-4 h-4 text-[#0057B8]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A2540]/60 dark:bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-[#0F233A] w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[88vh] flex flex-col overflow-hidden border border-[#D6E4F5] dark:border-[#1E3A5F] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-[#0A2540] dark:bg-[#081525] text-white flex items-center justify-between shrink-0 border-b border-[#1E3A5F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
              <BellRing className="w-4 h-4 text-[#70B4F5]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Notifications & Reminders</h3>
              <p className="text-[11px] text-[#93C5FD] dark:text-[#60A5FA]">M-Care Balibago Real-Time Stream</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] text-[#93C5FD] dark:text-[#60A5FA] hover:text-white font-bold cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Smart Reminders Configuration Card */}
        <div className="p-3.5 bg-[#F8FAFD] dark:bg-[#081525] border-b border-[#E2ECF8] dark:border-[#1E3A5F] shrink-0 space-y-3">
          {/* Main Toggle Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-[#0A2540] dark:text-white">Smart 24h Reminders</span>
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                    smartReminderSettings.enabled
                      ? 'bg-[#E1EFFF] dark:bg-[#10243E] text-[#0057B8] dark:text-[#60A5FA]'
                      : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]'
                  }`}
                >
                  {smartReminderSettings.enabled ? 'Active' : 'Off'}
                </span>
              </div>
              <p className="text-[11px] text-[#475E7B] dark:text-[#94A3B8] leading-tight">
                Dispatches localized browser alerts 24h prior to visit.
              </p>
            </div>

            {/* Custom Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={smartReminderSettings.enabled}
              onClick={handleToggleSmartReminders}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                smartReminderSettings.enabled ? 'bg-[#0057B8] dark:bg-[#2563EB]' : 'bg-[#CBD5E1] dark:bg-[#334155]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  smartReminderSettings.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sub-Controls when Enabled */}
          {smartReminderSettings.enabled && (
            <div className="pt-2 border-t border-[#E2ECF8] dark:border-[#1E3A5F] space-y-2.5 animate-in fade-in duration-150 text-xs">
              {/* Language Selector */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#475E7B] dark:text-[#94A3B8] flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
                  <span>Language</span>
                </span>
                <div className="flex items-center gap-1 bg-white dark:bg-[#0F233A] p-0.5 rounded-lg border border-[#D6E4F5] dark:border-[#1E3A5F]">
                  {(
                    [
                      { id: 'en', label: 'EN' },
                      { id: 'fil', label: 'Filipino' },
                      { id: 'pam', label: 'Kapampangan' },
                    ] as const
                  ).map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => updateSmartReminderSettings({ language: lang.id })}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                        smartReminderSettings.language === lang.id
                          ? 'bg-[#0057B8] dark:bg-[#2563EB] text-white shadow-2xs'
                          : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browser Permission Status */}
              <div className="flex items-center justify-between bg-white dark:bg-[#0F233A] p-2 rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F]">
                <div className="flex items-center gap-1.5 text-[11px]">
                  {browserPermission === 'granted' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#34D399]" />
                      <span className="font-bold text-[#0D9488] dark:text-[#34D399]">Browser Push Active</span>
                    </>
                  ) : browserPermission === 'denied' ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-[#DC2626] dark:text-[#F87171]" />
                      <span className="text-[#DC2626] dark:text-[#F87171] font-medium">Browser Blocked (In-App Only)</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FBBF24]" />
                      <span className="text-[#475E7B] dark:text-[#94A3B8]">Permission needed for background alerts</span>
                    </>
                  )}
                </div>

                {browserPermission === 'default' && (
                  <button
                    onClick={handleRequestPermission}
                    className="px-2 py-1 bg-[#E1EFFF] dark:bg-[#10243E] hover:bg-[#D6E4F5] dark:hover:bg-[#1E3A5F] text-[#0057B8] dark:text-[#60A5FA] font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                  >
                    Allow Push
                  </button>
                )}
              </div>

              {/* Instant Test Action */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTriggerTestReminder()}
                  className="flex-1 py-1.5 px-2.5 bg-[#E1EFFF] dark:bg-[#10243E] hover:bg-[#D6E4F5] dark:hover:bg-[#1E3A5F] text-[#0057B8] dark:text-[#60A5FA] font-bold text-[11px] rounded-xl border border-[#B9DBFE] dark:border-[#1E3A5F] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
                  <span>Send 24h Localized Push Now</span>
                </button>
              </div>

              {testFeedback && (
                <div className="p-2 bg-[#F0FDF4] dark:bg-[#064E3B]/40 border border-[#BBF7D0] dark:border-[#059669] rounded-xl text-[11px] text-[#15803D] dark:text-[#34D399] font-medium animate-in fade-in duration-150">
                  {testFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 bg-[#F4F8FD] dark:bg-[#061524]">
          {notifications.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Bell className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <p className="text-xs text-[#475E7B] dark:text-[#94A3B8]">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notif, idx) => (
              <div
                key={`${notif.id || 'notif'}-${idx}`}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.appointmentId && onNavigateToAppointment) {
                    onNavigateToAppointment(notif.appointmentId);
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  notif.isRead
                    ? 'bg-white dark:bg-[#0F233A] border-[#E2ECF8] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white'
                    : 'bg-[#E1EFFF] dark:bg-[#10243E] border-[#B9DBFE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-white dark:bg-[#081525] border border-[#D6E4F5] dark:border-[#1E3A5F] shadow-2xs">
                      {getNotifIcon(notif.type)}
                    </div>
                    <h4 className="text-xs font-bold text-[#0A2540] dark:text-white">{notif.title}</h4>
                  </div>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] shrink-0 font-mono">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#475E7B] dark:text-[#94A3B8] leading-relaxed pl-7">
                  {notif.message}
                </p>

                {notif.appointmentCode && (
                  <div className="pl-7 pt-0.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#0057B8] dark:text-[#60A5FA] bg-white dark:bg-[#081525] px-2 py-0.5 rounded-md border border-[#D6E4F5] dark:border-[#1E3A5F]">
                      Ref: {notif.appointmentCode}
                    </span>
                    {onNavigateToAppointment && notif.appointmentId && (
                      <span className="text-[10px] font-bold text-[#0057B8] dark:text-[#60A5FA] hover:underline">
                        View Visit Details →
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Simulator Footer */}
        <div className="p-3 bg-white dark:bg-[#081525] border-t border-[#E2ECF8] dark:border-[#1E3A5F] text-xs space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8] tracking-wider">
              Quick Trigger Simulator
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleTriggerTestReminder('fil')}
              className="flex-1 py-1.5 px-2 bg-[#F4F8FD] dark:bg-[#0F233A] hover:bg-[#E1EFFF] dark:hover:bg-[#1E3A5F] text-[#0057B8] dark:text-[#60A5FA] text-[11px] font-bold rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] transition-colors cursor-pointer"
            >
              Test Tagalog 24h
            </button>
            <button
              onClick={() => handleTriggerTestReminder('pam')}
              className="flex-1 py-1.5 px-2 bg-[#F4F8FD] dark:bg-[#0F233A] hover:bg-[#E1EFFF] dark:hover:bg-[#1E3A5F] text-[#0057B8] dark:text-[#60A5FA] text-[11px] font-bold rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] transition-colors cursor-pointer"
            >
              Test Kapampangan 24h
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
