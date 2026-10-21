import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Package,
  CreditCard,
  BarChart3,
  FileDown,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Clock,
  Activity,
  AlertTriangle,
  Wallet,
  Eye,
  EyeOff,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  LogOut,
  Stethoscope,
  Printer,
  ChevronDown,
  Download,
  Check,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, PatientUser, InventoryItem, ClinicPaymentRecord, VisitSummary } from '../../types';

export const WebManagerPortal: React.FC = () => {
  const {
    clinicSettings,
    appointments,
    staffApproveAppointment,
    staffRejectAppointment,
    staffRescheduleAppointment,
    staffCompleteAppointment,
    setViewMode,
  } = useClinic();

  // Authentication State for Web Manager
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState<boolean>(true);
  const [staffRole, setStaffRole] = useState<'Admin' | 'Doctor' | 'Receptionist'>('Admin');
  const [staffEmail, setStaffEmail] = useState<string>('admin@mcare.com');
  const [staffPassword, setStaffPassword] = useState<string>('admin123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Navigation State inside Web Manager
  const [activeMenu, setActiveMenu] = useState<
    | 'dashboard'
    | 'patients'
    | 'records'
    | 'appointments'
    | 'inventory'
    | 'payments'
    | 'analytics'
    | 'reports'
    | 'settings'
  >('dashboard');

  // Interactive Modals and Selection States
  const [selectedPatient, setSelectedPatient] = useState<PatientUser | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>(
    'Doctor on emergency delivery duty at AUF Medical Center'
  );
  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [appointmentFilter, setAppointmentFilter] = useState<string>('All');

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    address: 'Angeles City, Pampanga',
    birthday: '1995-05-15',
    civilStatus: 'Married',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  // Doctor visit summary draft
  const [summaryDraft, setSummaryDraft] = useState<VisitSummary>({
    attendingDoctor: 'Dr. Bernice D. Paule, MD, FPOGS, Sonologist',
    date: new Date().toISOString().split('T')[0],
    appointmentType: 'Routine OB-GYNE Check-Up',
    highLevelObservations:
      'Normal findings. Fundic height appropriate for gestational age. Fetal heart tones regular at 148 bpm. Maternal vitals unremarkable.',
    followUpAdvice:
      'Prescribed daily ferrous sulfate + folic acid. Advised repeat ultrasound in 4 weeks.',
    recommendedNextVisit: '2026-06-25',
    vitalSignsSnapshot: {
      bloodPressure: '118/76 mmHg',
      weightKg: 60.5,
      fetalHeartRateBpm: 148,
      gestationalAgeWeeks: 28,
    },
  });

  // Quick Demo Account Click Handler
  const handleDemoLogin = (email: string, pass: string, role: 'Admin' | 'Doctor' | 'Receptionist') => {
    setStaffEmail(email);
    setStaffPassword(pass);
    setStaffRole(role);
    setAuthError('');
    setIsStaffLoggedIn(true);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffEmail || !staffPassword) {
      setAuthError('Please enter your email and password');
      return;
    }
    if (staffEmail.includes('admin')) setStaffRole('Admin');
    else if (staffEmail.includes('paule')) setStaffRole('Doctor');
    else setStaffRole('Receptionist');
    setIsStaffLoggedIn(true);
  };

  // Synchronized appointment handlers
  const handleApprove = (id: string) => {
    staffApproveAppointment(id);
    if (selectedAppointment?.id === id) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: 'Approved' } : null));
    }
  };

  const handleReject = () => {
    if (!selectedAppointment) return;
    staffRejectAppointment(selectedAppointment.id, rejectReason);
    setShowRejectModal(false);
    setSelectedAppointment(null);
  };

  const handleCompleteEncounter = () => {
    if (!selectedAppointment) return;
    staffCompleteAppointment(selectedAppointment.id, {
      ...summaryDraft,
      appointmentType:
        selectedAppointment.appointmentType === 'Ultrasound'
          ? selectedAppointment.scanType || 'Ultrasound'
          : 'Check-Up Consultation',
      date: selectedAppointment.date,
    });
    setShowCompleteModal(false);
    setSelectedAppointment(null);
  };

  // Recent Patients from screenshot
  const recentPatients = [
    {
      code: 'MC-0016',
      name: 'Maria Isabella Reyes',
      phone: '0919-555-6789',
      date: 'Jun 25, 2026',
      initials: 'MI',
      color: 'bg-indigo-100 text-indigo-700',
    },
    {
      code: 'MC-0015',
      name: 'Antonina Ramos',
      phone: '0965-789-0120',
      date: 'Jun 23, 2026',
      initials: 'AR',
      color: 'bg-sky-100 text-sky-700',
    },
    {
      code: 'MC-0014',
      name: 'Margaret Tan',
      phone: '0958-678-9018',
      date: 'Jun 23, 2026',
      initials: 'MT',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      code: 'MC-0012',
      name: 'Concepcion Reyes',
      phone: '0938-456-7894',
      date: 'Jun 23, 2026',
      initials: 'CR',
      color: 'bg-cyan-100 text-cyan-700',
    },
    {
      code: 'MC-0013',
      name: 'Victoria Cruz',
      phone: '0948-567-8906',
      date: 'Jun 23, 2026',
      initials: 'VC',
      color: 'bg-blue-100 text-blue-700',
    },
  ];

  // Recent Appointments from screenshot
  const recentAppointments = [
    {
      id: 'apt-001',
      name: 'Antonina Ramos',
      datetime: 'May 24, 2026 at 09:30 · Check-Up',
      status: 'Completed',
      badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
    },
    {
      id: 'apt-002',
      name: 'Antonina Ramos',
      datetime: 'May 24, 2026 at 08:00 · Check-Up',
      status: 'Pending',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    {
      id: 'apt-003',
      name: 'Margaret Tan',
      datetime: 'Aug 9, 2026 at 08:00 · Check-Up',
      status: 'Approved',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    {
      id: 'apt-004',
      name: 'Antonina Ramos',
      datetime: 'May 11, 2026 at 13:00 · Ultrasound',
      status: 'Pending',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    {
      id: 'apt-005',
      name: 'Margaret Tan',
      datetime: 'May 29, 2026 at 16:30 · Ultrasound',
      status: 'Completed',
      badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
    },
  ];

  // Trend months data matching screenshot
  const trendMonths = [
    { label: 'Nov 25', count: 0 },
    { label: 'Dec 25', count: 0 },
    { label: 'Jan 26', count: 0 },
    { label: 'Feb 26', count: 0 },
    { label: 'Mar 26', count: 0 },
    { label: 'Apr 26', count: 0 },
    { label: 'May 26', count: 0 },
    { label: 'Jun 26', count: 16 },
    { label: 'Jul 26', count: 0 },
    { label: 'Aug 26', count: 0 },
    { label: 'Sep 26', count: 0 },
    { label: 'Oct 26', count: 0 },
  ];

  // 1. SIGN IN SCREEN (Exact reference from image_0bfbf5e5.png)
  if (!isStaffLoggedIn) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#E2EDFB] via-[#F1F6FD] to-[#FCEEF5] font-sans">
        {/* Subtle dot pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Back to Patient App shortcut button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => setViewMode('mobile-app')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold shadow-sm backdrop-blur transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Switch to Patient Mobile App</span>
          </button>
        </div>

        <div className="w-full max-w-md z-10 flex flex-col items-center space-y-6 animate-fade-in">
          {/* Logo Emblem (Mother & Child in Circle) */}
          <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center p-3 border border-pink-100">
            <img src="/icon.svg" alt="M-Care Logo" className="w-full h-full object-contain" />
          </div>

          {/* Heading */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-blue-600 sm:text-[26px]">
              <span className="text-[#2563EB]">M-Care OB-GYNE </span>
              <span className="text-[#DB2777]">Clinic & Ultrasound</span>
            </h1>
            <p className="text-sm font-medium text-slate-500">Maternity Care Management System</p>
          </div>

          {/* Sign In Card */}
          <div className="w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 border border-slate-100 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-800">
                <Shield className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold">Sign In</h2>
              </div>
              <p className="text-xs text-slate-400">Enter your credentials to access the system</p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Email</label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="admin@mcare.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-[0.99] transition cursor-pointer"
              >
                Sign In
              </button>
            </form>

            {/* DEMO ACCOUNTS box (Matching screenshot 1) */}
            <div className="rounded-2xl bg-[#FFF6FA] p-4 border border-pink-100/80 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[#DB2777] font-bold text-xs tracking-wider">
                <span className="w-3.5 h-3.5 rounded-full border border-[#DB2777] flex items-center justify-center text-[9px]">
                  ⚙
                </span>
                <span>DEMO ACCOUNTS</span>
              </div>
              <div className="text-xs space-y-2 font-mono text-slate-600">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@mcare.com', 'admin123', 'Admin')}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/80 transition text-left cursor-pointer"
                >
                  <span className="font-semibold text-slate-700">Admin</span>
                  <span className="text-blue-600">admin@mcare.com / admin123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('dr.paule@mcare.com', 'doctor123', 'Doctor')}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/80 transition text-left cursor-pointer"
                >
                  <span className="font-semibold text-slate-700">Doctor</span>
                  <span className="text-blue-600">dr.paule@mcare.com / doctor123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('reception@mcare.com', 'reception123', 'Receptionist')}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/80 transition text-left cursor-pointer"
                >
                  <span className="font-semibold text-slate-700">Receptionist</span>
                  <span className="text-blue-600">reception@mcare.com / reception123</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer attribution from reference */}
          <div className="text-center text-xs text-slate-400 font-medium">
            Dr. Bernice D. Paule, OB-GYNE / Sonologist
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN WEB MANAGER DASHBOARD (Exact reference from image_86dd4dd2.png)
  return (
    <div className="min-h-screen bg-[#F4F8FD] text-[#0A2540] flex font-sans antialiased overflow-hidden">
      {/* LEFT SIDEBAR (Dark Navy) */}
      <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-[#1E293B] shadow-xl select-none">
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-[#1E293B]">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md">
            <img src="/icon.svg" alt="M-Care" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-white font-extrabold text-sm tracking-tight leading-none">M-Care</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">OB-GYNE Clinic</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'patients', label: 'Patients', icon: Users },
            { id: 'records', label: 'Medical Records', icon: FileText },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'reports', label: 'Reports', icon: FileDown },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id as typeof activeMenu)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E293B] text-white shadow-sm font-bold border-l-4 border-indigo-500 pl-2.5'
                    : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Admin User Profile */}
        <div className="p-4 border-t border-[#1E293B] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
              AU
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-white">Admin User</div>
              <div className="text-[10px] text-slate-400">Admin</div>
            </div>
          </div>
          <button
            onClick={() => setIsStaffLoggedIn(false)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition cursor-pointer pt-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Bar matching screenshot */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-[#0A2540] capitalize tracking-tight">
              {activeMenu === 'dashboard' ? 'Dashboard' : activeMenu}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Switch to Patient Mobile App */}
            <button
              onClick={() => setViewMode('mobile-app')}
              className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Open Patient Mobile App</span>
            </button>

            {/* Profile Avatar Header */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">Admin User</span>
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                AU
              </div>
            </div>
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div className="p-6 space-y-6">
          {/* TAB 1: DASHBOARD (Exact screenshot 2 layout) */}
          {activeMenu === 'dashboard' && (
            <>
              {/* Row of 7 Stat Cards (Exact match from image_86dd4dd2.png) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {/* 1. Total Patients */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Total Patients</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">16</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                {/* 2. Appointments */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Appointments</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">30</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>

                {/* 3. Pending Appts */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Pending Appts</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">4</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                {/* 4. Today's Appts */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Today's Appts</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">0</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>

                {/* 5. Low Stock */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Low Stock</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">2</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>

                {/* 6. Revenue */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Revenue</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">₱4,500</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>

                {/* 7. Pending Payments */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Pending Payments</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">3</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Middle Row: Recent Patients & Recent Appointments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Recent Patients */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col h-[340px]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                      <UserPlus className="w-4 h-4 text-blue-500" />
                      <span>Recent Patients</span>
                    </div>
                    <button
                      onClick={() => setActiveMenu('patients')}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      View All (16)
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-1">
                    {recentPatients.map((pat, idx) => (
                      <div
                        key={idx}
                        className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition cursor-pointer"
                        onClick={() => setActiveMenu('patients')}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${pat.color} font-bold text-xs flex items-center justify-center shrink-0`}
                          >
                            {pat.initials}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-800">{pat.name}</div>
                            <div className="text-[11px] text-slate-400">
                              {pat.code} · {pat.phone}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400 font-medium">{pat.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card: Recent Appointments */}
                <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col h-[340px]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                      <Calendar className="w-4 h-4 text-pink-500" />
                      <span>Recent Appointments</span>
                    </div>
                    <button
                      onClick={() => setActiveMenu('appointments')}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Manage (30)
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-1">
                    {recentAppointments.map((appt, idx) => (
                      <div
                        key={idx}
                        className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition cursor-pointer"
                        onClick={() => {
                          const target = appointments.find((a) => a.id === appt.id);
                          if (target) setSelectedAppointment(target);
                          else setActiveMenu('appointments');
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-800">{appt.name}</div>
                            <div className="text-[11px] text-slate-400">{appt.datetime}</div>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${appt.badgeColor}`}
                        >
                          {appt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card: Monthly Patient Registration Trend */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6">
                <h3 className="font-bold text-sm text-slate-800">Monthly Patient Registration Trend</h3>

                {/* Chart Visualization */}
                <div className="pt-8 pb-4">
                  <div className="relative h-24 w-full flex items-end">
                    {/* Horizontal zero base line */}
                    <div className="absolute inset-x-0 bottom-6 h-[2px] bg-blue-500/80" />

                    <div className="w-full grid grid-cols-12 gap-2 text-center z-10">
                      {trendMonths.map((m, idx) => {
                        const isPeak = m.count > 0;
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            {/* Peak indicator dot & value */}
                            <div className="h-14 flex items-end justify-center mb-1">
                              {isPeak && (
                                <div className="flex flex-col items-center animate-bounce">
                                  <span className="text-xs font-black text-blue-600 mb-1">{m.count}</span>
                                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 shadow" />
                                </div>
                              )}
                              {!isPeak && <span className="text-[11px] text-slate-400 font-mono">0</span>}
                            </div>
                            {/* Label */}
                            <span className="text-[11px] text-slate-500 font-medium mt-2">{m.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: PATIENTS */}
          {activeMenu === 'patients' && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Patient Registry (16 Registered)</h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive patient records, demographics, and clinical history for M-Care Clinic.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPatientModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Patient</span>
                </button>
              </div>

              {/* Patient Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Patient Code</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4">Registered</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentPatients.map((pat, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">{pat.code}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{pat.name}</td>
                        <td className="py-3 px-4 text-slate-600 font-mono">{pat.phone}</td>
                        <td className="py-3 px-4 text-slate-500">Angeles City, Pampanga</td>
                        <td className="py-3 px-4 text-slate-500">{pat.date}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedPatient({
                                id: pat.code,
                                patientCode: pat.code,
                                fullName: pat.name,
                                contactNumber: pat.phone,
                                email: `${pat.name.toLowerCase().replace(/ /g, '.')}@gmail.com`,
                                address: 'Angeles City, Pampanga',
                                emergencyContactName: 'Family Member',
                                emergencyContactPhone: pat.phone,
                                birthday: '1995-04-14',
                                civilStatus: 'Married',
                                isExistingRecordMatched: true,
                                registeredDate: pat.date,
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold transition cursor-pointer"
                          >
                            View Chart
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: APPOINTMENTS */}
          {activeMenu === 'appointments' && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Clinic Appointment Scheduling</h2>
                  <p className="text-xs text-slate-500">
                    Real-time scheduling desk synced live with the Patient Mobile App.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {['All', 'Pending', 'Approved', 'Completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setAppointmentFilter(status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        appointmentFilter === status
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointments List */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Patient Name</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Type / Scan</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments
                      .filter((a) => (appointmentFilter === 'All' ? true : a.status === appointmentFilter))
                      .map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">{appt.appointmentCode}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">{appt.patientName}</td>
                          <td className="py-3 px-4 text-slate-600">
                            {appt.date} at {appt.timeSlot}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {appt.scanType ? appt.scanType : appt.appointmentType}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                appt.status === 'Completed'
                                  ? 'bg-pink-100 text-pink-700 border-pink-200'
                                  : appt.status === 'Approved'
                                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                                  : appt.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            {appt.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(appt.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedAppointment(appt);
                                    setShowRejectModal(true);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 font-bold transition cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {appt.status === 'Approved' && (
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appt);
                                  setShowCompleteModal(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition cursor-pointer"
                              >
                                Complete Visit
                              </button>
                            )}
                            {appt.status === 'Completed' && (
                              <button
                                onClick={() => setSelectedAppointment(appt)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                              >
                                View Report
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MEDICAL RECORDS & SONOGRAMS */}
          {activeMenu === 'records' && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Ultrasound & Sonology Repository</h2>
                <p className="text-xs text-slate-500">
                  Electronic diagnostic imaging scans, biometric measurements, and obstetrical charts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Biophysical Profile (BPS) Sonogram',
                    patient: 'Antonina Ramos (MC-0015)',
                    date: 'May 24, 2026',
                    result: 'Fetal Heart: 144 bpm • Amniotic Fluid: 14.2 cm (Normal) • Gestational Age: 24 wks',
                    doctor: 'Dr. Bernice D. Paule, MD, FPOGS',
                  },
                  {
                    title: 'Pelvic Ultrasound (Transabdominal)',
                    patient: 'Margaret Tan (MC-0014)',
                    date: 'May 29, 2026',
                    result: 'Uterus anteverted (6.8 x 4.2 x 3.6 cm) • Endometrium: 7.2 mm • No adnexal masses',
                    doctor: 'Dr. Bernice D. Paule, MD, FPOGS',
                  },
                  {
                    title: 'Congenital Anomaly Scan (Level II CAS)',
                    patient: 'Maria Isabella Reyes (MC-0016)',
                    date: 'Jun 25, 2026',
                    result: 'Anatomical survey complete. Normal 4-chamber cardiac view. Intact skull & spine.',
                    doctor: 'Dr. Bernice D. Paule, MD, FPOGS',
                  },
                  {
                    title: 'Early Obstetric Transvaginal Ultrasound (TVS)',
                    patient: 'Victoria Cruz (MC-0013)',
                    date: 'Jun 23, 2026',
                    result: 'Single gestational sac identified. CRL: 12 mm. Yolk sac present.',
                    doctor: 'Dr. Bernice D. Paule, MD, FPOGS',
                  },
                ].map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-blue-200 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800">{rec.title}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{rec.date}</span>
                    </div>
                    <p className="text-xs font-semibold text-blue-600">{rec.patient}</p>
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                      {rec.result}
                    </p>
                    <div className="text-[11px] text-slate-400">Sonologist: {rec.doctor}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: INVENTORY */}
          {activeMenu === 'inventory' && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Clinic Supplies & Consumables</h2>
                  <p className="text-xs text-slate-500">2 items currently flagged as Low Stock.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Aquasonic Ultrasound Transmission Gel (5L)',
                    stock: 1,
                    min: 3,
                    isLow: true,
                    unit: 'dispensers',
                  },
                  {
                    name: 'Sterile Endocavity Probe Sheaths (Box of 100)',
                    stock: 4,
                    min: 10,
                    isLow: true,
                    unit: 'boxes',
                  },
                  {
                    name: 'Sony High Glossy Thermal Ultrasound Paper',
                    stock: 28,
                    min: 12,
                    isLow: false,
                    unit: 'rolls',
                  },
                  {
                    name: 'Disposable Vaginal Speculum Medium',
                    stock: 18,
                    min: 8,
                    isLow: false,
                    unit: 'boxes',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      item.isLow ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-100'
                    } flex items-center justify-between`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-800">{item.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Current: <strong>{item.stock}</strong> {item.unit} (Min Threshold: {item.min})
                      </div>
                    </div>
                    {item.isLow ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold border border-red-200">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        In Stock
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENTS */}
          {activeMenu === 'payments' && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Billing & Payment Ledger</h2>
                <p className="text-xs text-slate-500">
                  Total Collected Revenue: <strong>₱4,500</strong> • 3 Invoices Pending Payment
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Patient</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { inv: 'INV-1043', pat: 'Antonina Ramos', srv: 'Check-Up Consultation', amt: '₱600', st: 'Pending' },
                      { inv: 'INV-1045', pat: 'Antonina Ramos', srv: 'Transvaginal Ultrasound (TVS)', amt: '₱1,200', st: 'Pending' },
                      { inv: 'INV-1047', pat: 'Maria Isabella Reyes', srv: 'Biophysical Profile (BPS)', amt: '₱1,400', st: 'Pending' },
                      { inv: 'INV-1042', pat: 'Antonina Ramos', srv: 'Check-Up Consultation', amt: '₱600', st: 'Paid' },
                      { inv: 'INV-1044', pat: 'Margaret Tan', srv: 'Check-Up Consultation', amt: '₱600', st: 'Paid' },
                      { inv: 'INV-1046', pat: 'Margaret Tan', srv: 'Pelvic Ultrasound', amt: '₱950', st: 'Paid' },
                      { inv: 'INV-1020', pat: 'Concepcion Reyes', srv: 'Ultrasound + Prenatal Pack', amt: '₱1,400', st: 'Paid' },
                      { inv: 'INV-1021', pat: 'Victoria Cruz', srv: 'Pelvic Exam Consultation', amt: '₱950', st: 'Paid' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{row.inv}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{row.pat}</td>
                        <td className="py-3 px-4 text-slate-600">{row.srv}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{row.amt}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              row.st === 'Paid'
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                : 'bg-orange-100 text-orange-700 border-orange-200'
                            }`}
                          >
                            {row.st}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeMenu === 'settings' && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Clinic Profile & Doctor Schedule</h2>
                <p className="text-xs text-slate-500">
                  Settings are broadcast across the patient mobile application in real-time.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-600">Attending Doctor</label>
                  <input
                    type="text"
                    disabled
                    value="Dr. Bernice D. Paule, MD, FPOGS, FPSUOG, Sonologist"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Clinic Location</label>
                  <input
                    type="text"
                    disabled
                    value="2nd Floor, Diamond Arcade Bldg., MacArthur Highway, Balibago, Angeles City"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-600">Clinic Hours</label>
                    <input
                      type="text"
                      disabled
                      value="08:00 AM - 05:00 PM"
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600">Slot Duration</label>
                    <input
                      type="text"
                      disabled
                      value="30 minutes"
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REJECT MODAL */}
      {showRejectModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <h3 className="text-base font-bold text-slate-800">Decline Appointment Request</h3>
            <p className="text-xs text-slate-500">
              Please enter the clinical reason for declining. This message will be sent instantly to the patient’s mobile app.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETE ENCOUNTER MODAL */}
      {showCompleteModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-800">
              Doctor Encounter & Clinical Summary • {selectedAppointment.patientName}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">High-Level Clinical Observations</label>
                <textarea
                  value={summaryDraft.highLevelObservations}
                  onChange={(e) =>
                    setSummaryDraft((prev) => ({ ...prev, highLevelObservations: e.target.value }))
                  }
                  rows={3}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Follow-up Advice & Prescription</label>
                <textarea
                  value={summaryDraft.followUpAdvice}
                  onChange={(e) => setSummaryDraft((prev) => ({ ...prev, followUpAdvice: e.target.value }))}
                  rows={2}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600">Blood Pressure</label>
                  <input
                    type="text"
                    value={summaryDraft.vitalSignsSnapshot?.bloodPressure || ''}
                    onChange={(e) =>
                      setSummaryDraft((prev) => ({
                        ...prev,
                        vitalSignsSnapshot: { ...prev.vitalSignsSnapshot, bloodPressure: e.target.value },
                      }))
                    }
                    className="w-full mt-1 p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Fetal Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={summaryDraft.vitalSignsSnapshot?.fetalHeartRateBpm || 148}
                    onChange={(e) =>
                      setSummaryDraft((prev) => ({
                        ...prev,
                        vitalSignsSnapshot: {
                          ...prev.vitalSignsSnapshot,
                          fetalHeartRateBpm: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full mt-1 p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteEncounter}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Save & Complete Encounter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
