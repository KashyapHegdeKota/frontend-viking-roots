import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import '../styles/AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, username: email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Login failed. Please check your credentials.');
        return;
      }

      if (data.username) localStorage.setItem('username', data.username);
      if (data.token) localStorage.setItem('authToken', data.token);

      if (data.profile_completed && data.username) {
        navigate(`/profile/${data.username}`);
      } else {
        navigate('/profile');
      }
    } catch {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      
      <main className="auth-main">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your family story.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/register">Not a member? Sign Up</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
