import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ChevronRight,
  Receipt,
  Heart,
  Stethoscope,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment } from '../../types';

interface AppointmentsScreenProps {
  onOpenBooking: () => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ onOpenBooking }) => {
  const { appointments, cancelAppointment, clinicSettings } = useClinic();
  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancellationReason, setCancellationReason] = useState<string>('Change of personal schedule');

  const upcomingList = appointments.filter(
    (a) => a.status === 'Pending' || a.status === 'Approved'
  );
  const completedList = appointments.filter((a) => a.status === 'Completed');
  const cancelledList = appointments.filter(
    (a) => a.status === 'Cancelled' || a.status === 'Rejected'
  );

  const handleConfirmCancel = () => {
    if (!selectedAppt) return;
    cancelAppointment(selectedAppt.id, cancellationReason);
    setShowCancelModal(false);
    setSelectedAppt((prev) => (prev ? { ...prev, status: 'Cancelled', cancellationReason } : null));
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F7F5] text-[#0D9488] border border-[#99F6E4]">
            <CheckCircle2 className="w-3 h-3 text-[#0D9488]" />
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF7EB] text-[#D97706] border border-[#FDE68A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-ping"></span>
            Pending
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E1EFFF] text-[#0057B8] border border-[#B9DBFE]">
            <CheckCircle2 className="w-3 h-3 text-[#0057B8]" />
            Completed
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            <XCircle className="w-3 h-3 text-[#DC2626]" />
            Rejected
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
            <XCircle className="w-3 h-3 text-[#64748B]" />
            Cancelled
          </span>
        );
    }
  };

  const displayedList =
    activeSubTab === 'upcoming'
      ? upcomingList
      : activeSubTab === 'completed'
      ? completedList
      : cancelledList;

  return (
    <div className="p-4 space-y-4 pb-20 bg-[#F4F8FD] dark:bg-[#061524] transition-colors duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#0A2540] dark:text-white">My Appointments</h2>
          <p className="text-xs text-[#475E7B] dark:text-[#94A3B8]">Track and review your clinic consultations & sonograms</p>
        </div>
        <button
          onClick={onOpenBooking}
          className="px-3.5 py-1.5 bg-[#0057B8] hover:bg-[#0047A0] active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
        >
          <span>+ New Slot</span>
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="grid grid-cols-3 bg-[#E1EFFF] dark:bg-[#10243E] p-1 rounded-2xl text-xs font-semibold border border-[#D6E4F5] dark:border-[#1E3A5F]">
        <button
          onClick={() => setActiveSubTab('upcoming')}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'upcoming'
              ? 'bg-white dark:bg-[#0057B8] text-[#0057B8] dark:text-white shadow-xs font-bold'
              : 'text-[#475E7B] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white'
          }`}
        >
          Upcoming ({upcomingList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('completed')}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'completed'
              ? 'bg-white dark:bg-[#0057B8] text-[#0057B8] dark:text-white shadow-xs font-bold'
              : 'text-[#475E7B] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white'
          }`}
        >
          Completed ({completedList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('cancelled')}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'cancelled'
              ? 'bg-white dark:bg-[#0057B8] text-[#0057B8] dark:text-white shadow-xs font-bold'
              : 'text-[#475E7B] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white'
          }`}
        >
          History ({cancelledList.length})
        </button>
      </div>

      {/* Appointment Cards List */}
      {displayedList.length === 0 ? (
        <div className="bg-white dark:bg-[#0F233A] rounded-3xl p-8 border border-[#D6E4F5] dark:border-[#1E3A5F] text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#F4F8FD] dark:bg-[#10243E] text-[#0057B8] dark:text-[#60A5FA] flex items-center justify-center mx-auto border border-[#D6E4F5] dark:border-[#1E3A5F]">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#0A2540] dark:text-white">No {activeSubTab} appointments</h4>
            <p className="text-xs text-[#475E7B] dark:text-[#94A3B8] max-w-xs mx-auto">
              {activeSubTab === 'upcoming'
                ? 'You do not have any pending or confirmed bookings at this time.'
                : 'No past records found in this category.'}
            </p>
          </div>
          {activeSubTab === 'upcoming' && (
            <button
              onClick={onOpenBooking}
              className="mt-2 px-5 py-2.5 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0047A0] transition-colors shadow-xs cursor-pointer"
            >
              Book an Appointment
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedList.map((appt) => (
            <div
              key={appt.id}
              onClick={() => setSelectedAppt(appt)}
              className="bg-white dark:bg-[#0F233A] rounded-3xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] shadow-xs hover:border-[#0057B8] dark:hover:border-[#38BDF8] transition-all cursor-pointer space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#0057B8] dark:text-[#60A5FA]">
                  {appt.appointmentCode}
                </span>
                {getStatusBadge(appt.status)}
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0A2540] dark:text-white group-hover:text-[#0057B8] dark:group-hover:text-[#60A5FA] transition-colors">
                  {appt.appointmentType === 'Ultrasound'
                    ? appt.scanType || 'Ultrasound Examination'
                    : 'OB-GYNE Check-Up'}
                </h3>
                <p className="text-xs text-[#475E7B] dark:text-[#94A3B8] line-clamp-1 mt-0.5">{appt.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E2ECF8] dark:border-[#1A365D]">
                <div className="flex items-center gap-1.5 text-[#0057B8] dark:text-[#60A5FA]">
                  <Calendar className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
                  <span className="font-bold text-[#0A2540] dark:text-slate-200">
                    {new Date(appt.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#0057B8] dark:text-[#60A5FA]">
                  <Clock className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
                  <span className="font-bold text-[#0A2540] dark:text-slate-200">{appt.timeSlot}</span>
                </div>
              </div>

              {/* Payment preview pill */}
              <div className="flex items-center justify-between text-[11px] bg-[#F8FAFD] dark:bg-[#081525] p-2.5 rounded-2xl border border-[#E2ECF8] dark:border-[#1E3A5F]">
                <div className="flex items-center gap-1 text-[#0057B8] dark:text-[#60A5FA] font-medium">
                  <Receipt className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
                  <span>Fee: ₱{appt.payment.amount.toLocaleString()}</span>
                </div>
                <span
                  className={`font-bold px-2 py-0.5 rounded-lg text-[10px] ${
                    appt.payment.status === 'Paid'
                      ? 'bg-[#E6F7F5] dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#34D399]'
                      : 'bg-[#FEF7EB] dark:bg-[#D97706]/20 text-[#D97706] dark:text-[#FBBF24]'
                  }`}
                >
                  Payment: {appt.payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Detail & Limited Visit Summary Bottom Sheet Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 bg-[#0A2540]/70 dark:bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-[#0F233A] w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border border-[#D6E4F5] dark:border-[#1E3A5F]">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-[#0057B8] to-[#003366] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#BAE6FD] font-bold block">
                  {selectedAppt.appointmentCode}
                </span>
                <h3 className="font-black text-base text-white">Appointment Details</h3>
              </div>
              <button
                onClick={() => setSelectedAppt(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 bg-[#F4F8FD] dark:bg-[#061524]">
              <div className="flex items-center justify-between bg-white dark:bg-[#0F233A] p-3.5 rounded-2xl border border-[#D6E4F5] dark:border-[#1E3A5F]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#475E7B] dark:text-[#94A3B8] block">Current Status</span>
                  <div className="mt-1">{getStatusBadge(selectedAppt.status)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#475E7B] dark:text-[#94A3B8] block">Category</span>
                  <span className="text-xs font-bold text-[#0A2540] dark:text-white mt-1 block">
                    {selectedAppt.appointmentType}
                  </span>
                </div>
              </div>

              {/* Date, Doctor, Reason */}
              <div className="bg-white dark:bg-[#0F233A] rounded-2xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#475E7B] dark:text-[#94A3B8] block text-[10px] uppercase font-bold">Scheduled Date</span>
                    <span className="font-bold text-[#0A2540] dark:text-white">{selectedAppt.date}</span>
                  </div>
                  <div>
                    <span className="text-[#475E7B] dark:text-[#94A3B8] block text-[10px] uppercase font-bold">Time Window</span>
                    <span className="font-bold text-[#0A2540] dark:text-white">{selectedAppt.timeSlot}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2ECF8] dark:border-[#1A365D]">
                  <span className="text-[#475E7B] dark:text-[#94A3B8] block text-[10px] uppercase font-bold">Attending Specialist</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA] shrink-0" />
                    <span className="font-bold text-[#0A2540] dark:text-white">{selectedAppt.attendingDoctor}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2ECF8] dark:border-[#1A365D]">
                  <span className="text-[#475E7B] dark:text-[#94A3B8] block text-[10px] uppercase font-bold">Patient's Reason / Note</span>
                  <p className="text-[#0A2540] dark:text-slate-200 mt-0.5 leading-relaxed font-medium">{selectedAppt.reason}</p>
                </div>

                {selectedAppt.rejectionReason && (
                  <div className="p-3 bg-[#FEF2F2] dark:bg-[#2B0E11] rounded-xl border border-[#FECACA] dark:border-[#7F1D1D] text-[#DC2626] dark:text-[#F87171]">
                    <div className="font-bold text-xs">Clinic Rejection Reason:</div>
                    <p className="text-[11px] mt-0.5">{selectedAppt.rejectionReason}</p>
                  </div>
                )}

                {selectedAppt.cancellationReason && (
                  <div className="p-3 bg-[#F1F5F9] dark:bg-[#10243E] rounded-xl border border-[#E2E8F0] dark:border-[#1E3A5F] text-[#64748B] dark:text-[#94A3B8]">
                    <div className="font-bold text-xs">Cancellation Reason:</div>
                    <p className="text-[11px] mt-0.5">{selectedAppt.cancellationReason}</p>
                  </div>
                )}
              </div>

              {/* LIMITED VISIT SUMMARY (For Completed Visits) */}
              {selectedAppt.status === 'Completed' && (
                <div className="bg-[#EBF5FF] dark:bg-[#0D243F] rounded-2xl p-4 border border-[#B9DBFE] dark:border-[#1E3A5F] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#B9DBFE] dark:border-[#1E3A5F] pb-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA]" />
                      <h4 className="text-xs font-bold text-[#0A2540] dark:text-white uppercase">
                        High-Level Visit Summary
                      </h4>
                    </div>
                    <span className="text-[10px] bg-[#0057B8] text-white font-bold px-2 py-0.5 rounded-full">
                      Patient-Safe View
                    </span>
                  </div>

                  {selectedAppt.visitSummary ? (
                    <div className="space-y-2.5 text-xs text-[#0A2540] dark:text-slate-200">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#0057B8] dark:text-[#60A5FA] block">
                          Key Clinical Observation (Summary)
                        </span>
                        <p className="mt-0.5 bg-white dark:bg-[#0F233A] p-3 rounded-xl border border-[#B9DBFE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white leading-relaxed">
                          {selectedAppt.visitSummary.highLevelObservations}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#0057B8] dark:text-[#60A5FA] block">
                          Physician Recommendations & Advice
                        </span>
                        <p className="mt-0.5 bg-white dark:bg-[#0F233A] p-3 rounded-xl border border-[#B9DBFE] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white leading-relaxed">
                          {selectedAppt.visitSummary.followUpAdvice}
                        </p>
                      </div>

                      {selectedAppt.visitSummary.vitalSignsSnapshot && (
                        <div className="bg-white dark:bg-[#0F233A] p-3 rounded-xl border border-[#B9DBFE] dark:border-[#1E3A5F]">
                          <span className="text-[10px] font-bold uppercase text-[#0057B8] dark:text-[#60A5FA] block mb-1.5">
                            Vital Signs & Fetal Metrics Snapshot
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#0A2540] dark:text-slate-200">
                            {selectedAppt.visitSummary.vitalSignsSnapshot.bloodPressure && (
                              <div>
                                <span className="text-[#475E7B] dark:text-[#94A3B8]">Blood Pressure:</span>{' '}
                                <strong className="text-[#0A2540] dark:text-white">
                                  {selectedAppt.visitSummary.vitalSignsSnapshot.bloodPressure}
                                </strong>
                              </div>
                            )}
                            {selectedAppt.visitSummary.vitalSignsSnapshot.weightKg && (
                              <div>
                                <span className="text-[#475E7B] dark:text-[#94A3B8]">Weight:</span>{' '}
                                <strong className="text-[#0A2540] dark:text-white">
                                  {selectedAppt.visitSummary.vitalSignsSnapshot.weightKg} kg
                                </strong>
                              </div>
                            )}
                            {selectedAppt.visitSummary.vitalSignsSnapshot.fetalHeartRateBpm && (
                              <div>
                                <span className="text-[#475E7B] dark:text-[#94A3B8]">Fetal Heart Tone:</span>{' '}
                                <strong className="text-[#DC2626] dark:text-[#F87171]">
                                  {selectedAppt.visitSummary.vitalSignsSnapshot.fetalHeartRateBpm} bpm
                                </strong>
                              </div>
                            )}
                            {selectedAppt.visitSummary.vitalSignsSnapshot.gestationalAgeWeeks && (
                              <div>
                                <span className="text-[#475E7B] dark:text-[#94A3B8]">Gestational Age:</span>{' '}
                                <strong className="text-[#0057B8] dark:text-[#60A5FA]">
                                  {selectedAppt.visitSummary.vitalSignsSnapshot.gestationalAgeWeeks} Weeks
                                </strong>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedAppt.visitSummary.recommendedNextVisit && (
                        <div className="flex items-center justify-between bg-white dark:bg-[#0F233A] p-3 rounded-xl border border-[#B9DBFE] dark:border-[#1E3A5F]">
                          <span className="text-[#0057B8] dark:text-[#60A5FA] font-bold text-[11px]">
                            Recommended Follow-Up Date:
                          </span>
                          <span className="font-bold text-xs text-[#0A2540] dark:text-white">
                            {selectedAppt.visitSummary.recommendedNextVisit}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[#475E7B] dark:text-[#94A3B8]">
                      Visit completed. The doctor has closed this encounter. Detailed clinical prescriptions remain archived securely in the clinic staff records.
                    </p>
                  )}

                  <div className="text-[10px] text-[#0057B8] dark:text-[#60A5FA] flex items-center gap-1 pt-1 font-medium">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Full diagnostic sonology plates and formal medical certificates can be claimed at the clinic desk.</span>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="bg-white dark:bg-[#0F233A] rounded-2xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] space-y-2">
                <div className="flex items-center justify-between border-b border-[#E2ECF8] dark:border-[#1A365D] pb-2">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA]" />
                    <span className="text-xs font-bold text-[#0A2540] dark:text-white uppercase">Payment Summary (Read-Only)</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#475E7B] dark:text-[#94A3B8] font-bold">
                    {selectedAppt.payment.invoiceNumber}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#0A2540] dark:text-slate-200">
                  {selectedAppt.payment.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-[#475E7B] dark:text-[#94A3B8]">{item.description}</span>
                      <span className="font-bold">₱{item.price.toLocaleString()}.00</span>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-[#E2ECF8] dark:border-[#1A365D] flex justify-between font-bold text-[#0A2540] dark:text-white">
                    <span>Total Amount:</span>
                    <span className="text-[#0057B8] dark:text-[#60A5FA]">₱{selectedAppt.payment.amount.toLocaleString()}.00</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-[#475E7B] dark:text-[#94A3B8]">Outstanding Balance:</span>
                    <span className={`font-bold ${selectedAppt.payment.balance > 0 ? 'text-[#D97706] dark:text-[#FBBF24]' : 'text-[#0D9488] dark:text-[#34D399]'}`}>
                      ₱{selectedAppt.payment.balance.toLocaleString()}.00 ({selectedAppt.payment.status})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-white dark:bg-[#0F233A] border-t border-[#E2ECF8] dark:border-[#1A365D] flex items-center justify-between gap-3">
              {(selectedAppt.status === 'Pending' || selectedAppt.status === 'Approved') ? (
                <>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="py-2.5 px-4 bg-[#FEF2F2] dark:bg-[#2B0E11] hover:bg-[#FEE2E2] dark:hover:bg-[#3D1418] text-[#DC2626] dark:text-[#F87171] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-[#FECACA] dark:border-[#7F1D1D] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel Booking</span>
                  </button>
                  <button
                    onClick={() => setSelectedAppt(null)}
                    className="py-2.5 px-6 bg-[#0057B8] hover:bg-[#0047A0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    Close
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedAppt(null)}
                  className="w-full py-2.5 bg-[#0057B8] hover:bg-[#0047A0] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Back to Visits
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelModal && selectedAppt && (
        <div className="fixed inset-0 z-60 bg-[#0A2540]/70 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F233A] rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 border border-[#D6E4F5] dark:border-[#1E3A5F]">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] dark:bg-[#2B0E11] text-[#DC2626] dark:text-[#F87171] flex items-center justify-center mx-auto border border-[#FECACA] dark:border-[#7F1D1D]">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#0A2540] dark:text-white">Cancel Appointment?</h3>
              <p className="text-xs text-[#475E7B] dark:text-[#94A3B8]">
                Are you sure you want to cancel booking <strong>{selectedAppt.appointmentCode}</strong>? This will release the slot back to the clinic.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0A2540] dark:text-slate-200 block mb-1">
                Reason for cancellation:
              </label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-[#0A2540] dark:text-white bg-[#F4F8FD] dark:bg-[#081525] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              >
                <option value="Change of personal schedule">Change of personal schedule</option>
                <option value="Health improved / no longer needed">Health improved / no longer needed</option>
                <option value="Transportation / distance constraint">Transportation / distance constraint</option>
                <option value="Financial or family emergency">Financial or family emergency</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] text-[#475E7B] dark:text-[#94A3B8] text-xs font-bold hover:bg-[#F4F8FD] dark:hover:bg-[#152E4D] cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
