import React, { useState } from 'react';
import './components/Login.css';
import { API_ENDPOINTS } from '../config/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Login successful!");
        console.log(data);
        // Store token if your backend returns one
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        // Redirect to home page or dashboard
        window.location.href = '/';
      } else {
        alert(data.error || "Login failed. Please check your credentials.");
        console.error("Login error:", data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-section d-flex align-items-center justify-content-center min-vh-100">
      <div className="row login-box">
        
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

        <div className="col-12 col-md-5 login-form-container p-5 bg-light-grey d-flex flex-column justify-content-center">
          <h2 className="fw-bold text-center mb-4">Welcome Back!</h2>
          <form id="loginForm" onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button role="button" type="submit" className="btn btn-custom w-100" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <div className="mt-3 text-center">
              <a href="/register">Not a member? Sign Up!</a>
              <br />
              <a href="/forgot-password">Forgot your password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;