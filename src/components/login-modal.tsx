import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KinLogo } from "@/components/kin-logo";
import { API_ENDPOINTS } from "@/config/api"; // Adjust this path if needed based on your aliases

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSignUpClick?: () => void;
}

export function LoginModal({ open, onClose, onSignUpClick }: LoginModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  
  // ADDED: State management from LoginPage
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
      // Optional: clear the form when the modal closes
      setEmail('');
      setPassword('');
    }
  }, [open]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target !== dialogRef.current) return;
    
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (clickedOutside) onClose();
  }

  function handleSignUpClick() {
    onClose();
    onSignUpClick?.();
  }

  function handleForgotPasswordClick() {
    onClose();
    navigate('/forgot-password');
  }

  // ADDED: Real authentication logic from LoginPage
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
      localStorage.setItem('isStaff', data.is_staff ? 'true' : 'false');
      localStorage.setItem('isSuperuser', data.is_superuser ? 'true' : 'false');

      onClose(); // Close the modal upon success

      if (data.is_admin) {
        navigate('/admin/users');
      } else if (data.profile_completed && data.username) {
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

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-auto w-full max-w-md rounded-2xl bg-[#262626] p-8 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="mb-8 flex items-center gap-3">
        <KinLogo size={48} />
        <span className="text-2xl font-bold tracking-wide text-white">Viking Roots</span>
      </div>

      <h2 className="mb-8 text-4xl font-bold text-white">Welcome</h2>

      {/* UPDATED: Connected to handleSubmit */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="loginEmail" className="text-sm font-semibold text-white">
            Email Address
          </label>
          <input
            id="loginEmail"
            type="email"
            required
            value={email} // Controlled input
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-md border border-[#c88a65] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#c88a65]/60"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="loginPassword" className="text-sm font-semibold text-white">
            Password
          </label>
          <input
            id="loginPassword"
            type="password"
            required
            value={password} // Controlled input
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-md border border-[#c88a65] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#c88a65]/60"
          />
        </div>

        {/* UPDATED: Loading state implementation */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-12 w-full rounded-full bg-[linear-gradient(to_right,#c88a65_-55%,white)] text-base font-bold tracking-widest text-[#000] transition-all hover:bg-[linear-gradient(to_right,#eab2a0,white)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>

        <div className="flex flex-col items-center gap-2 text-sm font-bold uppercase tracking-wide">
          <button
            type="button"
            onClick={handleSignUpClick}
            className="text-[#c88a65] transition-opacity hover:opacity-80"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={handleForgotPasswordClick}
            className="text-[#c88a65] transition-opacity hover:opacity-80"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </dialog>
  );
}
