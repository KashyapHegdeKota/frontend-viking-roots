import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import '../styles/AuthPages.css';

export default function AuthenticationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
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
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Invalid OTP.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }
      navigate('/login');
    } catch {
      alert('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.RESEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to resend OTP.');
        return;
      }
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      alert('Network error. Please check your connection.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      
      <main className="auth-main">
        <div className="auth-card">
          <h1>Verify Your Email</h1>
          <p>
            We sent a 6-digit code to <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="otp-row">
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
                  required
                />
              ))}
            </div>

            <button type="submit" disabled={isLoading || otp.join('').length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

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
