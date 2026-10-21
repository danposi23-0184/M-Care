import { Appointment, ClinicSettings } from '../types';

export type ReminderLanguage = 'en' | 'fil' | 'pam';

export interface SmartReminderSettings {
  enabled: boolean;
  leadTimeHours: 24 | 12 | 2;
  language: ReminderLanguage;
  soundEnabled: boolean;
  lastCheckedTimestamp?: number;
}

export const DEFAULT_SMART_REMINDER_SETTINGS: SmartReminderSettings = {
  enabled: true,
  leadTimeHours: 24,
  language: 'en',
  soundEnabled: true,
};

export const SMART_REMINDER_STORAGE_KEY = 'mcare_smart_reminders_config_v1';
export const SENT_REMINDERS_STORAGE_KEY = 'mcare_sent_smart_reminder_ids_v1';

/**
 * Get localized 24h pre-visit notification content
 */
export function getLocalizedReminderContent(
  appointment: Appointment,
  clinicSettings: ClinicSettings,
  language: ReminderLanguage = 'en'
): { title: string; body: string; prepNotes: string } {
  const doctorName = appointment.attendingDoctor || clinicSettings.doctorName || 'Dr. Bernice D. Paule';
  const serviceName =
    appointment.appointmentType === 'Ultrasound'
      ? appointment.scanType || 'Ultrasound Examination'
      : 'Prenatal OB-GYNE Consult';

  const timeFormatted = appointment.timeSlot;
  const dateFormatted = new Date(appointment.date).toLocaleDateString(
    language === 'fil' ? 'fil-PH' : 'en-US',
    {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }
  );

  let prepNotes = '';
  if (appointment.appointmentType === 'Ultrasound') {
    if (appointment.scanType?.includes('Transvaginal') || appointment.scanType?.includes('TVS')) {
      prepNotes =
        language === 'fil'
          ? 'Paalala: Mag-empty ng pantog bago ang TVS scan.'
          : language === 'pam'
          ? 'Paalala: Mag-bawas pantog bayu ing TVS ultrasound.'
          : 'Prep: Empty your bladder immediately before the TVS scan.';
    } else {
      prepNotes =
        language === 'fil'
          ? 'Paalala: Uminom ng 4-6 basong tubig 1 oras bago ang scan at huwag munang umihi.'
          : language === 'pam'
          ? 'Paalala: Minum 4-6 basung danum 1 oras bayu ing scan at e pa miihi.'
          : 'Prep: Drink 4–6 glasses of water 1 hour before scan and hold bladder.';
    }
  } else {
    prepNotes =
      language === 'fil'
        ? 'Paalala: Dalhin ang inyong prenatal record booklet at valid ID.'
        : language === 'pam'
        ? 'Paalala: Dalan ing kekayung prenatal booklet at valid ID.'
        : 'Prep: Please bring your prenatal record booklet and a valid ID.';
  }

  switch (language) {
    case 'fil':
      return {
        title: `M-Care Balibago: Paalala sa Pagbisita Bukas ⏰`,
        body: `Kumusta! Ang inyong ${serviceName} kay ${doctorName} ay nakatakda bukas (${dateFormatted} sa ganap na ${timeFormatted}). ${prepNotes}`,
        prepNotes,
      };

    case 'pam':
      return {
        title: `M-Care Balibago: Paalala keng Appointment Bukas ⏰`,
        body: `Mayap a aldo! Ing kekayung ${serviceName} kang ${doctorName} bukas ne (${dateFormatted}, ${timeFormatted}). ${prepNotes}`,
        prepNotes,
      };

    case 'en':
    default:
      return {
        title: `M-Care Clinic: 24h Visit Reminder ⏰`,
        body: `Reminder: Your ${serviceName} with ${doctorName} is scheduled for tomorrow (${dateFormatted} at ${timeFormatted}) at Balibago Branch. ${prepNotes}`,
        prepNotes,
      };
  }
}

/**
 * Request native browser notification permission safely
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.warn('Browser notification permission request error:', error);
    return 'denied';
  }
}

/**
 * Dispatch a native browser notification if allowed
 */
export function dispatchBrowserNotification(
  title: string,
  body: string,
  tag: string = 'mcare-reminder'
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag,
        badge: '/favicon.ico',
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      return true;
    } catch (e) {
      console.warn('Native notification display failed:', e);
      return false;
    }
  }

  return false;
}
