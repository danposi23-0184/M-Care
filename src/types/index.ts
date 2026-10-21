export type AppointmentType = 'Check-Up' | 'Ultrasound';

export type UltrasoundScanType =
  | 'Pelvic Ultrasound'
  | 'Transvaginal Ultrasound (TVS)'
  | 'Obstetric Ultrasound (Early Pregnancy)'
  | 'Biophysical Profile (BPS)'
  | 'Congenital Anomaly Scan (CAS)'
  | '3D/4D Baby Scan'
  | 'Follicular Monitoring'
  | 'Transrectal Ultrasound';

export type AppointmentStatus =
  | 'Pending'
  | 'Approved'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Refunded';

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  amount: number;
  balance: number;
  status: PaymentStatus;
  items: {
    description: string;
    price: number;
  }[];
  paidAt?: string;
}

export interface VisitSummary {
  attendingDoctor: string;
  date: string;
  appointmentType: string;
  highLevelObservations: string;
  followUpAdvice: string;
  recommendedNextVisit?: string;
  vitalSignsSnapshot?: {
    bloodPressure?: string;
    weightKg?: number;
    fetalHeartRateBpm?: number;
    gestationalAgeWeeks?: number;
  };
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientCode: string;
  patientName: string;
  recordType: string;
  date: string;
  doctorName: string;
  findings: string;
  gestationalAgeWeeks?: number;
  fetalHeartRateBpm?: number;
  bloodPressure?: string;
  weightKg?: number;
  fundicHeightCm?: number;
  prescriptions?: string;
  sonogramBadge?: string;
  measurements?: {
    bpdMm?: number;
    flMm?: number;
    acMm?: number;
    afiCm?: number;
  };
}

export interface Appointment {
  id: string;
  appointmentCode: string; // e.g. AP-1042
  patientId: string;
  patientCode: string; // e.g. MC-0418
  patientName: string;
  contactNumber: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  appointmentType: AppointmentType;
  scanType?: UltrasoundScanType;
  reason: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  rejectionReason?: string;
  attendingDoctor: string;
  visitSummary?: VisitSummary;
  payment: PaymentRecord;
  createdAt: string;
}

export interface PatientUser {
  id: string;
  patientCode: string; // MC-XXXX
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  birthday: string;
  civilStatus: string;
  philhealthNumber?: string;
  isExistingRecordMatched: boolean;
  registeredDate: string;
  avatarUrl?: string;
}

export interface ClinicSettings {
  name: string;
  subTitle: string;
  branch: string;
  doctorName: string;
  doctorCredentials: string;
  specialization: string;
  address: string;
  barangay: string;
  city: string;
  province: string;
  landmark: string;
  phone: string;
  mobile: string;
  emergencyHotline: string;
  email: string;
  operatingDays: string[];
  operatingHours: {
    start: string;
    end: string;
  };
  slotDurationMinutes: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  services: {
    id: string;
    name: string;
    category: 'Check-Up' | 'Ultrasound';
    description: string;
    price: number;
    durationMinutes: number;
  }[];
}

export interface AppNotification {
  id: string;
  patientId: string;
  title: string;
  message: string;
  type: 'status_update' | 'reminder' | 'clinic_info' | 'payment' | 'system';
  timestamp: string;
  isRead: boolean;
  appointmentId?: string;
  appointmentCode?: string;
}

export interface RoadmapMilestone {
  id: string;
  phaseNumber: number;
  phaseName: string;
  timeline: string;
  progressPercent: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  deliverables: string[];
  teamLead: string;
  keyOutputs: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  isLowStock: boolean;
  lastRestocked: string;
}

export interface ClinicPaymentRecord {
  id: string;
  invoiceNumber: string;
  patientName: string;
  patientCode: string;
  service: string;
  amount: number;
  status: 'Paid' | 'Pending';
  date: string;
  method: 'Cash' | 'GCash' | 'Maya' | 'PhilHealth';
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Doctor' | 'Receptionist';
  initials: string;
  phone?: string;
}

