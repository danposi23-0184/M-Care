import React, { useState } from 'react';
import {
  Stethoscope,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  FileText,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Receipt,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, VisitSummary } from '../../types';

export const StaffSyncSimulator: React.FC = () => {
  const {
    appointments,
    clinicSettings,
    staffApproveAppointment,
    staffRejectAppointment,
    staffRescheduleAppointment,
    staffCompleteAppointment,
    setViewMode,
  } = useClinic();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('Doctor on emergency delivery duty at AUF Medical Center');
  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);

  // Visit summary draft state for doctor
  const [summaryDraft, setSummaryDraft] = useState<VisitSummary>({
    attendingDoctor: clinicSettings.doctorName + ', ' + clinicSettings.doctorCredentials,
    date: new Date().toISOString().split('T')[0],
    appointmentType: 'General OB-GYNE / Sonogram',
    highLevelObservations: 'Normal intrauterine pregnancy findings. Regular cardiac tone detected at 148 bpm. Normal amniotic index.',
    followUpAdvice: 'Prescribed prenatal DHA + Iron sulfate. Advised repeat ultrasound in 4 weeks.',
    recommendedNextVisit: '2026-10-06',
    vitalSignsSnapshot: {
      bloodPressure: '118/76 mmHg',
      weightKg: 59.2,
      fetalHeartRateBpm: 148,
      gestationalAgeWeeks: 28,
    },
  });

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus === 'All') return true;
    return a.status === filterStatus;
  });

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;

  const handleApprove = (id: string) => {
    staffApproveAppointment(id);
    if (selectedAppt?.id === id) {
      setSelectedAppt((prev) => (prev ? { ...prev, status: 'Approved' } : null));
    }
  };

  const handleReject = () => {
    if (!selectedAppt) return;
    staffRejectAppointment(selectedAppt.id, rejectReason);
    setShowRejectModal(false);
    setSelectedAppt((prev) => (prev ? { ...prev, status: 'Rejected', rejectionReason: rejectReason } : null));
  };

  const handleCompleteEncounter = () => {
    if (!selectedAppt) return;
    staffCompleteAppointment(selectedAppt.id, {
      ...summaryDraft,
      appointmentType: selectedAppt.appointmentType === 'Ultrasound' ? selectedAppt.scanType || 'Ultrasound' : 'OB-GYNE Check-Up',
      date: selectedAppt.date,
    });
    setShowCompleteModal(false);
    setSelectedAppt((prev) => (prev ? { ...prev, status: 'Completed', visitSummary: summaryDraft } : null));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Staff Admin Top Banner */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#003366] to-[#0057B8] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#D6E4F5]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[#BAE6FD] text-xs font-mono font-bold border border-white/20">
              Phase 1 Web System Companion
            </span>
            <span className="text-xs text-[#BAE6FD]">Next.js 16 + SQLite + Prisma Live Simulator</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            M-Care Staff Desk: Appointment & Reception Desk
          </h2>
          <p className="text-xs text-[#E1EFFF] max-w-2xl">
            Simulates the clinic receptionist and doctor web workstation. Any action taken here immediately pushes updates, approval notifications, and visit summaries to the patient's mobile app.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('mobile-app')}
            className="px-5 py-2.5 bg-white hover:bg-[#F4F8FD] text-[#0057B8] rounded-2xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Return to Patient Mobile View</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-[#D6E4F5] shadow-xs">
          <span className="text-xs text-[#475E7B] font-semibold">Pending Approvals</span>
          <div className="text-2xl font-black text-[#D97706] mt-1 flex items-center gap-2">
            <span>{pendingCount}</span>
            {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-[#D97706] animate-ping"></span>}
          </div>
          <span className="text-[11px] text-[#64748B] mt-1 block">Awaiting receptionist review</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#D6E4F5] shadow-xs">
          <span className="text-xs text-[#475E7B] font-semibold">Approved Bookings</span>
          <div className="text-2xl font-black text-[#0D9488] mt-1">
            {appointments.filter((a) => a.status === 'Approved').length}
          </div>
          <span className="text-[11px] text-[#64748B] mt-1 block">Locked in clinic schedule</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#D6E4F5] shadow-xs">
          <span className="text-xs text-[#475E7B] font-semibold">Completed Encounters</span>
          <div className="text-2xl font-black text-[#0057B8] mt-1">
            {appointments.filter((a) => a.status === 'Completed').length}
          </div>
          <span className="text-[11px] text-[#64748B] mt-1 block">Summaries archived</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#D6E4F5] shadow-xs">
          <span className="text-xs text-[#475E7B] font-semibold">Cancelled / Rejected</span>
          <div className="text-2xl font-black text-[#64748B] mt-1">
            {appointments.filter((a) => a.status === 'Cancelled' || a.status === 'Rejected').length}
          </div>
          <span className="text-[11px] text-[#64748B] mt-1 block">Slots released back</span>
        </div>
      </div>

      {/* Table & Controls */}
      <div className="bg-white rounded-3xl border border-[#D6E4F5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2ECF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFD]">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[#0057B8]" />
            <span className="text-xs font-bold text-[#0A2540] uppercase">Filter Status:</span>
            <div className="flex gap-1 flex-wrap">
              {['All', 'Pending', 'Approved', 'Completed', 'Rejected', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === st
                      ? 'bg-[#0057B8] text-white shadow-xs'
                      : 'bg-white border border-[#D6E4F5] text-[#475E7B] hover:bg-[#E1EFFF]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-[#475E7B]">
            Showing <strong>{filteredAppointments.length}</strong> records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F8FD] text-[#0A2540] border-b border-[#E2ECF8] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Patient Name & Code</th>
                <th className="p-3.5">Category & Service</th>
                <th className="p-3.5">Date & Slot</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5 text-right">Staff Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2ECF8] text-[#0A2540]">
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-[#F4F8FD] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#0057B8]">{appt.appointmentCode}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-[#0A2540]">{appt.patientName}</div>
                    <div className="text-[11px] font-mono text-[#64748B]">{appt.patientCode} • {appt.contactNumber}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-[#0A2540]">
                      {appt.appointmentType === 'Ultrasound' ? appt.scanType || 'Ultrasound' : 'OB-GYNE Consult'}
                    </div>
                    <div className="text-[10px] text-[#64748B] line-clamp-1">{appt.reason}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-[#0A2540]">{appt.date}</div>
                    <div className="text-[11px] text-[#475E7B] font-medium">{appt.timeSlot}</div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        appt.status === 'Approved'
                          ? 'bg-[#E6F7F5] text-[#0D9488] border border-[#99F6E4]'
                          : appt.status === 'Pending'
                          ? 'bg-[#FEF7EB] text-[#D97706] border border-[#FDE68A]'
                          : appt.status === 'Completed'
                          ? 'bg-[#E1EFFF] text-[#0057B8] border border-[#B9DBFE]'
                          : appt.status === 'Rejected'
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                          : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-[#0A2540]">₱{appt.payment.amount.toLocaleString()}</div>
                    <span className="text-[10px] text-[#64748B]">{appt.payment.status}</span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                    {appt.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(appt.id)}
                          className="px-3 py-1.5 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppt(appt);
                            setShowRejectModal(true);
                          }}
                          className="px-3 py-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] rounded-xl text-xs font-bold transition-colors cursor-pointer border border-[#FECACA]"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {appt.status === 'Approved' && (
                      <button
                        onClick={() => {
                          setSelectedAppt(appt);
                          setShowCompleteModal(true);
                        }}
                        className="px-3 py-1.5 bg-[#0057B8] hover:bg-[#0047A0] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 inline-flex cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Complete Visit & Summary</span>
                      </button>
                    )}

                    {appt.status === 'Completed' && (
                      <span className="text-[11px] text-[#0057B8] font-bold bg-[#E1EFFF] px-2.5 py-1 rounded-xl border border-[#B9DBFE]">
                        Summary Synced ✓
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedAppt && (
        <div className="fixed inset-0 z-60 bg-[#0A2540]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl border border-[#D6E4F5]">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto border border-[#FECACA]">
              <XCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#0A2540]">Reject Appointment Request</h3>
              <p className="text-xs text-[#475E7B]">
                Rejecting booking <strong>{selectedAppt.appointmentCode}</strong> for patient {selectedAppt.patientName}.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0A2540] block mb-1">
                Reason for Rejection (Patient will see this in app notification):
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-2xl border border-[#D6E4F5] text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="py-2.5 rounded-xl border border-[#D6E4F5] text-[#475E7B] text-xs font-bold hover:bg-[#F4F8FD] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Visit & Doctor Summary Modal */}
      {showCompleteModal && selectedAppt && (
        <div className="fixed inset-0 z-60 bg-[#0A2540]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto border border-[#D6E4F5]">
            <div className="flex items-center justify-between border-b border-[#E2ECF8] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#0057B8] font-bold block">
                  {selectedAppt.appointmentCode}
                </span>
                <h3 className="text-base font-black text-[#0A2540]">Doctor Consultation & Visit Summary</h3>
              </div>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="text-[#64748B] hover:text-[#0A2540] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F8FAFD] p-3 rounded-2xl border border-[#D6E4F5]">
                <strong>Patient:</strong> {selectedAppt.patientName} ({selectedAppt.patientCode}) • <strong>Service:</strong> {selectedAppt.appointmentType}
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0A2540] block mb-1">
                  High-Level Observations (Patient-Safe Summary):
                </label>
                <textarea
                  value={summaryDraft.highLevelObservations}
                  onChange={(e) => setSummaryDraft({ ...summaryDraft, highLevelObservations: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-2xl border border-[#D6E4F5] text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0A2540] block mb-1">
                  Physician Recommendations & Follow-Up Advice:
                </label>
                <textarea
                  value={summaryDraft.followUpAdvice}
                  onChange={(e) => setSummaryDraft({ ...summaryDraft, followUpAdvice: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-2xl border border-[#D6E4F5] text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#0A2540] block mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={summaryDraft.vitalSignsSnapshot?.bloodPressure || ''}
                    onChange={(e) =>
                      setSummaryDraft({
                        ...summaryDraft,
                        vitalSignsSnapshot: { ...summaryDraft.vitalSignsSnapshot, bloodPressure: e.target.value },
                      })
                    }
                    className="w-full p-2 rounded-xl border border-[#D6E4F5]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#0A2540] block mb-1">Fetal Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={summaryDraft.vitalSignsSnapshot?.fetalHeartRateBpm || ''}
                    onChange={(e) =>
                      setSummaryDraft({
                        ...summaryDraft,
                        vitalSignsSnapshot: { ...summaryDraft.vitalSignsSnapshot, fetalHeartRateBpm: Number(e.target.value) },
                      })
                    }
                    className="w-full p-2 rounded-xl border border-[#D6E4F5]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0A2540] block mb-1">Recommended Next Follow-up Date</label>
                <input
                  type="date"
                  value={summaryDraft.recommendedNextVisit || ''}
                  onChange={(e) => setSummaryDraft({ ...summaryDraft, recommendedNextVisit: e.target.value })}
                  className="w-full p-2 rounded-xl border border-[#D6E4F5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2ECF8]">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="py-2.5 rounded-xl border border-[#D6E4F5] text-[#475E7B] text-xs font-bold hover:bg-[#F4F8FD] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteEncounter}
                className="py-2.5 rounded-xl bg-[#0057B8] hover:bg-[#0047A0] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Sync & Complete Encounter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
