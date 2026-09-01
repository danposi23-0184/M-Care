/**
 * Formats a Philippine mobile number into E.164 standard (+639XXXXXXXXX)
 * for Firebase Phone Auth and SMS OTP dispatch.
 */
export function formatPhilippinePhoneNumberE164(input: string): string {
  let cleaned = input.trim().replace(/[\s\-\(\)]/g, '');

  if (cleaned.startsWith('+63')) {
    return cleaned;
  }

  if (cleaned.startsWith('63')) {
    return `+${cleaned}`;
  }

  if (cleaned.startsWith('09')) {
    return `+63${cleaned.substring(1)}`;
  }

  if (cleaned.startsWith('9') && cleaned.length === 10) {
    return `+63${cleaned}`;
  }

  // Fallback if international format is already present or custom
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  return `+63${cleaned.replace(/^0+/, '')}`;
}

/**
 * Pretty-print a phone number for UI display
 */
export function formatPhoneDisplay(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('639') && digits.length === 12) {
    return `+63 ${digits.substring(2, 5)} ${digits.substring(5, 8)} ${digits.substring(8)}`;
  }
  if (digits.startsWith('09') && digits.length === 11) {
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
  }
  return input;
}
