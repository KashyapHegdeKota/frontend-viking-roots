import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import '../styles/AuthPages.css';

const OTP_LENGTH = 6;

const createEmptyOtp = () => Array.from({ length: OTP_LENGTH }, () => '');

const getOtpDigits = (value: string) =>
  value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');

export default function AuthenticationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(createEmptyOtp);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    const digits = getOtpDigits(value);
    if (digits.length > 1) {
      fillOtpFromDigits(digits, index);
      return;
    }

    if (value && digits.length === 0) return;

    const next = [...otp];
    next[index] = digits[0] || '';
    setOtp(next);
    setMessage('');
    if (digits[0] && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const fillOtpFromDigits = (digits: string[], startIndex = 0) => {
    const next = [...otp];
    digits.forEach((digit, offset) => {
      const targetIndex = startIndex + offset;
      if (targetIndex < OTP_LENGTH) next[targetIndex] = digit;
    });

    setOtp(next);
    setMessage('');

    const nextEmptyIndex = next.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? OTP_LENGTH - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedDigits = getOtpDigits(event.clipboardData.getData('text'));
    if (pastedDigits.length === 0) return;
    fillOtpFromDigits(pastedDigits);
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) return;

    setIsLoading(true);
    setMessage('');
    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Invalid verification code.');
        setOtp(createEmptyOtp());
        inputRefs.current[0]?.focus();
        return;
      }
      navigate('/login');
    } catch {
      setMessage('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setMessage('');
    try {
      const response = await fetch(API_ENDPOINTS.RESEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Failed to resend verification code.');
        return;
      }
      setCountdown(60);
      setOtp(createEmptyOtp());
      setMessage('A fresh verification code was sent.');
      inputRefs.current[0]?.focus();
    } catch {
      setMessage('Network error. Please check your connection.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      
      <main className="auth-main">
        <div className="auth-card otp-card">
          <div className="otp-icon" aria-hidden="true">
            <span>✓</span>
          </div>

          <h1>Verify Your Email</h1>
          <p className="otp-copy">
            Enter the {OTP_LENGTH}-digit code sent to <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="otp-row" aria-label="Verification code">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onPaste={handlePaste}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  aria-label={`Digit ${index + 1}`}
                  autoFocus={index === 0}
                  required
                />
              ))}
            </div>

            <p className="otp-hint">Paste the full code into any box.</p>

            <button type="submit" disabled={isLoading || otp.join('').length !== OTP_LENGTH}>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {message && <p className="otp-message">{message}</p>}

          {countdown > 0 ? (
            <p className="otp-note">Resend OTP in {countdown}s</p>
          ) : (
            <button className="link-like" type="button" disabled={resendLoading} onClick={handleResend}>
              {resendLoading ? 'Sending...' : "Didn't receive code? Resend OTP"}
            </button>
          )}

          <div className="auth-links">
            <Link to="/register">Wrong email? Register again</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
