import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Heart,
  QrCode,
  ShieldCheck,
  Edit2,
  Check,
  LogOut,
  Calendar,
  AlertCircle,
  FileCheck,
  Save,
  RotateCcw,
  Sun,
  Moon,
  Sparkles,
  Palette,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface ProfileScreenProps {
  onOpenAuth: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenAuth }) => {
  const { patient, isLoggedIn, logout, updateProfile, resetDatabase, theme, setTheme, toggleTheme } = useClinic();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: patient?.fullName || '',
    contactNumber: patient?.contactNumber || '',
    email: patient?.email || '',
    address: patient?.address || '',
    emergencyContactName: patient?.emergencyContactName || '',
    emergencyContactPhone: patient?.emergencyContactPhone || '',
    birthday: patient?.birthday || '',
    civilStatus: patient?.civilStatus || 'Married',
    philhealthNumber: patient?.philhealthNumber || '',
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  if (!isLoggedIn || !patient) {
    return (
      <div className="p-6 text-center space-y-5 pb-20 bg-[#F4F8FD] dark:bg-[#061524] min-h-[500px] flex flex-col justify-center items-center transition-colors duration-200">
        <div className="w-16 h-16 rounded-full bg-[#E1EFFF] dark:bg-[#10243E] text-[#0057B8] dark:text-[#60A5FA] flex items-center justify-center mx-auto border border-[#B9DBFE] dark:border-[#1E3A5F]">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#0A2540] dark:text-white">Guest Mode</h3>
          <p className="text-xs text-[#475E7B] dark:text-[#94A3B8] max-w-xs mx-auto">
            Sign in or register to connect with your M-Care patient profile and manage appointment bookings.
          </p>
        </div>

        {/* Appearance toggle in Guest Mode */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#0F233A] p-1.5 rounded-2xl border border-[#D6E4F5] dark:border-[#1E3A5F]">
          <button
            onClick={() => setTheme('light')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-[#0057B8] text-white shadow-xs'
                : 'text-[#475E7B] dark:text-[#94A3B8] hover:text-[#0A2540]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#0057B8] text-white shadow-xs'
                : 'text-[#475E7B] dark:text-[#94A3B8] hover:text-[#0A2540]'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>

        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-[#0057B8] hover:bg-[#0047A0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20 bg-[#F4F8FD] dark:bg-[#061524] transition-colors duration-200">
      {/* Patient Identification Card */}
      <div className="bg-gradient-to-br from-[#0A2540] via-[#003366] to-[#0057B8] dark:from-[#081525] dark:via-[#0D243F] dark:to-[#0047A0] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden border border-[#D6E4F5]/30 dark:border-[#1E3A5F]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border-2 border-white/30 overflow-hidden flex items-center justify-center text-lg font-black text-white backdrop-blur-xs">
              {patient.avatarUrl ? (
                <img src={patient.avatarUrl} alt="Patient Avatar" className="w-full h-full object-cover" />
              ) : (
                patient.fullName.charAt(0)
              )}
            </div>
            <div>
              <h3 className="text-base font-black leading-tight text-white">{patient.fullName}</h3>
              <p className="text-xs text-[#BAE6FD] font-mono mt-0.5 font-bold">ID: {patient.patientCode}</p>
            </div>
          </div>

          <div className="p-2 bg-white dark:bg-[#0A2540] rounded-2xl shadow-sm border border-white/20 dark:border-[#1E3A5F]">
            {/* Stylized QR representation */}
            <div className="w-10 h-10 bg-[#0A2540] dark:bg-[#061524] p-1 rounded-xl grid grid-cols-3 gap-0.5">
              <div className="bg-white rounded-xs"></div>
              <div className="bg-[#0057B8] rounded-xs"></div>
              <div className="bg-white rounded-xs"></div>
              <div className="bg-white rounded-xs"></div>
              <div className="bg-white rounded-xs"></div>
              <div className="bg-[#0A2540] dark:bg-[#1E3A5F] rounded-xs"></div>
              <div className="bg-white rounded-xs"></div>
              <div className="bg-[#0A2540] dark:bg-[#1E3A5F] rounded-xs"></div>
              <div className="bg-[#0057B8] rounded-xs"></div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-[#BAE6FD] block uppercase font-bold">Registry Match</span>
            <span className="text-white font-bold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
              {patient.isExistingRecordMatched ? 'Linked (Phase 1 DB)' : 'New App Account'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#BAE6FD] block uppercase font-bold">Registered Since</span>
            <span className="text-white font-medium mt-0.5 block">{patient.registeredDate}</span>
          </div>
        </div>
      </div>

      {/* App Appearance & Theme Selection Card */}
      <div className="bg-white dark:bg-[#0F233A] rounded-3xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] shadow-xs space-y-3 transition-colors duration-200">
        <div className="flex items-center justify-between border-b border-[#E2ECF8] dark:border-[#1A365D] pb-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] dark:text-white">
              App Appearance & Theme
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#475E7B] dark:text-[#94A3B8]">
            {theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Light Mode Option */}
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-2xl border transition-all text-left flex flex-col gap-2 cursor-pointer relative ${
              theme === 'light'
                ? 'bg-[#E1EFFF] border-[#0057B8] shadow-xs'
                : 'bg-[#F4F8FD] dark:bg-[#081525] border-[#D6E4F5] dark:border-[#1E3A5F] hover:border-[#94A3B8]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#10243E] text-[#0057B8] flex items-center justify-center shadow-2xs border border-[#B9DBFE] dark:border-[#1E3A5F]">
                <Sun className="w-4 h-4 text-[#0057B8]" />
              </div>
              {theme === 'light' && (
                <span className="w-5 h-5 rounded-full bg-[#0057B8] text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-[#0A2540] dark:text-white block">Light Mode</span>
              <span className="text-[10px] text-[#475E7B] dark:text-[#94A3B8]">Clean crisp contrast</span>
            </div>
          </button>

          {/* Dark Mode Option */}
          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-2xl border transition-all text-left flex flex-col gap-2 cursor-pointer relative ${
              theme === 'dark'
                ? 'bg-[#0057B8]/20 dark:bg-[#10294C] border-[#0057B8] dark:border-[#38BDF8] shadow-xs'
                : 'bg-[#F4F8FD] dark:bg-[#081525] border-[#D6E4F5] dark:border-[#1E3A5F] hover:border-[#94A3B8]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-[#06182B] text-[#FBBF24] flex items-center justify-center shadow-2xs border border-[#1E3A5F]">
                <Moon className="w-4 h-4 text-[#FBBF24]" />
              </div>
              {theme === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-[#38BDF8] text-[#0A2540] flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-[#0A2540] dark:text-white block">Dark Mode</span>
              <span className="text-[10px] text-[#475E7B] dark:text-[#94A3B8]">Eye-safe night palette</span>
            </div>
          </button>
        </div>
      </div>

      {/* Profile Details & Contact Form */}
      <div className="bg-white dark:bg-[#0F233A] rounded-3xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] shadow-xs space-y-4 transition-colors duration-200">
        <div className="flex items-center justify-between border-b border-[#E2ECF8] dark:border-[#1A365D] pb-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] dark:text-white">
              Personal & Contact Information
            </h3>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-[#0057B8] dark:text-[#60A5FA] hover:text-[#0047A0] dark:hover:text-[#93C5FD] flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0047A0] flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-[#0A2540] dark:text-slate-200 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white bg-[#F4F8FD] dark:bg-[#081525] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-[#0A2540] dark:text-slate-200 block mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white bg-[#F4F8FD] dark:bg-[#081525] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#0A2540] dark:text-slate-200 block mb-1">Civil Status</label>
                <select
                  value={formData.civilStatus}
                  onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white bg-[#F4F8FD] dark:bg-[#081525] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#0A2540] dark:text-slate-200 block mb-1">Residential Address (Angeles City)</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white bg-[#F4F8FD] dark:bg-[#081525] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2ECF8] dark:border-[#1A365D]">
              <div>
                <label className="text-[11px] font-bold text-[#0A2540] dark:text-slate-200 block mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white bg-[#F4F8FD] dark:bg-[#081525] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#0A2540] dark:text-slate-200 block mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white bg-[#F4F8FD] dark:bg-[#081525] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#0A2540] dark:text-slate-200 block mb-1">PhilHealth Number</label>
              <input
                type="text"
                value={formData.philhealthNumber}
                onChange={(e) => setFormData({ ...formData, philhealthNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white bg-[#F4F8FD] dark:bg-[#081525] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                placeholder="12-XXXXXXXXX-X"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 text-xs text-[#0A2540] dark:text-[#F1F5F9]">
            <div className="flex justify-between py-1 border-b border-[#E2ECF8] dark:border-[#1A365D]">
              <span className="text-[#475E7B] dark:text-[#94A3B8]">Mobile Number:</span>
              <span className="font-bold text-[#0A2540] dark:text-white">{patient.contactNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2ECF8] dark:border-[#1A365D]">
              <span className="text-[#475E7B] dark:text-[#94A3B8]">Email Address:</span>
              <span className="font-bold text-[#0A2540] dark:text-white">{patient.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2ECF8] dark:border-[#1A365D]">
              <span className="text-[#475E7B] dark:text-[#94A3B8]">Home Address:</span>
              <span className="font-bold text-[#0A2540] dark:text-white text-right max-w-[200px] truncate">{patient.address}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2ECF8] dark:border-[#1A365D]">
              <span className="text-[#475E7B] dark:text-[#94A3B8]">Civil Status / DOB:</span>
              <span className="font-bold text-[#0A2540] dark:text-white">{patient.civilStatus} • {patient.birthday}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2ECF8] dark:border-[#1A365D]">
              <span className="text-[#475E7B] dark:text-[#94A3B8]">Emergency Contact:</span>
              <span className="font-bold text-[#0A2540] dark:text-white">{patient.emergencyContactName} ({patient.emergencyContactPhone})</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#475E7B] dark:text-[#94A3B8]">PhilHealth ID:</span>
              <span className="font-mono font-bold text-[#0057B8] dark:text-[#60A5FA]">{patient.philhealthNumber || 'N/A'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Data Privacy & Scope Policy Notice */}
      <div className="bg-white dark:bg-[#0F233A] rounded-2xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] text-[11px] text-[#475E7B] dark:text-[#94A3B8] space-y-1 shadow-xs transition-colors duration-200">
        <div className="font-bold text-[#0A2540] dark:text-white flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA]" />
          <span>M-Care Privacy Notice (RA 10173 Compliant)</span>
        </div>
        <p className="leading-relaxed">
          Your personal data is encrypted and synced with M-Care OB-GYNE Clinic's secure SQLite/Prisma backend. Full medical diagnoses and prescriptions remain restricted to attending physicians only.
        </p>
      </div>

      {/* Session Management / Demo Tools */}
      <div className="space-y-2 pt-2">
        <button
          onClick={logout}
          className="w-full py-3 bg-white dark:bg-[#0F233A] hover:bg-[#F4F8FD] dark:hover:bg-[#152E4D] text-[#0A2540] dark:text-white text-xs font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 border border-[#D6E4F5] dark:border-[#1E3A5F] cursor-pointer shadow-xs"
        >
          <LogOut className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA]" />
          <span>Sign Out Patient Account</span>
        </button>

        <button
          onClick={resetDatabase}
          className="w-full py-2.5 bg-[#E1EFFF] dark:bg-[#10243E] hover:bg-[#D6E4F5] dark:hover:bg-[#1A365D] text-[#0057B8] dark:text-[#93C5FD] text-[11px] font-bold rounded-2xl transition-colors flex items-center justify-center gap-1.5 border border-[#B9DBFE] dark:border-[#1E3A5F] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Database Records</span>
        </button>
      </div>
    </div>
  );
};

