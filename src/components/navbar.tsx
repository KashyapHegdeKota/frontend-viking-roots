import { useState } from "react";
import { Link } from "react-router-dom";
import { KinLogo } from "@/components/kin-logo";
import { LoginModal } from "@/components/login-modal";
import { SignUpModal } from "@/components/sign-up-modal";

export function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  return (
    <header className="w-full border-b border-[#262626] bg-[#0a0a0a]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        <Link to="/" className="flex items-center gap-3" aria-label="Viking Roots home">
          <KinLogo />
          <span className="text-xl font-bold text-white">Viking Roots</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/projects"
            className="text-base font-semibold text-white transition-colors hover:text-[#c88a65]"
          >
            Explore A Project
          </Link>
          <button
            onClick={() => setLoginOpen(true)}
            className="text-base font-semibold text-white transition-colors hover:text-[#c88a65]"
          >
            Log In
          </button>
        </div>
      </nav>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignUpClick={() => setSignUpOpen(true)}
      />
      <SignUpModal
        open={signUpOpen}
        onClose={() => setSignUpOpen(false)}
      />
    </header>
  );
}
