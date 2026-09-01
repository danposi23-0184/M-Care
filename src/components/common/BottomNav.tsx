import React from 'react';
import { Home, Calendar, PlusCircle, MapPin, User } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface TabItem {
  id: 'home' | 'appointments' | 'book' | 'clinic' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isPrimary?: boolean;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, appointments } = useClinic();

  const activeCount = appointments.filter(
    (a) => a.status === 'Pending' || a.status === 'Approved'
  ).length;

  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'appointments', label: 'Visits', icon: Calendar, badge: activeCount > 0 ? activeCount : undefined },
    { id: 'book', label: 'Book Slot', icon: PlusCircle, isPrimary: true },
    { id: 'clinic', label: 'Clinic Info', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="shrink-0 w-full z-30 bg-white/95 dark:bg-[#081525]/95 backdrop-blur-md border-t border-[#E2ECF8] dark:border-[#1A365D] px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] mt-auto transition-colors duration-200">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center group -mt-5 focus:outline-none cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#0057B8] flex items-center justify-center text-white shadow-md shadow-[#0057B8]/30 group-hover:scale-105 group-active:scale-95 transition-all border-2 border-white dark:border-[#081525]">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-[#0057B8] dark:text-[#60A5FA] mt-1">
                  Book Slot
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#0057B8] dark:text-[#60A5FA] font-bold'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-[#0057B8] dark:bg-[#2563EB] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-semibold">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0057B8] dark:bg-[#60A5FA] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
