import { type FormEvent, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import '../styles/AuthPages.css';

type ResetLocationState = {
  email?: string;
};

export default function ResetPassword() {
  const location = useLocation();
  const state = location.state as ResetLocationState | null;
  const queryEmail = new URLSearchParams(location.search).get('email') || '';

  const [email, setEmail] = useState(state?.email || queryEmail);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD_RESET_CONFIRM, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          token,
          new_password: newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Unable to reset password.');
        return;
      }

      setIsComplete(true);
      setMessage(data.message || 'Password reset successfully.');
      setToken('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-card">
          <h1>Reset Password</h1>
          <p>Use the code from your email.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoFocus={!email}
              />
            </label>

            <label>
              Reset Code
              <input
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                required
                autoFocus={Boolean(email)}
              />
            </label>

            <label>
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </label>

            <label>
              Confirm New Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </label>

            <button type="submit" disabled={isLoading || isComplete}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          {message && <p className="otp-note">{message}</p>}

          <div className="auth-links">
            {isComplete ? <Link to="/login">Go to login</Link> : <Link to="/forgot-password">Request a new code</Link>}
          </div>
        </div>
      </main>
    </div>
  );
}
