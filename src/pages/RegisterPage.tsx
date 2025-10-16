import React, { useState } from 'react';
import './components/Login.css';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    console.log({ fullName, email, password });
    alert('Registration submitted!');
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
          <h2 className="fw-bold text-center mb-4">Create Account</h2>
          <form id="registerForm" onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus
              />
            </div>
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
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button role="button" type="submit" className="btn btn-custom w-100">
              Sign Up
            </button>
            <div className="mt-3 text-center">
              <a href="/login">Already have an account? Login!</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
