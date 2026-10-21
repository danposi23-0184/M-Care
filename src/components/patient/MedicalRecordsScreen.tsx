import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Heart,
  Calendar,
  Stethoscope,
  ChevronRight,
  Download,
  Printer,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { MedicalRecord } from '../../types';

interface MedicalRecordsScreenProps {
  onOpenBooking?: () => void;
}

export const MedicalRecordsScreen: React.FC<MedicalRecordsScreenProps> = ({ onOpenBooking }) => {
  const { patient, medicalRecords, clinicSettings } = useClinic();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Filter records for this patient
  const patientRecords = medicalRecords.filter(
    (r) => r.patientCode === patient?.patientCode || r.patientId === patient?.id
  );

  const filteredRecords = patientRecords.filter((r) => {
    if (filterType === 'All') return true;
    if (filterType === 'Ultrasound') return r.recordType.toLowerCase().includes('ultrasound');
    if (filterType === 'Check-Up') return !r.recordType.toLowerCase().includes('ultrasound');
    return true;
  });

  return (
    <div className="p-4 space-y-4 pb-20 bg-[#F4F8FD] dark:bg-[#061524] transition-colors duration-200">
      {/* Patient Maternal Overview Header Card */}
      <div className="bg-gradient-to-br from-[#0057B8] to-[#0A2540] text-white rounded-3xl p-5 shadow-lg border border-[#4EA1F3]/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#BAE6FD] font-bold">
              Official Diagnostic EMR
            </span>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
            {patient?.patientCode || 'MC-0015'}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-black text-white">{patient?.fullName || 'Antonina Ramos'}</h2>
          <p className="text-xs text-[#93C5FD]">
            Primary Attending: <strong>Dr. Bernice D. Paule, MD, FPOGS</strong>
          </p>
        </div>

        {/* Quick Biological Metrics Banner */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] text-[#BAE6FD] block">Latest Gestation</span>
            <span className="text-xs font-black text-white">24 Weeks</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] text-[#BAE6FD] block">Fetal Tone (FHR)</span>
            <span className="text-xs font-black text-white">144 bpm</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] text-[#BAE6FD] block">Records on File</span>
            <span className="text-xs font-black text-white">{patientRecords.length} Scans</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'Ultrasound', 'Check-Up'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === type
                ? 'bg-[#0057B8] text-white shadow-xs'
                : 'bg-white dark:bg-[#0F233A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {type} Records
          </button>
        ))}
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white dark:bg-[#0F233A] rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">No Records Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Completed ultrasound scans and consultations will automatically appear here once finalized by Dr. Bernice D. Paule.
              </p>
            </div>
            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-xl bg-[#0057B8] text-white text-xs font-bold transition shadow-xs hover:bg-[#0047A0] cursor-pointer"
              >
                Schedule First Ultrasound
              </button>
            )}
          </div>
        ) : (
          filteredRecords.map((rec) => (
            <div
              key={rec.id}
              onClick={() => setSelectedRecord(rec)}
              className="bg-white dark:bg-[#0F233A] rounded-2xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] shadow-xs space-y-3 hover:border-[#0057B8] transition cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 text-pink-500 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0A2540] dark:text-white leading-tight">
                      {rec.recordType}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{rec.date}</span>
                      <span>•</span>
                      <span>{rec.doctorName.split(',')[0]}</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 mt-2 shrink-0" />
              </div>

              {rec.sonogramBadge && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E1EFFF] dark:bg-[#10243E] text-[#0057B8] dark:text-[#60A5FA] text-[11px] font-bold border border-[#B9DBFE] dark:border-[#1E3A5F]">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{rec.sonogramBadge}</span>
                </div>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                {rec.findings}
              </p>
            </div>
          ))
        )}
      </div>

      {/* RECORD DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#0B1527] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-[#0A2540] dark:text-white space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Header Letterhead */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#0057B8] dark:text-[#60A5FA] tracking-wider block">
                  Official Sonogram & EMR Report
                </span>
                <h3 className="text-base font-black">{selectedRecord.recordType}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Date of Examination: <strong>{selectedRecord.date}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Patient & Doctor Banner */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Patient Name</span>
                <span className="font-bold text-slate-800 dark:text-white">{selectedRecord.patientName}</span>
                <span className="font-mono text-[10px] text-[#0057B8] block">{selectedRecord.patientCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Sonologist</span>
                <span className="font-bold text-slate-800 dark:text-white">{selectedRecord.doctorName}</span>
              </div>
            </div>

            {/* Measurements Grid */}
            {selectedRecord.measurements && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Biometric Measurements</span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-bold">BPD</span>
                    <span className="font-black text-slate-800 dark:text-white">{selectedRecord.measurements.bpdMm} mm</span>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-bold">FL</span>
                    <span className="font-black text-slate-800 dark:text-white">{selectedRecord.measurements.flMm} mm</span>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-bold">AC</span>
                    <span className="font-black text-slate-800 dark:text-white">{selectedRecord.measurements.acMm} mm</span>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-bold">AFI</span>
                    <span className="font-black text-slate-800 dark:text-white">{selectedRecord.measurements.afiCm} cm</span>
                  </div>
                </div>
              </div>
            )}

            {/* Ultrasound Findings */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Official Clinical Impression</span>
              <p className="text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                {selectedRecord.findings}
              </p>
            </div>

            {/* Prescriptions */}
            {selectedRecord.prescriptions && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Prescribed Regimen</span>
                <p className="text-xs text-slate-700 dark:text-slate-200 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 leading-relaxed">
                  {selectedRecord.prescriptions}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Diagnostic Report</span>
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-[#0057B8] hover:bg-[#004494] text-white text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
