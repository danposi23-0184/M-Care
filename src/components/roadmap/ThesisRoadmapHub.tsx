import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Code2,
  Smartphone,
  Shield,
  FileSpreadsheet,
  Download,
  Terminal,
  Cpu,
  Database,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';
import { THESIS_PROJECT_ROADMAP } from '../../data/mockDatabase';

export const ThesisRoadmapHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'timeline' | 'architecture' | 'iso25010' | 'export_guide'>('timeline');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Capstone Header */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#003366] to-[#0057B8] rounded-3xl p-6 text-white shadow-xl border border-[#D6E4F5]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0057B8] text-white text-[11px] font-black tracking-wide uppercase border border-white/20">
                Thesis Capstone • CCA ICSLIS
              </span>
              <span className="text-xs text-[#BAE6FD] font-mono font-bold">Phase 2 Extension (Sept–Dec 2026)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              M-Care Patient Mobile App: Project Roadmap & Technical Architecture
            </h1>
            <p className="text-xs text-[#E1EFFF] max-w-3xl leading-relaxed">
              Academic capstone project specification for M-Care OB-GYNE Clinic & Ultrasound in Balibago, Angeles City.
              Prepared by: Arnold Kirk M. Bognot, John Mark M. Calalo, Jane Ryza S. Lopez, Daniel C. Posadas, and John Lenard Sumido.
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/15">
          <button
            onClick={() => setActiveSection('timeline')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSection === 'timeline'
                ? 'bg-white text-[#0057B8] shadow-md font-black'
                : 'bg-white/10 hover:bg-white/20 text-[#BAE6FD]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>1. 14-Week Roadmap</span>
          </button>

          <button
            onClick={() => setActiveSection('architecture')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSection === 'architecture'
                ? 'bg-white text-[#0057B8] shadow-md font-black'
                : 'bg-white/10 hover:bg-white/20 text-[#BAE6FD]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>2. Cross-Platform Arch</span>
          </button>

          <button
            onClick={() => setActiveSection('iso25010')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSection === 'iso25010'
                ? 'bg-white text-[#0057B8] shadow-md font-black'
                : 'bg-white/10 hover:bg-white/20 text-[#BAE6FD]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>3. ISO 25010 Matrix</span>
          </button>

          <button
            onClick={() => setActiveSection('export_guide')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSection === 'export_guide'
                ? 'bg-white text-[#0057B8] shadow-md font-black'
                : 'bg-white/10 hover:bg-white/20 text-[#BAE6FD]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>4. VS Code & Native Export</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 14-WEEK STRUCTURED TIMELINE */}
      {activeSection === 'timeline' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#D6E4F5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#0A2540]">Capstone Project Execution Timeline (Gantt Schedule)</h3>
                <p className="text-xs text-[#475E7B]">Structured into 6 progressive phases from inception to final oral defense</p>
              </div>
              <span className="text-xs font-bold text-[#0057B8] bg-[#E1EFFF] px-3 py-1 rounded-full border border-[#B9DBFE]">
                Overall Progress: 80%
              </span>
            </div>

            <div className="space-y-4">
              {THESIS_PROJECT_ROADMAP.map((phase) => (
                <div
                  key={phase.id}
                  className="p-4 rounded-3xl border border-[#D6E4F5] bg-[#F8FAFD] hover:bg-white hover:border-[#0057B8] transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          phase.status === 'Completed'
                            ? 'bg-[#0D9488] text-white'
                            : phase.status === 'In Progress'
                            ? 'bg-[#0057B8] text-white animate-pulse'
                            : 'bg-[#CBD5E1] text-[#64748B]'
                        }`}
                      >
                        {phase.phaseNumber}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0A2540]">{phase.phaseName}</h4>
                        <span className="text-xs text-[#475E7B] font-medium">{phase.timeline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          phase.status === 'Completed'
                            ? 'bg-[#E6F7F5] text-[#0D9488] border border-[#99F6E4]'
                            : phase.status === 'In Progress'
                            ? 'bg-[#E1EFFF] text-[#0057B8] border border-[#B9DBFE]'
                            : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                        }`}
                      >
                        {phase.status}
                      </span>
                      <div className="w-24 bg-[#E2ECF8] rounded-full h-2 overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full ${
                            phase.status === 'Completed' ? 'bg-[#0D9488]' : 'bg-[#0057B8]'
                          }`}
                          style={{ width: `${phase.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#E2ECF8]">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#475E7B] block mb-1">
                        Key Deliverables:
                      </span>
                      <ul className="space-y-1 text-[#0A2540]">
                        {phase.deliverables.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#0057B8] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#475E7B] block">
                          Assigned Capstone Leads:
                        </span>
                        <span className="font-bold text-[#0A2540]">{phase.teamLead}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#475E7B] block">
                          Formal Output:
                        </span>
                        <span className="text-[#475E7B] italic">{phase.keyOutputs}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CROSS-PLATFORM ARCHITECTURE & BACKEND CONTRACT */}
      {activeSection === 'architecture' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Extended Prisma Schema */}
          <div className="bg-[#0A2540] rounded-3xl p-5 text-slate-200 font-mono text-xs space-y-3 border border-[#003366] shadow-lg">
            <div className="flex items-center justify-between text-[#BAE6FD] border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#4EA1F3]" />
                <span className="font-bold text-white">prisma/schema.prisma (Phase 2 SQLite Extension)</span>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    `model PatientAccount {
  id              String       @id @default(cuid())
  patientCode     String       @unique // Linked MC-XXXX
  fullName        String
  contactNumber   String       @unique
  passwordHash    String
  address         String
  emergencyName   String?
  emergencyPhone  String?
  birthday        DateTime?
  registeredAt    DateTime     @default(now())
  appointments    Appointment[]
}

model Appointment {
  id              String       @id @default(cuid())
  appointmentCode String       @unique // AP-XXXX
  patientId       String
  patient         PatientAccount @relation(fields: [patientId], references: [id])
  date            String       // YYYY-MM-DD
  timeSlot        String       // e.g. "09:30 AM"
  type            String       // Check-Up | Ultrasound
  scanType        String?
  status          String       @default("Pending") // 5-State workflow
  reason          String?
  cancellationReason String?
  rejectionReason String?
  paymentStatus   String       @default("Pending")
  createdAt       DateTime     @default(now())
}`,
                    1
                  )
                }
                className="text-[11px] text-[#BAE6FD] hover:text-white flex items-center gap-1 cursor-pointer font-bold"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="text-[11px] leading-relaxed text-[#E1EFFF] overflow-x-auto p-2 bg-black/30 rounded-xl">
{`// Phase 2 Patient Auth & Booking Linkage
model PatientAccount {
  id              String       @id @default(cuid())
  patientCode     String       @unique // Linked MC-XXXX
  fullName        String
  contactNumber   String       @unique
  passwordHash    String
  address         String
  emergencyName   String?
  emergencyPhone  String?
  birthday        DateTime?
  registeredAt    DateTime     @default(now())
  appointments    Appointment[]
}

model Appointment {
  id              String       @id @default(cuid())
  appointmentCode String       @unique // AP-XXXX
  patientId       String
  patient         PatientAccount @relation(fields: [patientId], references: [id])
  date            String       // YYYY-MM-DD
  timeSlot        String       // 30-min window
  type            String       // Check-Up | Ultrasound
  scanType        String?
  status          String       @default("Pending")
  reason          String?
  cancellationReason String?
  rejectionReason String?
  paymentStatus   String       @default("Pending")
  createdAt       DateTime     @default(now())
}`}
            </pre>
            <p className="text-[10px] text-[#BAE6FD]">
              *Preserves full schema compatibility with Phase 1 Next.js web application while adding secure patient credential tables.
            </p>
          </div>

          {/* REST API Endpoints Specification */}
          <div className="bg-white rounded-3xl p-5 border border-[#D6E4F5] shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 border-b border-[#E2ECF8] pb-2">
              <Code2 className="w-4 h-4 text-[#0057B8]" />
              <h3 className="font-black text-[#0A2540] uppercase text-xs">
                Patient REST API Specification
              </h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#F8FAFD] border border-[#D6E4F5]">
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className="px-2 py-0.5 bg-[#E1EFFF] text-[#0057B8] rounded-md text-[10px] border border-[#B9DBFE]">POST</span>
                  <span className="text-[#0A2540]">/api/patient/auth/register</span>
                </div>
                <p className="text-[11px] text-[#475E7B] mt-1">
                  Validates phone OTP, checks returning patient name match, assigns or links MC-XXXX ID.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8FAFD] border border-[#D6E4F5]">
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className="px-2 py-0.5 bg-[#E6F7F5] text-[#0D9488] rounded-md text-[10px] border border-[#99F6E4]">POST</span>
                  <span className="text-[#0A2540]">/api/patient/appointments/book</span>
                </div>
                <p className="text-[11px] text-[#475E7B] mt-1">
                  Runs Algorithm 2 double-booking lock on SQLite transaction; creates AP-XXXX in `Pending` state.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8FAFD] border border-[#D6E4F5]">
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className="px-2 py-0.5 bg-[#FEF7EB] text-[#D97706] rounded-md text-[10px] border border-[#FDE68A]">PATCH</span>
                  <span className="text-[#0A2540]">/api/patient/appointments/:id/cancel</span>
                </div>
                <p className="text-[11px] text-[#475E7B] mt-1">
                  Allows patient to cancel Pending/Approved booking; releases slot immediately to calendar pool.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8FAFD] border border-[#D6E4F5]">
                <div className="flex items-center gap-2 font-mono font-bold">
                  <span className="px-2 py-0.5 bg-[#F3E8FF] text-[#9333EA] rounded-md text-[10px] border border-[#E9D5FF]">GET</span>
                  <span className="text-[#0A2540]">/api/patient/visits/:id/summary</span>
                </div>
                <p className="text-[11px] text-[#475E7B] mt-1">
                  Returns limited, patient-safe summary (Key observations & follow-up) keeping staff records private.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ISO/IEC 25010 USABILITY TESTING MATRIX */}
      {activeSection === 'iso25010' && (
        <div className="bg-white rounded-3xl p-6 border border-[#D6E4F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2ECF8] pb-3">
            <div>
              <h3 className="text-base font-black text-[#0A2540]">
                ISO/IEC 25010 Software Quality Evaluation Framework
              </h3>
              <p className="text-xs text-[#475E7B]">
                Target sample: 30 Patient Participants from Angeles City evaluated against Likert 5-point scale
              </p>
            </div>
            <span className="text-xs bg-[#E1EFFF] text-[#0057B8] font-bold px-3 py-1 rounded-full border border-[#B9DBFE]">
              Evaluation Instrument
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-3xl bg-[#F8FAFD] border border-[#D6E4F5] space-y-2">
              <div className="font-bold text-[#0A2540] text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
                <span>1. Functional Suitability</span>
              </div>
              <ul className="space-y-1.5 text-[#475E7B] leading-relaxed">
                <li>• <strong>Functional Completeness:</strong> Patient can autonomously register, select checkup/ultrasound, book slot, and cancel.</li>
                <li>• <strong>Functional Correctness:</strong> Real-time rejection of conflicting slots (Algorithm 2) prevents double-booking errors.</li>
                <li>• <strong>Record Deduplication:</strong> Returning-patient matching eliminates redundant MC-XXXX records.</li>
              </ul>
            </div>

            <div className="p-4 rounded-3xl bg-[#F8FAFD] border border-[#D6E4F5] space-y-2">
              <div className="font-bold text-[#0A2540] text-sm flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#0057B8]" />
                <span>2. Usability & User Experience</span>
              </div>
              <ul className="space-y-1.5 text-[#475E7B] leading-relaxed">
                <li>• <strong>Learnability:</strong> Intuitive 4-step booking modal requiring minimal onboarding for all age demographics.</li>
                <li>• <strong>Operability:</strong> Clean mobile UI touch targets (≥44px) and clear status indications.</li>
                <li>• <strong>Accessibility:</strong> High contrast color schemes, Philippine mobile format validation, and clear directions.</li>
              </ul>
            </div>

            <div className="p-4 rounded-3xl bg-[#F8FAFD] border border-[#D6E4F5] space-y-2">
              <div className="font-bold text-[#0A2540] text-sm flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#0057B8]" />
                <span>3. Security & Scope Boundaries</span>
              </div>
              <ul className="space-y-1.5 text-[#475E7B] leading-relaxed">
                <li>• <strong>Data Confidentiality:</strong> Patients only access their own appointments and limited visit summaries.</li>
                <li>• <strong>Staff Isolation:</strong> Clinical diagnoses, doctor notes, and internal pharmacy inventory remain strictly inaccessible in mobile client.</li>
                <li>• <strong>Compliance:</strong> Complies with Philippine Data Privacy Act (RA 10173).</li>
              </ul>
            </div>

            <div className="p-4 rounded-3xl bg-[#F8FAFD] border border-[#D6E4F5] space-y-2">
              <div className="font-bold text-[#0A2540] text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0057B8]" />
                <span>4. Performance & Efficiency</span>
              </div>
              <ul className="space-y-1.5 text-[#475E7B] leading-relaxed">
                <li>• <strong>Time-to-Book:</strong> Reduced appointment booking time from ~6 minutes (phone call) to &lt;45 seconds (self-service).</li>
                <li>• <strong>Sync Latency:</strong> Receptionist approval reflects in the patient app instantly with real-time notification.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: VS CODE & CROSS-PLATFORM EXPORT GUIDE */}
      {activeSection === 'export_guide' && (
        <div className="bg-white rounded-3xl p-6 border border-[#D6E4F5] shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-black text-[#0A2540]">
              How to Export to Visual Studio Code & Run on iOS / Android
            </h3>
            <p className="text-xs text-[#475E7B]">
              Follow these standard industry steps to clone, open in VS Code, and compile standalone mobile binaries.
            </p>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-4 rounded-3xl bg-[#0A2540] text-white space-y-2 font-mono text-xs border border-[#003366]">
              <div className="flex items-center justify-between text-[#BAE6FD]">
                <span className="font-bold text-[#4EA1F3]">Step 1: Download & Open in VS Code</span>
                <button
                  onClick={() => copyToClipboard('git clone <YOUR_REPO_URL>\ncd mcare-patient-mobile\ncode .', 2)}
                  className="text-[#BAE6FD] hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                >
                  {copiedIndex === 2 ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-[#E1EFFF] p-2 bg-black/30 rounded-xl">
{`# 1. Export from AI Studio via Settings -> Export to ZIP or GitHub
# 2. Extract and open in Visual Studio Code:
code .
# 3. Install project dependencies:
npm install`}
              </pre>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-3xl bg-[#0A2540] text-white space-y-2 font-mono text-xs border border-[#003366]">
              <div className="flex items-center justify-between text-[#BAE6FD]">
                <span className="font-bold text-[#34D399]">Step 2: Run in Local Development (Vite / React Native)</span>
                <button
                  onClick={() => copyToClipboard('npm run dev', 3)}
                  className="text-[#BAE6FD] hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                >
                  {copiedIndex === 3 ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 3 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-[#E1EFFF] p-2 bg-black/30 rounded-xl">
{`# Start the local development server (binds on port 3000):
npm run dev`}
              </pre>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-3xl bg-[#0A2540] text-white space-y-2 font-mono text-xs border border-[#003366]">
              <div className="flex items-center justify-between text-[#BAE6FD]">
                <span className="font-bold text-[#4EA1F3]">Step 3: Build Standalone Android APK & iOS Package</span>
                <button
                  onClick={() => copyToClipboard('npx cap add android\nnpx cap add ios\nnpx cap open android', 4)}
                  className="text-[#BAE6FD] hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                >
                  {copiedIndex === 4 ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 4 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-[#E1EFFF] p-2 bg-black/30 rounded-xl">
{`# To generate native Android Studio project & APK:
npm run build
npx @capacitor/cli init "M-Care Patient" "com.mcare.patient"
npx @capacitor/cli add android
npx @capacitor/cli add ios
npx @capacitor/cli open android   # Launches in Android Studio -> Build APK!
npx @capacitor/cli open ios       # Launches in Xcode for iOS Simulator / iPhone`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
