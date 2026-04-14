import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { KinLogo } from "@/components/kin-logo";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSignUpClick?: () => void;
}

export function LoginModal({ open, onClose, onSignUpClick }: LoginModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
          navigate("/dashboard");
        }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="loginEmail" className="text-sm font-semibold text-white">
            Email Address
          </label>
          <input
            id="loginEmail"
            type="email"
            required
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
            className="h-11 rounded-md border border-[#c88a65] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#c88a65]/60"
          />
        </div>

        <button
          type="submit"
          className="mt-2 h-12 w-full rounded-full bg-[linear-gradient(to_right,#c88a65_-55%,white)] text-base font-bold tracking-widest text-[#000] transition-all hover:bg-[linear-gradient(to_right,#eab2a0,white)] hover:text-white"
        >
          SIGN IN
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
            className="text-[#c88a65] transition-opacity hover:opacity-80"
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </dialog>
  );
}
