import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  Phone,
  User,
  ArrowRight,
  Stethoscope,
  ChevronLeft,
  Loader2,
  RefreshCw,
  MessageSquare,
  KeyRound,
  Globe,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { formatPhilippinePhoneNumberE164, formatPhoneDisplay } from '../../utils/phoneFormat';

interface AuthScreenProps {
  initialMode?: 'phone' | 'email' | 'register';
  onClose?: () => void;
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'phone',
  onClose,
  onSuccess,
}) => {
  const {
    sendPhoneOtp,
    verifyPhoneOtp,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    login,
    register,
    checkExistingMatch,
  } = useClinic();

  const [authTab, setAuthTab] = useState<'phone' | 'email' | 'register'>(initialMode);

  // Phone OTP States
  const [phoneNumber, setPhoneNumber] = useState('09171234567');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Email Sign In States
  const [loginEmail, setLoginEmail] = useState('maria.rodriguez@gmail.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

  // Registration Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regMethod, setRegMethod] = useState<'phone-otp' | 'email-pass'>('phone-otp');
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);

  // Forgot Password Dialog
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  // Social Auth Loading
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Feedback Notification Banner
  const [feedback, setFeedback] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  // OTP Input Ref for Auto Focus
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Timer countdown for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Focus OTP input when step changes
  useEffect(() => {
    if (isOtpSent && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [isOtpSent]);

  // Matched candidate in local registry
  const matchedCandidate =
    authTab === 'register' && regFullName.length > 2
      ? checkExistingMatch(regFullName, regPhone)
      : null;

  // 1. Send Phone OTP
  const handleSendPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFeedback(null);

    const formatted = formatPhilippinePhoneNumberE164(phoneNumber);
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      setFeedback({ text: 'Please enter a valid 10 or 11-digit Philippine mobile number.', type: 'error' });
      return;
    }

    setIsSendingOtp(true);
    const result = await sendPhoneOtp(formatted, 'recaptcha-container');
    setIsSendingOtp(false);

    if (result.success) {
      setIsOtpSent(true);
      setResendCountdown(60);
      setFeedback({ text: result.message, type: 'success' });
    } else {
      setFeedback({ text: result.message, type: 'error' });
    }
  };

  // 2. Verify Phone OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setFeedback({ text: 'Please enter the 6-digit OTP verification code received via SMS.', type: 'error' });
      return;
    }

    setIsVerifyingOtp(true);
    const regData = authTab === 'register' ? {
      fullName: regFullName || 'M-Care Patient',
      contactNumber: regPhone || phoneNumber,
      email: regEmail,
      address: 'Angeles City, Pampanga',
    } : undefined;

    const result = await verifyPhoneOtp(otpCode.trim(), regData);
    setIsVerifyingOtp(false);

    if (result.success) {
      setFeedback({ text: result.message, type: 'success' });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 700);
    } else {
      setFeedback({ text: result.message, type: 'error' });
    }
  };

  // 3. Email & Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setFeedback({ text: 'Please enter both your email address and password.', type: 'error' });
      return;
    }

    setIsEmailSubmitting(true);
    const res = await loginWithEmail(loginEmail, loginPassword);
    setIsEmailSubmitting(false);

    if (res.success) {
      setFeedback({ text: res.message, type: 'success' });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 700);
    } else {
      setFeedback({ text: res.message, type: 'error' });
    }
  };

  // 4. Email Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim()) {
      setFeedback({ text: 'Please enter your complete full name.', type: 'error' });
      return;
    }

    if (regMethod === 'phone-otp') {
      setPhoneNumber(regPhone);
      await handleSendPhoneOtp();
      return;
    }

    if (!regEmail.trim() || !regPassword.trim()) {
      setFeedback({ text: 'Please provide both an email address and a secure password.', type: 'error' });
      return;
    }

    setIsRegSubmitting(true);
    const res = await registerWithEmail(regEmail, regPassword, {
      fullName: regFullName,
      contactNumber: regPhone || '09170000000',
      email: regEmail,
      address: 'Angeles City, Pampanga',
      matchWithExistingCode: matchedCandidate ? matchedCandidate.patientCode : undefined,
    });
    setIsRegSubmitting(false);

    if (res.success) {
      setFeedback({ text: res.message, type: 'success' });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 700);
    } else {
      setFeedback({ text: res.message, type: 'error' });
    }
  };

  // 5. Google Sign In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setFeedback(null);
    const res = await loginWithGoogle();
    setIsGoogleLoading(false);

    if (res.success) {
      setFeedback({ text: res.message, type: 'success' });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 700);
    } else {
      setFeedback({ text: res.message, type: 'error' });
    }
  };

  // 6. Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotFeedback({ text: 'Please enter your registered email address.', type: 'error' });
      return;
    }

    setIsResetSubmitting(true);
    const res = await sendPasswordReset(forgotEmail);
    setIsResetSubmitting(false);

    if (res.success) {
      setForgotFeedback({ text: res.message, type: 'success' });
    } else {
      setForgotFeedback({ text: res.message, type: 'error' });
    }
  };

  // Fast Demo Pre-Fill
  const handleQuickDemoFill = (preset: 'maria' | 'new') => {
    if (preset === 'maria') {
      const res = login('09171234567', '123456');
      setFeedback({ text: res.message + ' (Demo profile loaded)', type: 'success' });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 600);
    } else {
      setAuthTab('register');
      setRegFullName('Camille D. Santos');
      setRegPhone('09189988776');
      setRegEmail('camille.santos@gmail.com');
      setRegPassword('patient2026!');
      setFeedback({ text: 'Pre-filled sample patient registration fields.', type: 'success' });
    }
  };

  return (
    <div className="min-h-full flex-1 flex flex-col justify-between bg-[#F4F8FD] text-[#0A2540] relative overflow-hidden font-sans">
      {/* Hidden container for Firebase invisible reCAPTCHA */}
      <div id="recaptcha-container" className="hidden"></div>

      {/* Brand Header Curve (Palette: #0057B8, #0047A0, #0A2540) */}
      <div className="relative bg-gradient-to-br from-[#0057B8] via-[#0047A0] to-[#0A2540] text-white pt-8 pb-8 px-6 rounded-b-[32px] shadow-lg shadow-[#0057B8]/20 shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4EA1F3]/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#0057B8]/30 rounded-full blur-xl pointer-events-none -ml-8 -mb-8" />

        {/* Top Utility Row */}
        <div className="relative z-10 flex items-center justify-between mb-3">
          {onClose ? (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white border border-white/30">
              <Stethoscope className="w-4 h-4" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Firebase Auth Live
            </span>

            <button
              onClick={() => handleQuickDemoFill(authTab === 'register' ? 'new' : 'maria')}
              className="text-[11px] font-semibold bg-white/15 hover:bg-white/25 text-[#E1EFFF] px-2.5 py-1 rounded-full border border-white/25 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#4EA1F3]" />
              <span>Demo Fill</span>
            </button>
          </div>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wider text-white">MCARE</span>
            <span className="text-[10px] font-bold tracking-widest text-[#93C5FD] uppercase bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
              OB GYN CLINIC
            </span>
          </div>
          <p className="text-xs text-[#E1EFFF] font-normal leading-relaxed">
            {authTab === 'phone'
              ? 'Real Mobile OTP Authentication • Instant SMS Verification'
              : authTab === 'email'
              ? 'Secure Email & Password Authentication'
              : 'Create your digital patient profile to book visits & access ultrasound records'}
          </p>
        </div>

        {/* Authentication Mode Tabs */}
        <div className="relative z-10 mt-4 bg-black/20 p-1 rounded-2xl flex border border-white/15 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthTab('phone');
              setIsOtpSent(false);
              setFeedback(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === 'phone'
                ? 'bg-white text-[#0057B8] shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('email');
              setFeedback(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === 'email'
                ? 'bg-white text-[#0057B8] shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('register');
              setFeedback(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === 'register'
                ? 'bg-white text-[#0057B8] shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="flex-1 px-5 py-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-start gap-2.5 shadow-xs animate-in fade-in zoom-in-95 duration-150 ${
                feedback.type === 'success'
                  ? 'bg-[#EBF7F2] text-[#047857] border border-[#A7F3D0]'
                  : 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              )}
              <span className="font-medium text-[11px] leading-tight">{feedback.text}</span>
            </div>
          )}

          {/* -------------------- TAB 1: PHONE NUMBER & REAL SMS OTP -------------------- */}
          {authTab === 'phone' && (
            <div className="space-y-3.5">
              {!isOtpSent ? (
                <form onSubmit={handleSendPhoneOtp} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0A2540] flex items-center justify-between">
                      <span>Philippine Mobile Number</span>
                      <span className="text-[10px] font-normal text-[#64748B]">SMS Carrier Verified</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-[#0057B8] border-r border-[#D6E4F5] pr-2 pointer-events-none">
                        <span>🇵🇭</span>
                        <span>+63</span>
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNumber.replace(/^\+63/, '')}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="917 123 4567"
                        className="w-full bg-white text-[#0A2540] placeholder-slate-400 rounded-2xl pl-20 pr-4 py-3 text-xs sm:text-sm font-medium border border-[#D6E4F5] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0057B8] transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-[#64748B] pt-0.5">
                      A real 6-digit one-time PIN will be dispatched directly to your mobile phone.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full bg-[#0057B8] hover:bg-[#0047A0] active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-[#0057B8]/25 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Dispatching SMS OTP...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Real SMS OTP</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* OTP Verification Step */
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 text-center py-2 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-full bg-[#E1EFFF] text-[#0057B8] flex items-center justify-center mx-auto border border-[#B9DBFE]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#0A2540]">Enter 6-Digit SMS PIN</h3>
                    <p className="text-xs text-[#475E7B]">
                      Enter the real authentication code sent to{' '}
                      <strong className="text-[#0A2540]">{formatPhoneDisplay(phoneNumber)}</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      ref={otpInputRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full text-center text-2xl font-mono font-bold tracking-[0.5em] py-3.5 rounded-2xl border-2 border-[#0057B8] text-[#0057B8] bg-white focus:ring-2 focus:ring-[#4EA1F3] focus:outline-none shadow-xs"
                    />

                    <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
                      <span>Didn't receive SMS?</span>
                      {resendCountdown > 0 ? (
                        <span className="font-mono text-[#0057B8] font-bold">
                          Resend in {resendCountdown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendPhoneOtp()}
                          disabled={isSendingOtp}
                          className="text-[#0057B8] font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend OTP</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpCode.length < 6}
                    className="w-full bg-[#0057B8] hover:bg-[#0047A0] active:scale-[0.98] disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-[#0057B8]/25 text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Code...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false);
                      setOtpCode('');
                    }}
                    className="text-xs text-[#0057B8] hover:underline block mx-auto pt-1 font-semibold cursor-pointer"
                  >
                    Change phone number
                  </button>
                </form>
              )}
            </div>
          )}

          {/* -------------------- TAB 2: EMAIL & PASSWORD -------------------- */}
          {authTab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A2540]">Email Address</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0057B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="maria.rodriguez@gmail.com"
                    className="w-full bg-white text-[#0A2540] placeholder-slate-400 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium border border-[#D6E4F5] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0057B8] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0A2540]">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotFeedback(null);
                    }}
                    className="text-xs font-semibold text-[#0057B8] hover:text-[#0047A0] transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0057B8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-white text-[#0A2540] placeholder-slate-400 rounded-2xl pl-10 pr-11 py-3 text-xs sm:text-sm font-medium border border-[#D6E4F5] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0057B8] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#475E7B] hover:text-[#0057B8] p-1 transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isEmailSubmitting}
                className="w-full bg-[#0057B8] hover:bg-[#0047A0] active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-[#0057B8]/25 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isEmailSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In with Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* -------------------- TAB 3: REGISTRATION FORM -------------------- */}
          {authTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A2540]">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0057B8]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Camille Santos"
                    className="w-full bg-white text-[#0A2540] placeholder-slate-400 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium border border-[#D6E4F5] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0057B8] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A2540]">Mobile Number</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0057B8]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0918 998 8776"
                    className="w-full bg-white text-[#0A2540] placeholder-slate-400 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium border border-[#D6E4F5] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0057B8] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A2540]">Email Address</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0057B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="camille.santos@gmail.com"
                    className="w-full bg-white text-[#0A2540] placeholder-slate-400 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium border border-[#D6E4F5] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0057B8] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0A2540]">Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0057B8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password (min 6 chars)"
                    className="w-full bg-white text-[#0A2540] placeholder-slate-400 rounded-2xl pl-10 pr-11 py-3 text-xs sm:text-sm font-medium border border-[#D6E4F5] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0057B8] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#475E7B] hover:text-[#0057B8] p-1 transition-colors cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Clinic Registry Matching Info */}
              {matchedCandidate && (
                <div className="p-3 bg-[#EBF5FF] rounded-2xl border border-[#B9DBFE] text-xs space-y-1 animate-in zoom-in-95">
                  <div className="flex items-center gap-1.5 text-[#0057B8] font-bold">
                    <UserCheck className="w-4 h-4 text-[#0057B8] shrink-0" />
                    <span>Existing Clinic Record Matched</span>
                  </div>
                  <p className="text-[11px] text-[#2563EB] leading-tight">
                    Found clinic registry <strong>{matchedCandidate.patientCode}</strong> for{' '}
                    <strong>{matchedCandidate.fullName}</strong>.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isRegSubmitting}
                className="w-full bg-[#0057B8] hover:bg-[#0047A0] active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-[#0057B8]/25 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isRegSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Patient Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Patient Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social Sign In Options */}
          {!isOtpSent && (
            <div className="pt-2 space-y-3">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#D6E4F5] w-full" />
                <span className="bg-[#F4F8FD] px-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  or authenticate with
                </span>
                <div className="border-t border-[#D6E4F5] w-full" />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#F8FAFC] active:scale-95 border border-[#D6E4F5] shadow-2xs text-xs font-bold text-[#0A2540] flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0057B8]" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  )}
                  <span>Sign In with Real Google Account</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="text-center pt-4 pb-2 border-t border-[#E2ECF8] mt-4">
          <p className="text-[11px] text-[#64748B]">
            M-Care OB-GYNE Clinic • Balibago, Angeles City
          </p>
          <p className="text-[10px] text-[#94A3B8] mt-0.5">
            Cloud Firebase Authentication & Persistent Database
          </p>
        </div>
      </div>

      {/* -------------------- FORGOT PASSWORD MODAL -------------------- */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white text-[#0A2540] rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-[#D6E4F5]">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-[#0A2540]">Reset Password</h4>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="w-7 h-7 rounded-full bg-[#F4F8FD] text-[#475E7B] hover:bg-[#E2ECF8] flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                  forgotFeedback.type === 'success'
                    ? 'bg-[#EBF7F2] text-[#047857] border border-[#A7F3D0]'
                    : 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                }`}
              >
                {forgotFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                )}
                <span className="text-[11px]">{forgotFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3 text-xs">
              <p className="text-[#475E7B] text-xs leading-relaxed">
                Enter your registered email address to receive a secure Firebase password reset link.
              </p>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full bg-[#F4F8FD] text-[#0A2540] rounded-xl px-3 py-2.5 border border-[#D6E4F5] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
              <button
                type="submit"
                disabled={isResetSubmitting}
                className="w-full py-2.5 bg-[#0057B8] hover:bg-[#0047A0] disabled:opacity-60 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isResetSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching Link...</span>
                  </>
                ) : (
                  <span>Send Real Password Reset Email</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
