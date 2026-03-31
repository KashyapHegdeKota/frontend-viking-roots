import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KinLogo } from "@/components/kin-logo";
import { API_ENDPOINTS } from "@/config/api";

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignUpModal({ open, onClose }: SignUpModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [open]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    // 1. If the click originated from inside the dialog (like a button, input, or Enter key), ignore it.
    if (e.target !== dialogRef.current) return;

    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // 2. Proceed with backdrop calculation
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
      
    if (clickedOutside) onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      onClose();
      navigate("/login");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-auto w-full max-w-lg rounded-2xl bg-[#262626] p-8 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <>
        <div className="mb-6 flex items-center gap-3">
          <KinLogo size={48} />
          <span className="text-2xl font-bold tracking-wide text-white">KinSnap</span>
        </div>

        <h2 className="mb-6 text-3xl font-bold text-white">Join our community</h2>

        {error && <p className="mb-4 rounded-md bg-red-900/40 px-3 py-2 text-sm text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-username" className="text-sm font-semibold text-white">
              Username
            </label>
            <input
              id="modal-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-email" className="text-sm font-semibold text-white">
              Email Address
            </label>
            <input
              id="modal-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-password" className="text-sm font-semibold text-white">
              Password
            </label>
            <input
              id="modal-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-confirm" className="text-sm font-semibold text-white">
              Confirm Password
            </label>
            <input
              id="modal-confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-12 w-full rounded-full bg-[#e4bd46] text-base font-bold tracking-widest text-[#0a0a0a] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "CREATE ACCOUNT"}
          </button>
        </form>
      </>
    </dialog>
  );
}
