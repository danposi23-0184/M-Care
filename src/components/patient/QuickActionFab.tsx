import React, { useState } from 'react';
import {
  PhoneCall,
  AlertTriangle,
  Phone,
  MessageSquare,
  ShieldAlert,
  Clock,
  MapPin,
  X,
  Copy,
  Check,
  ChevronRight,
  HeartPulse,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const QuickActionFab: React.FC = () => {
  const { clinicSettings, patient } = useClinic();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const emergencyNumber = clinicSettings.emergencyHotline || '0918 901 4422';
  const landlineNumber = clinicSettings.phone || '(045) 887-2940';
  const mobileNumber = clinicSettings.mobile || '0917 582 9310';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const emergencySmsBody = encodeURIComponent(
    `Hello M-Care Clinic. URGENT / EMERGENCY consultation request for patient ${
      patient?.fullName || 'Patient'
    } (ID: ${patient?.patientCode || 'MC-NEW'}). Contact: ${
      patient?.contactNumber || ''
    }. Please advise immediately.`
  );

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="sticky bottom-3 z-30 flex justify-end px-4 pointer-events-none">
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto group relative flex items-center gap-2.5 bg-gradient-to-r from-[#DC2626] to-[#0057B8] text-white px-4 py-3 rounded-full shadow-xl shadow-[#0057B8]/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
          aria-label="Emergency and clinic call quick actions"
          id="quick-action-fab"
        >
          {/* Subtle pulse indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#DC2626] border-2 border-white"></span>
          </span>

          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <PhoneCall className="w-3.5 h-3.5 text-white animate-bounce" />
          </div>

          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-wider block text-[#FEF2F2] leading-none">
              Quick Action
            </span>
            <span className="text-xs font-black tracking-tight leading-tight">
              Call / Emergency
            </span>
          </div>
        </button>
      </div>

      {/* Emergency & Quick Action Sheet / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[#D6E4F5] animate-in slide-in-from-bottom duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-action-modal-title"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#0A2540] via-[#003366] to-[#0057B8] text-white flex items-center justify-between shrink-0 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#DC2626]/20 border border-[#DC2626]/40 flex items-center justify-center text-[#FCA5A5] shrink-0">
                  <HeartPulse className="w-5 h-5 text-[#FECACA]" />
                </div>
                <div>
                  <h3
                    id="quick-action-modal-title"
                    className="font-black text-base text-white leading-tight"
                  >
                    Immediate Clinic & Emergency Hotline
                  </h3>
                  <p className="text-[11px] text-[#BAE6FD]">
                    {clinicSettings.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close emergency actions modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-4 overflow-y-auto space-y-3.5 flex-1 bg-[#F4F8FD] text-xs">
              {/* Critical Alert Notice */}
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-3.5 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-[#991B1B] text-xs">
                    Maternal or Gynecological Urgent Warning
                  </h4>
                  <p className="text-[11px] text-[#B91C1C] leading-relaxed">
                    If you are experiencing severe bleeding, unbearable abdominal cramping, sudden loss of fluid, or loss of fetal movement, contact emergency hotline or proceed directly to AUF Medical Center Emergency ER.
                  </p>
                </div>
              </div>

              {/* Action 1: 24/7 Emergency Line */}
              <div className="bg-white rounded-2xl p-4 border border-[#FECACA] shadow-xs space-y-2.5 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center font-bold">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded-full border border-[#FECACA]">
                        24/7 On-Call
                      </span>
                      <h4 className="font-bold text-sm text-[#0A2540] mt-0.5">
                        OB-GYNE Emergency Hotline
                      </h4>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(emergencyNumber, 'emergency')}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0057B8] hover:bg-[#F4F8FD] transition-colors cursor-pointer"
                    title="Copy number"
                  >
                    {copiedKey === 'emergency' ? (
                      <Check className="w-3.5 h-3.5 text-[#0D9488]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-[#475E7B]">
                  Direct priority line to {clinicSettings.doctorName} and on-duty clinical staff.
                </p>

                <div className="pt-1 flex items-center gap-2">
                  <a
                    href={`tel:${emergencyNumber.replace(/\D/g, '')}`}
                    className="flex-1 py-2.5 px-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-black text-xs text-center flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Emergency Line ({emergencyNumber})</span>
                  </a>
                </div>
              </div>

              {/* Action 2: Regular Reception Desk Call */}
              <div className="bg-white rounded-2xl p-4 border border-[#D6E4F5] shadow-xs space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#E1EFFF] text-[#0057B8] flex items-center justify-center font-bold">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0057B8] bg-[#E1EFFF] px-2 py-0.5 rounded-full border border-[#B9DBFE]">
                        Reception Desk
                      </span>
                      <h4 className="font-bold text-sm text-[#0A2540] mt-0.5">
                        Clinic Landline & Mobile Desk
                      </h4>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(landlineNumber, 'landline')}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0057B8] hover:bg-[#F4F8FD] transition-colors cursor-pointer"
                    title="Copy number"
                  >
                    {copiedKey === 'landline' ? (
                      <Check className="w-3.5 h-3.5 text-[#0D9488]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-[#475E7B] space-y-1">
                  <p>
                    <strong>Landline:</strong> {landlineNumber} • <strong>Mobile:</strong> {mobileNumber}
                  </p>
                  <p className="flex items-center gap-1 text-[#64748B]">
                    <Clock className="w-3 h-3 text-[#0057B8]" />
                    <span>Mon–Sat: {clinicSettings.operatingHours.start} – {clinicSettings.operatingHours.end}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${landlineNumber.replace(/\D/g, '')}`}
                    className="py-2.5 px-2 bg-[#0057B8] hover:bg-[#0047A0] text-white rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Landline</span>
                  </a>
                  <a
                    href={`tel:${mobileNumber.replace(/\D/g, '')}`}
                    className="py-2.5 px-2 bg-[#E1EFFF] hover:bg-[#D6E4F5] text-[#0057B8] rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 border border-[#B9DBFE] transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Mobile</span>
                  </a>
                </div>
              </div>

              {/* Action 3: Fast SMS Dispatch */}
              <div className="bg-white rounded-2xl p-4 border border-[#D6E4F5] shadow-xs space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E6F7F5] text-[#0D9488] flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0A2540]">
                      Send Pre-Formatted SMS
                    </h4>
                    <p className="text-[11px] text-[#475E7B]">
                      Includes your Patient ID ({patient?.patientCode || 'MC-NEW'}) for rapid lookup.
                    </p>
                  </div>
                </div>

                <a
                  href={`sms:${mobileNumber.replace(/\D/g, '')}?body=${emergencySmsBody}`}
                  className="w-full py-2.5 px-3 bg-[#F8FAFD] hover:bg-[#E1EFFF] text-[#0A2540] border border-[#D6E4F5] rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>Send Immediate SMS to Clinic</span>
                </a>
              </div>

              {/* Physical Location Summary */}
              <div className="p-3 bg-[#F8FAFD] rounded-2xl border border-[#E2ECF8] text-[11px] text-[#475E7B] flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#0A2540]">Clinic Location: </span>
                  <span>{clinicSettings.address}, {clinicSettings.barangay}, {clinicSettings.city} ({clinicSettings.landmark})</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-white border-t border-[#E2ECF8] shrink-0 flex items-center justify-between">
              <span className="text-[10px] text-[#64748B]">
                M-Care Healthcare Emergency Triage
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="py-1.5 px-4 bg-[#F4F8FD] hover:bg-[#E1EFFF] text-[#0A2540] font-bold text-xs rounded-xl border border-[#D6E4F5] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
