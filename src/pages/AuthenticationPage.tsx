import React, { useState, useRef, useEffect } from 'react';
import './components/Login.css';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      alert('Please register first to verify your account.');
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or last input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      alert('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);

    try {
      console.log("Verifying OTP via:", API_ENDPOINTS.VERIFY_OTP);

      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpString,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Email verified successfully! You can now login.");
        console.log(data);
        // Redirect to login page
        navigate('/login');
      } else {
        alert(data.error || "Invalid OTP. Please try again.");
        console.error("OTP verification error:", data);
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      console.log("Resending OTP via:", API_ENDPOINTS.RESEND_OTP);

      const response = await fetch(API_ENDPOINTS.RESEND_OTP, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("OTP has been resent to your email!");
        console.log(data);
        setCountdown(60); // Start 60-second countdown
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        alert(data.error || "Failed to resend OTP. Please try again.");
        console.error("Resend OTP error:", data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="login-section d-flex align-items-center justify-content-center min-vh-100">
      <div className="row login-box">
        
        {/* Left side - image + tagline */}
        <div className="col-12 col-md-7 login-image-container text-center bg-white p-5">
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <img 
              src="/img/Logo-Transparent.png" 
              alt="Viking Roots Logo" 
              className="logo-dark-login mb-6" 
            />
            <p className="text-center">
              Discover Your Ancestry with Viking Roots
            </p>
          </div>
        </div>

        {/* Right side - OTP form */}
        <div className="col-12 col-md-5 login-form-container p-5 bg-light-grey d-flex flex-column justify-content-center">
          <h2 className="fw-bold text-center mb-3">Verify Your Email</h2>
          <p className="text-center text-muted mb-4">
            We've sent a 6-digit code to<br />
            <strong>{email}</strong>
          </p>

          <form id="otpForm" onSubmit={handleSubmit} noValidate>
            {/* OTP Input Fields */}
            <div className="mb-4 d-flex justify-content-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="form-control text-center"
                  style={{
                    width: '50px',
                    height: '50px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  required
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button 
              role="button" 
              type="submit" 
              className="btn btn-custom w-100 mb-3" 
              disabled={isLoading || otp.join('').length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-muted">
                  Resend OTP in {countdown}s
                </p>
              ) : (
                <button
                  type="button"
                  className="btn btn-link text-decoration-none"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                >
                  {resendLoading ? 'Sending...' : "Didn't receive code? Resend OTP"}
                </button>
              )}
            </div>

            <div className="mt-3 text-center">
              <a href="/register">Wrong email? Register again</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;