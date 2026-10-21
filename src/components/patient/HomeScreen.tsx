import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Stethoscope,
  Activity,
  PhoneCall,
  Info,
  CalendarCheck,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { QuickActionFab } from './QuickActionFab';
import { WeeklyHealthTip } from './WeeklyHealthTip';

interface HomeScreenProps {
  onOpenBooking: () => void;
  onOpenAppointments: () => void;
  onOpenClinicInfo: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenBooking,
  onOpenAppointments,
  onOpenClinicInfo,
}) => {
  const { patient, appointments, clinicSettings, setActiveTab, medicalRecords } = useClinic();
  const [showPrepTips, setShowPrepTips] = useState(false);

  const patientRecords = (medicalRecords || []).filter(
    (r) => r.patientCode === patient?.patientCode || r.patientId === patient?.id
  );

  // Find next upcoming active appointment
  const upcomingAppointments = appointments
    .filter((a) => a.status === 'Approved' || a.status === 'Pending')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="p-4 space-y-4 pb-20 bg-[#F4F8FD] dark:bg-[#061524] transition-colors duration-200">
      {/* Patient Greeting & Status Header */}
      <div
        id="patient-greeting-header"
        className="pt-1 pb-3 px-1 border-b border-[#E2ECF8] dark:border-[#1A365D] flex items-start justify-between gap-3"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0057B8] dark:text-[#60A5FA] tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0057B8] dark:bg-[#60A5FA]"></span>
            <span>Balibago Clinic Portal</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#0A2540] dark:text-white leading-none">
            Hello, {patient?.fullName ? patient.fullName.split(' ')[0] : 'Patient'}
          </h2>
          <p className="text-xs text-[#475E7B] dark:text-[#94A3B8]">
            Your self-service OB-GYNE and prenatal companion.
          </p>
        </div>

        <div className="shrink-0 bg-white dark:bg-[#0F233A] px-3 py-2 rounded-2xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-right shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#94A3B8] tracking-wider block leading-tight">
            Patient ID
          </span>
          <span className="text-xs font-mono font-extrabold text-[#0057B8] dark:text-[#60A5FA] tracking-wide">
            {patient?.patientCode || 'MC-NEW'}
          </span>
        </div>
      </div>


      {/* Next Appointment Card or Book Callout */}
      {nextAppointment ? (
        <div className="bg-white dark:bg-[#0F233A] rounded-2xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A2540] dark:text-white flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA]" />
              Upcoming Visit
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                nextAppointment.status === 'Approved'
                  ? 'bg-[#E6F7F5] dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#34D399] border border-[#99F6E4] dark:border-[#0D9488]/40'
                  : 'bg-[#FEF7EB] dark:bg-[#D97706]/20 text-[#D97706] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-[#D97706]/40'
              }`}
            >
              {nextAppointment.status}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <h3 className="text-sm font-bold text-[#0A2540] dark:text-white">
                {nextAppointment.appointmentType === 'Ultrasound'
                  ? nextAppointment.scanType || 'Ultrasound Examination'
                  : 'OB-GYNE Consultation'}
              </h3>
              <p className="text-xs text-[#475E7B] dark:text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
                <span>
                  {new Date(nextAppointment.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
                <span>{nextAppointment.timeSlot}</span>
              </p>
            </div>

            <button
              onClick={onOpenAppointments}
              className="px-3 py-1.5 bg-[#E1EFFF] dark:bg-[#10243E] hover:bg-[#D6E4F5] dark:hover:bg-[#1A365D] text-[#0057B8] dark:text-[#93C5FD] text-xs font-bold rounded-xl transition-colors cursor-pointer border border-[#B9DBFE] dark:border-[#1E3A5F]"
            >
              Details
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0F233A] rounded-2xl p-3.5 border border-[#E2ECF8] dark:border-[#1E3A5F] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#0A2540] dark:text-white block">No upcoming visits</span>
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Book your prenatal check-up or ultrasound</span>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-3.5 py-1.5 bg-[#0057B8] hover:bg-[#0047A0] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            Book Now
          </button>
        </div>
      )}

      {/* Quick Medical Records Access */}
      <button
        onClick={() => setActiveTab('records')}
        className="w-full p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#0F233A] dark:to-[#162B48] border border-blue-200 dark:border-blue-900/60 rounded-2xl flex items-center justify-between text-left hover:border-blue-400 transition shadow-2xs group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0057B8] text-white flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-[#0A2540] dark:text-white flex items-center gap-1.5">
              <span>My Ultrasound & Medical Records</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                {patientRecords.length} Files
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Official sonograms & prescriptions by Dr. Bernice D. Paule
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition shrink-0" />
      </button>

      {/* Quick Booking Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onOpenBooking}
          className="p-3.5 bg-white dark:bg-[#0F233A] hover:bg-[#F8FAFD] dark:hover:bg-[#142944] border border-[#E2ECF8] dark:border-[#1E3A5F] hover:border-[#B9DBFE] dark:hover:border-[#38BDF8] rounded-2xl text-left transition-all group shadow-2xs cursor-pointer flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0057B8] text-white flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-[#0A2540] dark:text-white">Consultation</div>
            <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Prenatal & OB-GYNE</div>
          </div>
        </button>

        <button
          onClick={onOpenBooking}
          className="p-3.5 bg-white dark:bg-[#0F233A] hover:bg-[#F8FAFD] dark:hover:bg-[#142944] border border-[#E2ECF8] dark:border-[#1E3A5F] hover:border-[#B9DBFE] dark:hover:border-[#38BDF8] rounded-2xl text-left transition-all group shadow-2xs cursor-pointer flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0057B8] text-white flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-[#0A2540] dark:text-white">Ultrasound</div>
            <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">TVS, CAS & 3D/4D</div>
          </div>
        </button>
      </div>

      {/* Weekly Pregnancy & Health Tip (Streamlined) */}
      <WeeklyHealthTip onOpenBooking={onOpenBooking} />

      {/* Collapsible Preparation Guidelines */}
      <div className="bg-white dark:bg-[#0F233A] rounded-2xl border border-[#E2ECF8] dark:border-[#1E3A5F] overflow-hidden shadow-2xs">
        <button
          onClick={() => setShowPrepTips(!showPrepTips)}
          className="w-full p-3 flex items-center justify-between text-xs font-bold text-[#0A2540] dark:text-white hover:bg-[#F8FAFD] dark:hover:bg-[#142944] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA]" />
            <span>Ultrasound Scan Preparation Guidelines</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#64748B] dark:text-[#94A3B8] transition-transform duration-200 ${
              showPrepTips ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showPrepTips && (
          <div className="px-3.5 pb-3 text-xs text-[#475E7B] dark:text-[#CBD5E1] space-y-2 border-t border-[#F1F5F9] dark:border-[#1A365D] pt-2.5 animate-in fade-in duration-150">
            <div>
              <strong className="text-[#0A2540] dark:text-white">Pelvic Ultrasound:</strong> Drink 4–6 glasses of water 1 hour before and hold urine.
            </div>
            <div>
              <strong className="text-[#0A2540] dark:text-white">Transvaginal (TVS):</strong> Empty your bladder right before entering the room.
            </div>
          </div>
        )}
      </div>

      {/* Clinic Summary Footer */}
      <div className="p-3.5 bg-white dark:bg-[#0F233A] rounded-2xl border border-[#E2ECF8] dark:border-[#1E3A5F] shadow-2xs flex items-center justify-between text-xs">
        <div className="space-y-0.5">
          <div className="font-bold text-[#0A2540] dark:text-white">{clinicSettings.doctorName}</div>
          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Mon–Sat • {clinicSettings.operatingHours.start} – {clinicSettings.operatingHours.end}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${clinicSettings.phone.replace(/\D/g, '')}`}
            className="p-2 bg-[#F4F8FD] dark:bg-[#10243E] hover:bg-[#E1EFFF] dark:hover:bg-[#1A365D] text-[#0057B8] dark:text-[#60A5FA] rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] transition-colors"
            title="Call Clinic"
            aria-label="Call clinic"
          >
            <PhoneCall className="w-4 h-4" />
          </a>
          <button
            onClick={onOpenClinicInfo}
            className="p-2 bg-[#0057B8] hover:bg-[#0047A0] text-white rounded-xl transition-colors cursor-pointer"
            title="View Map & Directions"
            aria-label="View map"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Emergency & Quick Action Contact Button */}
      <QuickActionFab />
    </div>
  );
};
