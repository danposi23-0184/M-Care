import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Activity,
  Stethoscope,
  Sparkles,
  Info,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { AppointmentType, UltrasoundScanType } from '../../types';

interface BookAppointmentModalProps {
  onClose: () => void;
  onSuccess: (appointmentCode: string) => void;
}

const AVAILABLE_TIME_SLOTS = [
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
];

const ULTRASOUND_OPTIONS: { type: UltrasoundScanType; label: string; desc: string; fee: number }[] = [
  {
    type: 'Pelvic Ultrasound',
    label: 'Pelvic Ultrasound (Transabdominal)',
    desc: 'Uterus, ovaries and bladder non-invasive scan (requires full bladder)',
    fee: 950,
  },
  {
    type: 'Transvaginal Ultrasound (TVS)',
    label: 'Transvaginal Ultrasound (TVS)',
    desc: 'High-resolution scan for early pregnancy & reproductive organs (empty bladder)',
    fee: 1200,
  },
  {
    type: 'Biophysical Profile (BPS)',
    label: 'Biophysical Profile (BPS)',
    desc: 'Third trimester fetal wellness, breathing, amniotic fluid evaluation',
    fee: 1400,
  },
  {
    type: 'Congenital Anomaly Scan (CAS)',
    label: 'Congenital Anomaly Scan (CAS / Level II)',
    desc: 'Targeted organ and structural anomaly screening (18–24 weeks)',
    fee: 2200,
  },
  {
    type: '3D/4D Baby Scan',
    label: '3D / 4D HD Live Baby Ultrasound',
    desc: 'Volumetric real-time rendering and facial visualization with photo print',
    fee: 2500,
  },
  {
    type: 'Follicular Monitoring',
    label: 'Follicle Tracking Series',
    desc: 'Serial measurement of ovarian follicles for fertility/ovulation planning',
    fee: 1000,
  },
];

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const {
    patient,
    clinicSettings,
    bookAppointment,
    isSlotAvailable,
    getOccupiedSlotsForDate,
  } = useClinic();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('Check-Up');
  const [scanType, setScanType] = useState<UltrasoundScanType>('Pelvic Ultrasound');

  // Date picker logic (default to tomorrow or nearest weekday)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookedApptCode, setBookedApptCode] = useState<string | null>(null);

  const occupiedSlots = getOccupiedSlotsForDate(selectedDate);

  // Generate next 14 valid clinic dates (skip Sunday)
  const availableDatesList: { dateStr: string; dayName: string; formatted: string; isSunday: boolean }[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const day = d.getDay(); // 0 is Sunday
    const isSunday = day === 0;
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    availableDatesList.push({ dateStr, dayName, formatted, isSunday });
  }

  const handleNextStep1 = () => {
    setErrorMessage(null);
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!selectedSlot) {
      setErrorMessage('Please select an available time slot.');
      return;
    }
    if (!isSlotAvailable(selectedDate, selectedSlot)) {
      setErrorMessage('Selected slot is occupied. Please pick another time slot.');
      return;
    }
    setErrorMessage(null);
    setStep(3);
  };

  const handleSubmitBooking = () => {
    setErrorMessage(null);
    const result = bookAppointment({
      date: selectedDate,
      timeSlot: selectedSlot,
      appointmentType,
      scanType: appointmentType === 'Ultrasound' ? scanType : undefined,
      reason: reason.trim() || (appointmentType === 'Ultrasound' ? `Ultrasound - ${scanType}` : 'General OB-GYNE Checkup'),
    });

    if (result.success && result.appointment) {
      setBookedApptCode(result.appointment.appointmentCode);
      setStep(4);
      onSuccess(result.appointment.appointmentCode);
    } else {
      setErrorMessage(result.message);
    }
  };

  const selectedFee =
    appointmentType === 'Check-Up'
      ? 600
      : ULTRASOUND_OPTIONS.find((s) => s.type === scanType)?.fee || 1400;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A2540]/70 dark:bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F233A] w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border border-[#D6E4F5] dark:border-[#1E3A5F]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0057B8] to-[#003366] p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <Calendar className="w-4 h-4 text-[#BAE6FD]" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">Book Appointment</h3>
              <p className="text-[11px] text-[#BAE6FD]">Step {step} of 4 • Self-Service Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-4 bg-[#F4F8FD] dark:bg-[#081525] border-b border-[#E2ECF8] dark:border-[#1E3A5F] text-center py-2.5 px-3 text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] shrink-0">
          <div className={`flex items-center justify-center gap-1 ${step >= 1 ? 'text-[#0057B8] dark:text-[#60A5FA] font-bold' : 'opacity-50'}`}>
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${step >= 1 ? 'bg-[#0057B8] text-white' : 'bg-[#CBD5E1] dark:bg-[#1E3A5F]'}`}>1</span>
            <span>Service</span>
          </div>
          <div className={`flex items-center justify-center gap-1 ${step >= 2 ? 'text-[#0057B8] dark:text-[#60A5FA] font-bold' : 'opacity-50'}`}>
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${step >= 2 ? 'bg-[#0057B8] text-white' : 'bg-[#CBD5E1] dark:bg-[#1E3A5F]'}`}>2</span>
            <span>Date & Slot</span>
          </div>
          <div className={`flex items-center justify-center gap-1 ${step >= 3 ? 'text-[#0057B8] dark:text-[#60A5FA] font-bold' : 'opacity-50'}`}>
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${step >= 3 ? 'bg-[#0057B8] text-white' : 'bg-[#CBD5E1] dark:bg-[#1E3A5F]'}`}>3</span>
            <span>Details</span>
          </div>
          <div className={`flex items-center justify-center gap-1 ${step === 4 ? 'text-[#0D9488] dark:text-[#34D399] font-bold' : 'opacity-50'}`}>
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${step === 4 ? 'bg-[#0D9488] text-white' : 'bg-[#CBD5E1] dark:bg-[#1E3A5F]'}`}>4</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 bg-[#F4F8FD] dark:bg-[#061524]">
          {errorMessage && (
            <div className="p-3 bg-[#FEF2F2] dark:bg-[#2B0E11] border border-[#FECACA] dark:border-[#7F1D1D] rounded-2xl text-xs text-[#DC2626] dark:text-[#F87171] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#DC2626] dark:text-[#F87171] shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Select Type & Ultrasound Procedure */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0A2540] dark:text-slate-200 uppercase tracking-wide block mb-2">
                  Select Appointment Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAppointmentType('Check-Up')}
                    className={`p-4 rounded-3xl border text-left transition-all relative cursor-pointer ${
                      appointmentType === 'Check-Up'
                        ? 'border-[#0057B8] dark:border-[#38BDF8] bg-white dark:bg-[#0F233A] ring-2 ring-[#0057B8]/30 shadow-xs'
                        : 'border-[#D6E4F5] dark:border-[#1E3A5F] hover:border-[#0057B8]/50 bg-white dark:bg-[#0F233A]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-[#0057B8] text-white flex items-center justify-center mb-2 shadow-xs">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-sm text-[#0A2540] dark:text-white">Check-Up</div>
                    <div className="text-[11px] text-[#475E7B] dark:text-[#94A3B8] mt-0.5 leading-tight">Prenatal, Consultation, Pap Smear</div>
                    <div className="text-xs font-bold text-[#0057B8] dark:text-[#60A5FA] mt-2">₱600.00</div>
                    {appointmentType === 'Check-Up' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#0057B8] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppointmentType('Ultrasound')}
                    className={`p-4 rounded-3xl border text-left transition-all relative cursor-pointer ${
                      appointmentType === 'Ultrasound'
                        ? 'border-[#0057B8] dark:border-[#38BDF8] bg-white dark:bg-[#0F233A] ring-2 ring-[#0057B8]/30 shadow-xs'
                        : 'border-[#D6E4F5] dark:border-[#1E3A5F] hover:border-[#0057B8]/50 bg-white dark:bg-[#0F233A]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#4EA1F3] to-[#0057B8] text-white flex items-center justify-center mb-2 shadow-xs">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-sm text-[#0A2540] dark:text-white">Ultrasound</div>
                    <div className="text-[11px] text-[#475E7B] dark:text-[#94A3B8] mt-0.5 leading-tight">2D, TVS, BPS, CAS & 4D Baby Scans</div>
                    <div className="text-xs font-bold text-[#0057B8] dark:text-[#60A5FA] mt-2">From ₱950.00</div>
                    {appointmentType === 'Ultrasound' && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#0057B8] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {appointmentType === 'Ultrasound' && (
                <div className="space-y-2 pt-2 border-t border-[#E2ECF8] dark:border-[#1A365D]">
                  <label className="text-xs font-bold text-[#0A2540] dark:text-slate-200 uppercase tracking-wide block">
                    Choose Ultrasound Scan Type
                  </label>
                  <div className="space-y-2">
                    {ULTRASOUND_OPTIONS.map((opt) => (
                      <label
                        key={opt.type}
                        onClick={() => setScanType(opt.type)}
                        className={`flex items-start justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          scanType === opt.type
                            ? 'bg-white dark:bg-[#0F233A] border-[#0057B8] dark:border-[#38BDF8] ring-2 ring-[#0057B8]/30 shadow-xs'
                            : 'bg-white dark:bg-[#0F233A] border-[#D6E4F5] dark:border-[#1E3A5F] hover:bg-[#F8FAFD] dark:hover:bg-[#152E4D]'
                        }`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="font-bold text-xs text-[#0A2540] dark:text-white">{opt.label}</div>
                          <div className="text-[11px] text-[#475E7B] dark:text-[#94A3B8] leading-tight">{opt.desc}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-xs text-[#0057B8] dark:text-[#60A5FA]">
                            ₱{opt.fee.toLocaleString()}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-[#0F233A] p-3 rounded-2xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-xs text-[#0A2540] dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA] shrink-0" />
                <span>Attending Specialist: <strong>{clinicSettings.doctorName}</strong></span>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Available Slot Picker */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0A2540] dark:text-slate-200 uppercase tracking-wide block mb-2">
                  Select Clinic Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {availableDatesList.map((item) => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        disabled={item.isSunday}
                        onClick={() => {
                          setSelectedDate(item.dateStr);
                          setSelectedSlot('');
                        }}
                        className={`flex flex-col items-center justify-center p-2.5 min-w-[70px] rounded-2xl border transition-all cursor-pointer ${
                          item.isSunday
                            ? 'bg-[#F1F5F9] dark:bg-[#081525] border-[#E2E8F0] dark:border-[#1E3A5F] opacity-40 cursor-not-allowed text-[#94A3B8]'
                            : isSelected
                            ? 'bg-[#0057B8] border-[#0057B8] text-white shadow-xs font-bold'
                            : 'bg-white dark:bg-[#0F233A] border-[#D6E4F5] dark:border-[#1E3A5F] hover:border-[#0057B8] text-[#0A2540] dark:text-white'
                        }`}
                      >
                        <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-[#BAE6FD]' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>
                          {item.dayName}
                        </span>
                        <span className="text-xs mt-0.5">{item.formatted}</span>
                        {item.isSunday && <span className="text-[8px] text-[#DC2626] font-bold mt-0.5">Closed</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#0A2540] dark:text-slate-200 uppercase tracking-wide">
                    Available Time Slots ({selectedDate})
                  </label>
                  <span className="text-[10px] text-[#475E7B] dark:text-[#94A3B8] font-semibold">
                    30-min consultation windows
                  </span>
                </div>

                {/* Double-booking visual indication */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isOccupied = occupiedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isOccupied
                            ? 'bg-[#F1F5F9] dark:bg-[#081525] border-[#E2E8F0] dark:border-[#1E3A5F] text-[#94A3B8] cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-[#0057B8] border-[#0057B8] text-white shadow-xs'
                            : 'bg-white dark:bg-[#0F233A] border-[#D6E4F5] dark:border-[#1E3A5F] hover:border-[#0057B8] text-[#0A2540] dark:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#0057B8] dark:text-[#60A5FA]'}`} />
                          <span>{slot}</span>
                        </div>
                        {isOccupied ? (
                          <span className="text-[9px] font-normal text-[#DC2626] bg-[#FEF2F2] dark:bg-[#2B0E11] px-1 rounded">Booked</span>
                        ) : isSelected ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 text-[11px] text-[#475E7B] dark:text-[#94A3B8] flex items-center gap-1.5 bg-white dark:bg-[#0F233A] p-2.5 rounded-2xl border border-[#D6E4F5] dark:border-[#1E3A5F]">
                  <Info className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA] shrink-0" />
                  <span>Slots reflect real-time clinic capacity (Algorithm 2 double-booking prevention).</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Details & Confirmation Review */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-[#0F233A] rounded-3xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] space-y-2 shadow-xs">
                <div className="text-xs font-bold text-[#0A2540] dark:text-white uppercase">Booking Summary</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#475E7B] dark:text-[#94A3B8] block text-[11px]">Patient:</span>
                    <span className="font-bold text-[#0A2540] dark:text-white">{patient?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#475E7B] dark:text-[#94A3B8] block text-[11px]">Patient ID:</span>
                    <span className="font-mono font-bold text-[#0057B8] dark:text-[#60A5FA]">{patient?.patientCode}</span>
                  </div>
                  <div>
                    <span className="text-[#475E7B] dark:text-[#94A3B8] block text-[11px]">Service:</span>
                    <span className="font-bold text-[#0A2540] dark:text-white">
                      {appointmentType === 'Ultrasound' ? scanType : 'OB-GYNE Check-Up'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#475E7B] dark:text-[#94A3B8] block text-[11px]">Date & Time:</span>
                    <span className="font-bold text-[#0A2540] dark:text-white">{selectedDate} @ {selectedSlot}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-[#E2ECF8] dark:border-[#1A365D] flex items-center justify-between">
                    <span className="text-[#475E7B] dark:text-[#94A3B8] font-medium">Estimated Fee (Pay at Clinic):</span>
                    <span className="text-sm font-black text-[#0057B8] dark:text-[#60A5FA]">₱{selectedFee.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0A2540] dark:text-slate-200 uppercase tracking-wide block mb-1">
                  Reason for Visit / Specific Symptoms (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Routine 24th week prenatal check, pelvic discomfort, follow-up on iron levels..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-2xl border border-[#D6E4F5] dark:border-[#1E3A5F] focus:outline-none focus:ring-2 focus:ring-[#0057B8] text-[#0A2540] dark:text-white bg-white dark:bg-[#0F233A]"
                />
              </div>

              <div className="p-3 bg-[#FEF7EB] dark:bg-[#2B1D0E] rounded-2xl border border-[#FDE68A] dark:border-[#78350F] text-[11px] text-[#D97706] dark:text-[#FBBF24] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FBBF24]" />
                  <span>Important Clinic Notice</span>
                </div>
                <p>
                  Upon submission, your appointment request will be in <strong>Pending</strong> status.
                  You will receive a notification once the clinic receptionist approves your slot.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#E6F7F5] dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#34D399] rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-50 duration-300 border border-[#99F6E4] dark:border-[#0D9488]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#0A2540] dark:text-white">Booking Request Sent!</h3>
                <p className="text-xs text-[#475E7B] dark:text-[#94A3B8] max-w-xs mx-auto">
                  Your appointment has been registered and is now pending review by M-Care Clinic staff.
                </p>
              </div>

              <div className="bg-white dark:bg-[#0F233A] p-4 rounded-3xl border border-[#D6E4F5] dark:border-[#1E3A5F] max-w-xs mx-auto space-y-2 text-xs text-left shadow-xs">
                <div className="flex justify-between">
                  <span className="text-[#475E7B] dark:text-[#94A3B8]">Booking Reference:</span>
                  <span className="font-mono font-bold text-[#0057B8] dark:text-[#60A5FA]">{bookedApptCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#475E7B] dark:text-[#94A3B8]">Date:</span>
                  <span className="font-bold text-[#0A2540] dark:text-white">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#475E7B] dark:text-[#94A3B8]">Time Window:</span>
                  <span className="font-bold text-[#0A2540] dark:text-white">{selectedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#475E7B] dark:text-[#94A3B8]">Initial Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FEF7EB] dark:bg-[#D97706]/20 text-[#D97706] dark:text-[#FBBF24] font-bold text-[10px] border border-[#FDE68A] dark:border-[#78350F]">
                    Pending Approval
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#475E7B] dark:text-[#94A3B8]">
                Tip: You can cancel or check real-time status under the <strong>Visits</strong> tab.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white dark:bg-[#0F233A] border-t border-[#E2ECF8] dark:border-[#1A365D] flex items-center justify-between shrink-0">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-[#64748B] dark:text-[#94A3B8] text-xs font-bold hover:bg-[#F4F8FD] dark:hover:bg-[#152E4D] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextStep1}
                className="py-2.5 px-6 rounded-2xl bg-[#0057B8] hover:bg-[#0047A0] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl text-[#64748B] dark:text-[#94A3B8] text-xs font-bold hover:bg-[#F4F8FD] dark:hover:bg-[#152E4D] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="py-2.5 px-6 rounded-2xl bg-[#0057B8] hover:bg-[#0047A0] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Review Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl text-[#64748B] dark:text-[#94A3B8] text-xs font-bold hover:bg-[#F4F8FD] dark:hover:bg-[#152E4D] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmitBooking}
                className="py-2.5 px-6 rounded-2xl bg-[#0057B8] hover:bg-[#0047A0] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm Booking Request</span>
              </button>
            </>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#0057B8] hover:bg-[#0047A0] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              Done & Return to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
