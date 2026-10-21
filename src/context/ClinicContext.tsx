import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PatientUser,
  ClinicSettings,
  Appointment,
  AppNotification,
  AppointmentType,
  UltrasoundScanType,
  VisitSummary,
  MedicalRecord,
} from '../types';
import {
  INITIAL_CLINIC_SETTINGS,
  INITIAL_LOGGED_IN_PATIENT,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  PHASE1_EXISTING_PATIENT_REGISTRY,
  INITIAL_MEDICAL_RECORDS,
} from '../data/mockDatabase';
import {
  SmartReminderSettings,
  DEFAULT_SMART_REMINDER_SETTINGS,
  SMART_REMINDER_STORAGE_KEY,
  SENT_REMINDERS_STORAGE_KEY,
  getLocalizedReminderContent,
  dispatchBrowserNotification,
  ReminderLanguage,
} from '../utils/smartReminders';
import {
  auth,
  db,
  googleProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateFirebaseProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  handleFirestoreError,
  OperationType,
  type FirebaseUser,
  type ConfirmationResult,
} from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { formatPhilippinePhoneNumberE164 } from '../utils/phoneFormat';

interface BookAppointmentInput {
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  appointmentType: AppointmentType;
  scanType?: UltrasoundScanType;
  reason: string;
}

export interface RegisterInput {
  fullName: string;
  contactNumber: string;
  email?: string;
  address: string;
  birthday?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  civilStatus?: string;
  matchWithExistingCode?: string;
}

interface ClinicContextType {
  patient: PatientUser | null;
  firebaseUser: FirebaseUser | null;
  isLoggedIn: boolean;
  isAuthReady: boolean;
  clinicSettings: ClinicSettings;
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  notifications: AppNotification[];
  unreadNotifCount: number;
  viewMode: 'mobile-app' | 'staff-portal' | 'thesis-roadmap' | 'auth-preview' | 'playstore-hub';
  deviceFrame: 'ios' | 'android' | 'compact';
  isDeviceFullscreen: boolean;
  setIsDeviceFullscreen: (val: boolean) => void;
  activeTab: 'home' | 'records' | 'appointments' | 'book' | 'clinic' | 'profile' | 'auth';
  setActiveTab: (tab: 'home' | 'records' | 'appointments' | 'book' | 'clinic' | 'profile' | 'auth') => void;
  setViewMode: (mode: 'mobile-app' | 'staff-portal' | 'thesis-roadmap' | 'auth-preview' | 'playstore-hub') => void;
  setDeviceFrame: (frame: 'ios' | 'android' | 'compact') => void;
  
  // Theme & Appearance
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Real Firebase Authentication & OTP methods
  sendPhoneOtp: (phoneNumber: string, containerId?: string) => Promise<{ success: boolean; message: string }>;
  verifyPhoneOtp: (otpCode: string, registrationData?: RegisterInput) => Promise<{ success: boolean; message: string; patient?: PatientUser }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  registerWithEmail: (email: string, pass: string, data: RegisterInput) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  
  // Traditional / Fast-Demo Helpers
  login: (contactNumber: string, pin: string) => { success: boolean; message: string };
  register: (data: RegisterInput) => { success: boolean; isMatched: boolean; patientCode: string; message: string };
  checkExistingMatch: (fullName: string, contactNumber: string) => typeof PHASE1_EXISTING_PATIENT_REGISTRY[0] | null;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<PatientUser>) => Promise<void>;
  
  // Patient Appointment actions
  bookAppointment: (input: BookAppointmentInput) => { success: boolean; appointment?: Appointment; message: string };
  cancelAppointment: (appointmentId: string, reason: string) => { success: boolean; message: string };
  
  // Double booking prevention check (Algorithm 2)
  isSlotAvailable: (date: string, timeSlot: string) => boolean;
  getOccupiedSlotsForDate: (date: string) => string[];
  
  // Staff Portal simulation actions
  staffApproveAppointment: (id: string) => void;
  staffRejectAppointment: (id: string, reason: string) => void;
  staffRescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => void;
  staffCompleteAppointment: (id: string, summary: VisitSummary) => void;
  staffCreateAppointment: (input: {
    patientName: string;
    patientCode: string;
    contactNumber: string;
    date: string;
    timeSlot: string;
    appointmentType: AppointmentType;
    scanType?: UltrasoundScanType;
    reason: string;
  }) => Promise<{ success: boolean; message: string; appointment?: Appointment }>;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => Promise<void>;
  
  // Notifications & Smart Reminders
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendSimulatedPush: (title: string, message: string, type?: AppNotification['type'], appointmentId?: string, appointmentCode?: string) => void;
  smartReminderSettings: SmartReminderSettings;
  updateSmartReminderSettings: (newSettings: Partial<SmartReminderSettings>) => void;
  triggerSmart24hCheck: (forceTest?: boolean, customLang?: ReminderLanguage) => { triggeredCount: number; message: string };

  // Helper
  resetDatabase: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENT: 'mcare_patient_user_v2',
  APPOINTMENTS: 'mcare_appointments_v2',
  NOTIFICATIONS: 'mcare_notifications_v2',
  SETTINGS: 'mcare_clinic_settings_v2',
};

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  const [patient, setPatient] = useState<PatientUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_LOGGED_IN_PATIENT;
  });

  const [clinicSettings] = useState<ClinicSettings>(INITIAL_CLINIC_SETTINGS);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_APPOINTMENTS;
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('mcare_medical_records_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MEDICAL_RECORDS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seenIds = new Set<string>();
          return parsed.map((item, idx) => {
            let id = item.id;
            if (!id || seenIds.has(id)) {
              id = `notif-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;
            }
            seenIds.add(id);
            return { ...item, id };
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [smartReminderSettings, setSmartReminderSettings] = useState<SmartReminderSettings>(() => {
    const saved = localStorage.getItem(SMART_REMINDER_STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_SMART_REMINDER_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SMART_REMINDER_SETTINGS;
  });

  const [viewMode, setViewMode] = useState<'mobile-app' | 'staff-portal' | 'thesis-roadmap' | 'auth-preview' | 'playstore-hub'>('mobile-app');
  const [deviceFrame, setDeviceFrame] = useState<'ios' | 'android' | 'compact'>('ios');
  const [isDeviceFullscreen, setIsDeviceFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'appointments' | 'book' | 'clinic' | 'profile' | 'auth'>('home');

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('mcare_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('mcare_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn('Theme storage sync error:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setIsAuthReady(true);

      if (user) {
        try {
          const patientRef = doc(db, 'patients', user.uid);
          const docSnap = await getDoc(patientRef);
          if (docSnap.exists()) {
            setPatient(docSnap.data() as PatientUser);
          } else {
            // Auto-provision basic profile in Firestore
            const newCode = `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            const newProfile: PatientUser = {
              id: user.uid,
              patientCode: newCode,
              fullName: user.displayName || (user.email ? user.email.split('@')[0] : 'Patient User'),
              contactNumber: user.phoneNumber || '09171234567',
              email: user.email || `${newCode.toLowerCase()}@patient.mcare.ph`,
              address: 'Angeles City, Pampanga',
              emergencyContactName: 'Family Member',
              emergencyContactPhone: '09170000000',
              birthday: '1996-01-01',
              civilStatus: 'Single',
              philhealthNumber: '12-345678901-2',
              isExistingRecordMatched: false,
              registeredDate: new Date().toISOString().split('T')[0],
              avatarUrl: user.photoURL || undefined,
            };
            await setDoc(patientRef, newProfile);
            setPatient(newProfile);
          }
        } catch (e) {
          console.warn('Firestore load patient error:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(SMART_REMINDER_STORAGE_KEY, JSON.stringify(smartReminderSettings));
  }, [smartReminderSettings]);

  useEffect(() => {
    if (patient) {
      localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(patient));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PATIENT);
    }
  }, [patient]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('mcare_medical_records_v2', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Real-time Firestore sync for Appointments (Live sync across phone and web manager)
  useEffect(() => {
    try {
      const apptsCol = collection(db, 'appointments');
      const unsub = onSnapshot(apptsCol, (snapshot) => {
        if (!snapshot.empty) {
          const remoteAppts: Appointment[] = [];
          snapshot.forEach((docSnap) => {
            remoteAppts.push(docSnap.data() as Appointment);
          });
          remoteAppts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setAppointments(remoteAppts);
        } else {
          // Seed initial appointments to Firestore if empty
          INITIAL_APPOINTMENTS.forEach(async (item) => {
            try {
              await setDoc(doc(db, 'appointments', item.id), item);
            } catch (e) {
              console.warn('Seeding appt error:', e);
            }
          });
        }
      }, (err) => {
        console.warn('Firestore appointments onSnapshot error:', err);
      });

      return () => unsub();
    } catch (err) {
      console.warn('Firestore onSnapshot init error:', err);
    }
  }, []);

  // Real-time Firestore sync for Medical Records (Live sync across phone and web manager)
  useEffect(() => {
    try {
      const recordsCol = collection(db, 'medicalRecords');
      const unsub = onSnapshot(recordsCol, (snapshot) => {
        if (!snapshot.empty) {
          const remoteRecords: MedicalRecord[] = [];
          snapshot.forEach((docSnap) => {
            remoteRecords.push(docSnap.data() as MedicalRecord);
          });
          remoteRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setMedicalRecords(remoteRecords);
        } else {
          // Seed initial medical records to Firestore if empty
          INITIAL_MEDICAL_RECORDS.forEach(async (item) => {
            try {
              await setDoc(doc(db, 'medicalRecords', item.id), item);
            } catch (e) {
              console.warn('Seeding record error:', e);
            }
          });
        }
      }, (err) => {
        console.warn('Firestore medicalRecords onSnapshot error:', err);
      });

      return () => unsub();
    } catch (err) {
      console.warn('Firestore onSnapshot records init error:', err);
    }
  }, []);

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  // Algorithm 2: Server-side double booking prevention check
  const isSlotAvailable = (date: string, timeSlot: string): boolean => {
    const conflict = appointments.some(
      (a) =>
        a.date === date &&
        a.timeSlot === timeSlot &&
        (a.status === 'Pending' || a.status === 'Approved')
    );
    return !conflict;
  };

  const getOccupiedSlotsForDate = (date: string): string[] => {
    return appointments
      .filter(
        (a) =>
          a.date === date &&
          (a.status === 'Pending' || a.status === 'Approved')
      )
      .map((a) => a.timeSlot);
  };

  // Check matching against existing Phase 1 clinic database
  const checkExistingMatch = (fullName: string, contactNumber: string) => {
    const cleanedContact = contactNumber.replace(/\D/g, '');
    const cleanedName = fullName.toLowerCase().trim();

    const match = PHASE1_EXISTING_PATIENT_REGISTRY.find((p) => {
      const dbContact = p.contactNumber.replace(/\D/g, '');
      const dbName = p.fullName.toLowerCase().trim();
      return (
        dbContact === cleanedContact ||
        dbName === cleanedName ||
        (dbName.includes(cleanedName) && cleanedName.length > 5)
      );
    });

    return match || null;
  };

  // Setup reCAPTCHA for real SMS OTP
  const setupRecaptcha = (containerId: string = 'recaptcha-container') => {
    if (typeof window === 'undefined') return null;

    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } catch (e) {
      console.warn('Error clearing recaptcha:', e);
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`reCAPTCHA container #${containerId} not found in DOM`);
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        console.warn('reCAPTCHA expired');
      },
    });

    return window.recaptchaVerifier;
  };

  // REAL SMS OTP DISPATCH
  const sendPhoneOtp = async (
    phoneNumber: string,
    containerId: string = 'recaptcha-container'
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const formatted = formatPhilippinePhoneNumberE164(phoneNumber);
      const appVerifier = setupRecaptcha(containerId);
      if (!appVerifier) {
        return { success: false, message: 'Could not initialize reCAPTCHA security verifier.' };
      }

      const confirmationResult = await signInWithPhoneNumber(auth, formatted, appVerifier);
      window.confirmationResult = confirmationResult;

      return {
        success: true,
        message: `Real 6-digit SMS OTP dispatched to ${formatted}. Please check your phone.`,
      };
    } catch (error: any) {
      console.error('sendPhoneOtp error:', error);
      let msg = error?.message || 'Failed to dispatch SMS OTP.';
      if (error?.code === 'auth/invalid-phone-number') {
        msg = 'Invalid Philippine mobile number format. Please check your number.';
      } else if (error?.code === 'auth/quota-exceeded' || error?.code === 'auth/too-many-requests') {
        msg = 'SMS request quota exceeded for this number. Please wait a moment or sign in with Email.';
      } else if (error?.code === 'auth/captcha-check-failed') {
        msg = 'reCAPTCHA verification failed. Please try again.';
      }
      return { success: false, message: msg };
    }
  };

  // REAL OTP CONFIRMATION & AUTHENTICATION
  const verifyPhoneOtp = async (
    otpCode: string,
    registrationData?: RegisterInput
  ): Promise<{ success: boolean; message: string; patient?: PatientUser }> => {
    try {
      if (!window.confirmationResult) {
        return { success: false, message: 'No active OTP verification session found. Please request a new code.' };
      }

      const userCredential = await window.confirmationResult.confirm(otpCode.trim());
      const user = userCredential.user;

      // Check / update Firestore patient document
      const patientRef = doc(db, 'patients', user.uid);
      let patientData: PatientUser;

      try {
        const docSnap = await getDoc(patientRef);
        if (docSnap.exists()) {
          patientData = docSnap.data() as PatientUser;
        } else {
          const match = registrationData?.fullName
            ? checkExistingMatch(registrationData.fullName, user.phoneNumber || registrationData.contactNumber)
            : null;
          const isMatched = !!match;
          const patientCode = isMatched
            ? match!.patientCode
            : `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

          patientData = {
            id: user.uid,
            patientCode,
            fullName: registrationData?.fullName || user.displayName || 'M-Care Patient',
            contactNumber: user.phoneNumber || registrationData?.contactNumber || '09170000000',
            email: user.email || registrationData?.email || `${patientCode.toLowerCase()}@patient.mcare.ph`,
            address: registrationData?.address || 'Angeles City, Pampanga',
            emergencyContactName: registrationData?.emergencyContactName || 'Family Contact',
            emergencyContactPhone: registrationData?.emergencyContactPhone || '09170000000',
            birthday: registrationData?.birthday || '1996-01-01',
            civilStatus: registrationData?.civilStatus || 'Single',
            philhealthNumber: '12-345678901-2',
            isExistingRecordMatched: isMatched,
            registeredDate: new Date().toISOString().split('T')[0],
            avatarUrl: user.photoURL || undefined,
          };
          await setDoc(patientRef, patientData);
        }
      } catch (e) {
        console.warn('Firestore sync fallback:', e);
        patientData = {
          id: user.uid,
          patientCode: `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          fullName: registrationData?.fullName || user.displayName || 'M-Care Patient',
          contactNumber: user.phoneNumber || registrationData?.contactNumber || '09170000000',
          email: user.email || registrationData?.email || 'patient@mcare.ph',
          address: registrationData?.address || 'Angeles City, Pampanga',
          emergencyContactName: 'Family Member',
          emergencyContactPhone: '09170000000',
          birthday: '1996-01-01',
          civilStatus: 'Single',
          isExistingRecordMatched: false,
          registeredDate: new Date().toISOString().split('T')[0],
        };
      }

      setPatient(patientData);
      sendSimulatedPush(
        'Phone OTP Verified 🛡️',
        `Authenticated successfully via real SMS OTP. Welcome, ${patientData.fullName}!`,
        'system'
      );

      return {
        success: true,
        message: `Welcome back, ${patientData.fullName}!`,
        patient: patientData,
      };
    } catch (error: any) {
      console.error('verifyPhoneOtp error:', error);
      let msg = error?.message || 'OTP verification failed.';
      if (error?.code === 'auth/invalid-verification-code') {
        msg = 'Incorrect 6-digit OTP code. Please check your SMS and try again.';
      } else if (error?.code === 'auth/code-expired') {
        msg = 'The SMS verification code has expired. Please request a new code.';
      }
      return { success: false, message: msg };
    }
  };

  // REAL EMAIL & PASSWORD LOGIN
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;

      try {
        const patientRef = doc(db, 'patients', user.uid);
        const docSnap = await getDoc(patientRef);
        if (docSnap.exists()) {
          setPatient(docSnap.data() as PatientUser);
        } else {
          const newPatient: PatientUser = {
            id: user.uid,
            patientCode: `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            fullName: user.displayName || email.split('@')[0],
            contactNumber: user.phoneNumber || '09171234567',
            email: user.email || email,
            address: 'Angeles City, Pampanga',
            emergencyContactName: 'Family Contact',
            emergencyContactPhone: '09170000000',
            birthday: '1996-01-01',
            civilStatus: 'Married',
            isExistingRecordMatched: false,
            registeredDate: new Date().toISOString().split('T')[0],
          };
          await setDoc(patientRef, newPatient);
          setPatient(newPatient);
        }
      } catch (err) {
        console.warn('Firestore user fetch:', err);
      }

      sendSimulatedPush(
        'Signed In 🛡️',
        `Authenticated with Firebase (${email}).`,
        'system'
      );
      return { success: true, message: 'Logged in successfully via Firebase Auth.' };
    } catch (error: any) {
      console.error('loginWithEmail error:', error);
      let msg = error?.message || 'Sign in failed.';
      if (
        error?.code === 'auth/user-not-found' ||
        error?.code === 'auth/wrong-password' ||
        error?.code === 'auth/invalid-credential'
      ) {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (error?.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      return { success: false, message: msg };
    }
  };

  // REAL EMAIL & PASSWORD REGISTRATION
  const registerWithEmail = async (
    email: string,
    pass: string,
    data: RegisterInput
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;

      await updateFirebaseProfile(user, { displayName: data.fullName });

      const match = data.fullName ? checkExistingMatch(data.fullName, data.contactNumber) : null;
      const isMatched = !!match;
      const patientCode = isMatched ? match!.patientCode : `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newPatient: PatientUser = {
        id: user.uid,
        patientCode,
        fullName: data.fullName,
        contactNumber: data.contactNumber,
        email: user.email || email,
        address: data.address || 'Angeles City, Pampanga',
        emergencyContactName: data.emergencyContactName || 'Family Contact',
        emergencyContactPhone: data.emergencyContactPhone || '09170000000',
        birthday: data.birthday || '1996-01-01',
        civilStatus: data.civilStatus || 'Single',
        philhealthNumber: '12-345678901-2',
        isExistingRecordMatched: isMatched,
        registeredDate: new Date().toISOString().split('T')[0],
      };

      try {
        await setDoc(doc(db, 'patients', user.uid), newPatient);
      } catch (err) {
        console.warn('Firestore profile save:', err);
      }

      setPatient(newPatient);

      sendSimulatedPush(
        'Account Registered & Authenticated 🎉',
        `Welcome to M-Care Balibago! Your Patient Code is ${patientCode}.`,
        'system'
      );
      return { success: true, message: `Account created for ${data.fullName}!` };
    } catch (error: any) {
      console.error('registerWithEmail error:', error);
      let msg = error?.message || 'Registration failed.';
      if (error?.code === 'auth/email-already-in-use') {
        msg = 'This email address is already registered. Please sign in instead.';
      } else if (error?.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      return { success: false, message: msg };
    }
  };

  // REAL GOOGLE AUTHENTICATION
  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const patientRef = doc(db, 'patients', user.uid);
      let patientData: PatientUser;

      try {
        const docSnap = await getDoc(patientRef);
        if (docSnap.exists()) {
          patientData = docSnap.data() as PatientUser;
        } else {
          const patientCode = `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          patientData = {
            id: user.uid,
            patientCode,
            fullName: user.displayName || 'Google User',
            contactNumber: user.phoneNumber || '09171234567',
            email: user.email || `${patientCode.toLowerCase()}@patient.mcare.ph`,
            address: 'Angeles City, Pampanga',
            emergencyContactName: 'Family Member',
            emergencyContactPhone: '09170000000',
            birthday: '1996-01-01',
            civilStatus: 'Single',
            philhealthNumber: '12-345678901-2',
            isExistingRecordMatched: false,
            registeredDate: new Date().toISOString().split('T')[0],
            avatarUrl: user.photoURL || undefined,
          };
          await setDoc(patientRef, patientData);
        }
      } catch (e) {
        patientData = {
          id: user.uid,
          patientCode: `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          fullName: user.displayName || 'Google User',
          contactNumber: user.phoneNumber || '09171234567',
          email: user.email || 'patient@mcare.ph',
          address: 'Angeles City, Pampanga',
          emergencyContactName: 'Family Contact',
          emergencyContactPhone: '09170000000',
          birthday: '1996-01-01',
          civilStatus: 'Single',
          isExistingRecordMatched: false,
          registeredDate: new Date().toISOString().split('T')[0],
          avatarUrl: user.photoURL || undefined,
        };
      }

      setPatient(patientData);
      sendSimulatedPush(
        'Google Authentication Successful 🛡️',
        `Logged in via Google (${user.email}).`,
        'system'
      );
      return { success: true, message: `Signed in as ${patientData.fullName}!` };
    } catch (error: any) {
      console.error('loginWithGoogle error:', error);
      let msg = error?.message || 'Google sign-in failed.';
      if (error?.code === 'auth/popup-closed-by-user') {
        msg = 'Google sign-in was cancelled.';
      }
      return { success: false, message: msg };
    }
  };

  // REAL PASSWORD RESET
  const sendPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true, message: `Password reset email dispatched to ${email}. Please check your inbox.` };
    } catch (error: any) {
      console.error('sendPasswordReset error:', error);
      let msg = error?.message || 'Failed to dispatch password reset email.';
      if (error?.code === 'auth/user-not-found') {
        msg = 'No registered user found with this email address.';
      }
      return { success: false, message: msg };
    }
  };

  // FALLBACK LOCAL LOGIN / DEMO FILL
  const login = (contactNumber: string, pin: string) => {
    const cleaned = contactNumber.replace(/\D/g, '');
    if (!cleaned) {
      return { success: false, message: 'Please provide a valid Philippine mobile number.' };
    }

    const match = PHASE1_EXISTING_PATIENT_REGISTRY.find(
      (p) => p.contactNumber.replace(/\D/g, '') === cleaned
    );

    if (match) {
      const restoredUser: PatientUser = {
        id: 'usr-pat-' + match.patientCode.toLowerCase().replace('-', ''),
        patientCode: match.patientCode,
        fullName: match.fullName,
        contactNumber: match.contactNumber,
        email: match.fullName.toLowerCase().replace(/\s+/g, '.') + '@gmail.com',
        address: match.address,
        emergencyContactName: match.emergencyContactName,
        emergencyContactPhone: match.emergencyContactPhone,
        birthday: match.birthday,
        civilStatus: 'Married',
        philhealthNumber: '12-098471625-1',
        isExistingRecordMatched: true,
        registeredDate: '2024-03-12',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      };
      setPatient(restoredUser);
      sendSimulatedPush(
        'Welcome Back, ' + match.fullName.split(' ')[0] + '!',
        `Logged in successfully. Linked with existing clinic record ${match.patientCode}.`,
        'system'
      );
      return { success: true, message: `Welcome back, ${match.fullName}!` };
    }

    const defaultUser: PatientUser = {
      ...INITIAL_LOGGED_IN_PATIENT,
      contactNumber: contactNumber,
    };
    setPatient(defaultUser);
    return { success: true, message: 'Signed in successfully.' };
  };

  const register = (data: RegisterInput) => {
    const matchedRecord = data.matchWithExistingCode
      ? PHASE1_EXISTING_PATIENT_REGISTRY.find((p) => p.patientCode === data.matchWithExistingCode)
      : checkExistingMatch(data.fullName, data.contactNumber);

    const isMatched = !!matchedRecord;
    const generatedCode = isMatched
      ? matchedRecord!.patientCode
      : `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: PatientUser = {
      id: `usr-pat-${Date.now()}`,
      patientCode: generatedCode,
      fullName: data.fullName,
      contactNumber: data.contactNumber,
      email: data.email || `${data.fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      address: data.address || 'Angeles City, Pampanga',
      emergencyContactName: data.emergencyContactName || 'Family Contact',
      emergencyContactPhone: data.emergencyContactPhone || '09170000000',
      birthday: data.birthday || '1996-01-01',
      civilStatus: data.civilStatus || 'Single',
      philhealthNumber: '12-345678901-2',
      isExistingRecordMatched: isMatched,
      registeredDate: new Date().toISOString().split('T')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    setPatient(newUser);

    sendSimulatedPush(
      isMatched ? 'Account Linked with Existing Record' : 'M-Care Account Created',
      isMatched
        ? `Successfully connected to your historical clinic record (${generatedCode}).`
        : `Welcome to M-Care! Your unique Patient ID is ${generatedCode}.`,
      'system'
    );

    return {
      success: true,
      isMatched,
      patientCode: generatedCode,
      message: isMatched
        ? `Matched existing clinic record (${generatedCode})! Duplicate creation prevented.`
        : `New patient record ${generatedCode} initialized successfully.`,
    };
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setPatient(null);
    setFirebaseUser(null);
    setActiveTab('home');
  };

  const updateProfile = async (data: Partial<PatientUser>) => {
    if (!patient) return;
    const updated = { ...patient, ...data };
    setPatient(updated);

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'patients', firebaseUser.uid), data);
      } catch (err) {
        console.warn('Firestore updateProfile err:', err);
      }
    }
    sendSimulatedPush('Profile Updated', 'Your contact and profile details have been saved.', 'system');
  };

  const bookAppointment = (input: BookAppointmentInput) => {
    if (!patient) {
      return { success: false, message: 'Please log in to schedule an appointment.' };
    }

    // Enforce Algorithm 2 double-booking verification
    if (!isSlotAvailable(input.date, input.timeSlot)) {
      return {
        success: false,
        message: `The selected time slot (${input.timeSlot} on ${input.date}) is already occupied. Please select another slot.`,
      };
    }

    const serviceFee = input.appointmentType === 'Ultrasound' ? 1400 : 600;
    const serviceItemDesc =
      input.appointmentType === 'Ultrasound'
        ? input.scanType || 'Ultrasound Examination'
        : 'OB-GYNE Medical Consultation';

    const newAppointmentCode = `AP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppt: Appointment = {
      id: `apt-${Date.now()}`,
      appointmentCode: newAppointmentCode,
      patientId: patient.id,
      patientCode: patient.patientCode,
      patientName: patient.fullName,
      contactNumber: patient.contactNumber,
      date: input.date,
      timeSlot: input.timeSlot,
      appointmentType: input.appointmentType,
      scanType: input.scanType,
      reason: input.reason || 'General check-up / scan request',
      status: 'Pending',
      attendingDoctor: clinicSettings.doctorName + ', ' + clinicSettings.doctorCredentials,
      payment: {
        id: `pay-${Date.now()}`,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: serviceFee,
        balance: serviceFee,
        status: 'Pending',
        items: [{ description: serviceItemDesc, price: serviceFee }],
      },
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppt, ...prev]);

    // Save to Firestore if available
    try {
      setDoc(doc(db, 'appointments', newAppt.id), newAppt);
    } catch (e) {
      console.warn('Firestore appointment save:', e);
    }

    sendSimulatedPush(
      'Booking Request Submitted',
      `Your request ${newAppt.appointmentCode} for ${input.date} at ${input.timeSlot} is Pending staff confirmation.`,
      'status_update',
      newAppt.id,
      newAppt.appointmentCode
    );

    return {
      success: true,
      appointment: newAppt,
      message: `Appointment request ${newAppointmentCode} submitted successfully! It is now pending staff review.`,
    };
  };

  const cancelAppointment = (appointmentId: string, reason: string) => {
    let cancelledCode = '';
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === appointmentId) {
          cancelledCode = a.appointmentCode;
          return {
            ...a,
            status: 'Cancelled',
            cancellationReason: reason,
          };
        }
        return a;
      })
    );

    try {
      updateDoc(doc(db, 'appointments', appointmentId), {
        status: 'Cancelled',
        cancellationReason: reason,
      });
    } catch (e) {
      console.warn('Firestore cancel appointment update:', e);
    }

    sendSimulatedPush(
      'Appointment Cancelled',
      `Appointment ${cancelledCode} has been cancelled per your request. The slot has been released back to clinic availability.`,
      'status_update',
      appointmentId,
      cancelledCode
    );

    return { success: true, message: `Appointment ${cancelledCode} was cancelled.` };
  };

  // Staff simulation functions
  const staffApproveAppointment = async (id: string) => {
    let targetCode = '';
    let apptDate = '';
    let apptTime = '';

    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          targetCode = a.appointmentCode;
          apptDate = a.date;
          apptTime = a.timeSlot;
          return { ...a, status: 'Approved' };
        }
        return a;
      })
    );

    try {
      await updateDoc(doc(db, 'appointments', id), { status: 'Approved' });
    } catch (e) {
      console.warn('Firestore approve appt update error:', e);
    }

    sendSimulatedPush(
      'Appointment Confirmed! 🩺',
      `Great news! Your appointment ${targetCode} for ${apptDate} at ${apptTime} has been Approved by M-Care Clinic Receptionist.`,
      'status_update',
      id,
      targetCode
    );
  };

  const staffRejectAppointment = async (id: string, reason: string) => {
    let targetCode = '';
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          targetCode = a.appointmentCode;
          return { ...a, status: 'Rejected', rejectionReason: reason };
        }
        return a;
      })
    );

    try {
      await updateDoc(doc(db, 'appointments', id), { status: 'Rejected', rejectionReason: reason });
    } catch (e) {
      console.warn('Firestore reject appt update error:', e);
    }

    sendSimulatedPush(
      'Appointment Update: Rejected',
      `Appointment ${targetCode} could not be accommodated. Reason: "${reason}". Please choose another available date.`,
      'status_update',
      id,
      targetCode
    );
  };

  const staffRescheduleAppointment = async (id: string, newDate: string, newTimeSlot: string) => {
    let targetCode = '';
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          targetCode = a.appointmentCode;
          return { ...a, date: newDate, timeSlot: newTimeSlot, status: 'Approved' };
        }
        return a;
      })
    );

    try {
      await updateDoc(doc(db, 'appointments', id), { date: newDate, timeSlot: newTimeSlot, status: 'Approved' });
    } catch (e) {
      console.warn('Firestore reschedule appt update error:', e);
    }

    sendSimulatedPush(
      'Appointment Rescheduled',
      `Your appointment ${targetCode} has been moved to ${newDate} at ${newTimeSlot} by clinic staff.`,
      'status_update',
      id,
      targetCode
    );
  };

  const staffCompleteAppointment = async (id: string, summary: VisitSummary) => {
    let targetCode = '';
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          targetCode = a.appointmentCode;
          return {
            ...a,
            status: 'Completed',
            visitSummary: summary,
            payment: {
              ...a.payment,
              status: 'Paid',
              balance: 0,
              paidAt: new Date().toISOString(),
            },
          };
        }
        return a;
      })
    );

    try {
      await updateDoc(doc(db, 'appointments', id), {
        status: 'Completed',
        visitSummary: summary,
        'payment.status': 'Paid',
        'payment.balance': 0,
        'payment.paidAt': new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Firestore complete appt update error:', e);
    }

    sendSimulatedPush(
      'Visit Summary Ready ✨',
      `Your consultation for ${targetCode} is complete. You can now view your high-level visit summary in the app.`,
      'status_update',
      id,
      targetCode
    );
  };

  const staffCreateAppointment = async (input: {
    patientName: string;
    patientCode: string;
    contactNumber: string;
    date: string;
    timeSlot: string;
    appointmentType: AppointmentType;
    scanType?: UltrasoundScanType;
    reason: string;
  }): Promise<{ success: boolean; message: string; appointment?: Appointment }> => {
    const serviceFee = input.appointmentType === 'Ultrasound' ? 1400 : 600;
    const newCode = `AP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppt: Appointment = {
      id: `apt-${Date.now()}`,
      appointmentCode: newCode,
      patientId: `pat-${input.patientCode.toLowerCase()}`,
      patientCode: input.patientCode,
      patientName: input.patientName,
      contactNumber: input.contactNumber,
      date: input.date,
      timeSlot: input.timeSlot,
      appointmentType: input.appointmentType,
      scanType: input.scanType,
      reason: input.reason || 'Staff scheduled appointment',
      status: 'Approved',
      attendingDoctor: clinicSettings.doctorName + ', ' + clinicSettings.doctorCredentials,
      payment: {
        id: `pay-${Date.now()}`,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: serviceFee,
        balance: serviceFee,
        status: 'Pending',
        items: [{ description: input.scanType || input.appointmentType, price: serviceFee }],
      },
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppt, ...prev]);

    try {
      await setDoc(doc(db, 'appointments', newAppt.id), newAppt);
    } catch (e) {
      console.warn('Firestore create appointment:', e);
    }

    sendSimulatedPush(
      'Appointment Confirmed 🩺',
      `Staff scheduled your visit ${newCode} on ${input.date} at ${input.timeSlot}.`,
      'status_update',
      newAppt.id,
      newCode
    );

    return { success: true, message: `Appointment ${newCode} created successfully!`, appointment: newAppt };
  };

  const addMedicalRecord = async (recordInput: Omit<MedicalRecord, 'id'>) => {
    const newId = `med-${Date.now()}`;
    const newRecord: MedicalRecord = {
      ...recordInput,
      id: newId,
    };

    setMedicalRecords((prev) => [newRecord, ...prev]);

    try {
      await setDoc(doc(db, 'medicalRecords', newId), newRecord);
    } catch (e) {
      console.warn('Failed to save medical record to Firestore:', e);
    }

    sendSimulatedPush(
      'New Diagnostic Record Added',
      `Dr. Bernice D. Paule has filed a new ${newRecord.recordType} on your electronic chart.`,
      'status_update'
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const sendSimulatedPush = (
    title: string,
    message: string,
    type: AppNotification['type'] = 'status_update',
    appointmentId?: string,
    appointmentCode?: string
  ) => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 5);
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${uniqueSuffix}`,
      patientId: patient?.id || 'usr-pat-01',
      title,
      message,
      type,
      timestamp: 'Just now',
      isRead: false,
      appointmentId,
      appointmentCode,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateSmartReminderSettings = (newSettings: Partial<SmartReminderSettings>) => {
    setSmartReminderSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const triggerSmart24hCheck = (
    forceTest: boolean = false,
    customLang?: ReminderLanguage
  ): { triggeredCount: number; message: string } => {
    if (!smartReminderSettings.enabled && !forceTest) {
      return { triggeredCount: 0, message: 'Smart reminders are currently disabled.' };
    }

    const lang = customLang || smartReminderSettings.language;
    const activeAppts = appointments.filter(
      (a) => a.status === 'Approved' || a.status === 'Pending'
    );

    if (activeAppts.length === 0) {
      return { triggeredCount: 0, message: 'No upcoming appointments found.' };
    }

    let sentIds: string[] = [];
    try {
      const stored = localStorage.getItem(SENT_REMINDERS_STORAGE_KEY);
      if (stored) sentIds = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    let count = 0;
    const now = new Date();

    if (forceTest) {
      const targetAppt = activeAppts[0];
      const { title, body } = getLocalizedReminderContent(targetAppt, clinicSettings, lang);
      sendSimulatedPush(title, body, 'reminder', targetAppt.id, targetAppt.appointmentCode);
      dispatchBrowserNotification(title, body, `mcare-appt-${targetAppt.id}-${Date.now()}`);
      return {
        triggeredCount: 1,
        message: `Dispatched 24h reminder for ${targetAppt.appointmentCode || 'appointment'} (${lang.toUpperCase()}).`,
      };
    }

    activeAppts.forEach((appt) => {
      const apptDate = new Date(`${appt.date}T12:00:00`);
      const diffHours = (apptDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffHours > -12 && diffHours <= 48 && !sentIds.includes(appt.id)) {
        const { title, body } = getLocalizedReminderContent(appt, clinicSettings, lang);
        sendSimulatedPush(title, body, 'reminder', appt.id, appt.appointmentCode);
        dispatchBrowserNotification(title, body, `mcare-appt-${appt.id}`);
        sentIds.push(appt.id);
        count++;
      }
    });

    if (count > 0) {
      localStorage.setItem(SENT_REMINDERS_STORAGE_KEY, JSON.stringify(sentIds));
    }

    return {
      triggeredCount: count,
      message:
        count > 0
          ? `Dispatched ${count} localized 24h pre-visit smart reminder(s).`
          : 'All upcoming appointments are up to date.',
    };
  };

  useEffect(() => {
    if (smartReminderSettings.enabled) {
      triggerSmart24hCheck(false);
    }
  }, [smartReminderSettings.enabled, appointments.length]);

  const resetDatabase = () => {
    setPatient(INITIAL_LOGGED_IN_PATIENT);
    setAppointments(INITIAL_APPOINTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.PATIENT);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(SENT_REMINDERS_STORAGE_KEY);
    localStorage.removeItem(SMART_REMINDER_STORAGE_KEY);
  };

  return (
    <ClinicContext.Provider
      value={{
        patient,
        firebaseUser,
        isLoggedIn: !!patient,
        isAuthReady,
        clinicSettings,
        appointments,
        medicalRecords,
        notifications,
        unreadNotifCount,
        viewMode,
        deviceFrame,
        isDeviceFullscreen,
        setIsDeviceFullscreen,
        activeTab,
        theme,
        toggleTheme,
        setTheme,
        setActiveTab,
        setViewMode,
        setDeviceFrame,
        sendPhoneOtp,
        verifyPhoneOtp,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        sendPasswordReset,
        login,
        register,
        checkExistingMatch,
        logout,
        updateProfile,
        bookAppointment,
        cancelAppointment,
        isSlotAvailable,
        getOccupiedSlotsForDate,
        staffApproveAppointment,
        staffRejectAppointment,
        staffRescheduleAppointment,
        staffCompleteAppointment,
        staffCreateAppointment,
        addMedicalRecord,
        markNotificationRead,
        markAllNotificationsRead,
        sendSimulatedPush,
        smartReminderSettings,
        updateSmartReminderSettings,
        triggerSmart24hCheck,
        resetDatabase,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
