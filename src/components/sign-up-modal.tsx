import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { KinLogo } from "@/components/kin-logo";

const OTP_LENGTH = 6;
const EXPIRY_SECONDS = 14 * 60 + 38;

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignUpModal({ open, onClose }: SignUpModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);

  useEffect(() => {
    if (step !== 3) return;
    setSecondsLeft(EXPIRY_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(interval); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }, []);

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleResend() {
    setOtp(Array(OTP_LENGTH).fill(""));
    setSecondsLeft(EXPIRY_SECONDS);
  }

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
      setStep(1);
      setEmail("");
      setOtp(Array(OTP_LENGTH).fill(""));
      setPhotoPreview(null);
    }
  }, [open]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (clickedOutside) onClose();
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  }

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-auto w-full max-w-lg rounded-2xl bg-[#262626] p-8 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {step === 1 ? (
        <>
          <div className="mb-6 flex items-center gap-3">
            <KinLogo size={48} />
            <span className="text-2xl font-bold tracking-wide text-white">KinSnap</span>
          </div>

          <h2 className="mb-6 text-3xl font-bold text-white">Join our community</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-sm font-semibold text-white">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                className="h-10 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-white">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="h-10 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-white">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="h-10 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
              />
            </div>

            <button
              type="submit"
              className="mt-2 h-12 w-full rounded-full bg-[#e4bd46] text-base font-bold tracking-widest text-[#0a0a0a] transition-opacity hover:opacity-90"
            >
              NEXT
            </button>
          </form>
        </>
      ) : step === 2 ? (
        <>
          <div className="mb-1 text-center">
            <h2 className="text-2xl font-extrabold uppercase tracking-widest text-white">
              Profile Setup
            </h2>
          </div>
          <div className="mb-5 border-b border-[#e4bd46]" />

          <p className="mb-5 text-center text-sm font-semibold text-white">
            Confirm Your Identity
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="displayName" className="text-sm font-bold text-white">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="John Doe"
                className="h-10 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white placeholder-[#6b7280] outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Photo (optional)</label>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#6b7280]/40">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-[#6b7280]"
                    >
                      <circle cx="32" cy="24" r="12" fill="currentColor" />
                      <path
                        d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>

                <label
                  htmlFor="photoUpload"
                  className="cursor-pointer rounded-md border border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#e4bd46] hover:text-[#e4bd46]"
                >
                  Upload Photo
                  <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Phone Verification</label>
              <div className="flex gap-2">
                <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md border border-[#6b7280] bg-transparent text-sm font-semibold text-white">
                  +1
                </div>
                <input
                  type="tel"
                  placeholder="(202) 555-0123"
                  className="h-10 flex-1 rounded-md border border-[#6b7280] bg-transparent px-3 text-sm text-white placeholder-[#6b7280] outline-none focus:border-[#e4bd46] focus:ring-2 focus:ring-[#e4bd46]/60"
                />
                <button
                  type="button"
                  className="h-10 rounded-md border border-white px-4 text-sm font-semibold text-white transition-colors hover:border-[#e4bd46] hover:text-[#e4bd46]"
                >
                  Verify
                </button>
              </div>
              <p className="text-xs text-[#6b7280]">
                Receive a code via SMS to confirm your phone number
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="smsCode" className="text-sm font-bold text-white">
                Code
              </label>
              <input
                id="smsCode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="h-10 w-36 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
              />
            </div>

            <div className="mt-2 flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-12 flex-1 rounded-full bg-[#e4bd46] text-base font-bold text-[#0a0a0a] transition-opacity hover:opacity-90"
              >
                Back
              </button>
              <button
                type="submit"
                className="h-12 flex-1 rounded-full bg-[#e4bd46] text-base font-bold text-[#0a0a0a] transition-opacity hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-white"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            </div>
          </div>

          <h2 className="mb-3 text-center text-2xl font-bold text-white">
            Verify your email Address
          </h2>
          <div className="mb-5 border-b border-[#e4bd46]" />

          <p className="mb-1 text-center text-sm text-white">
            A verification code has been sent to{" "}
            <span className="font-semibold text-[#e4bd46]">{email || "JohnDoe@gmail.com"}</span>
          </p>
          <p className="mb-6 text-center text-sm text-white">
            Please check your inbox and enter the verification code below to verify your email
            address.{" "}
            <span className="font-bold text-white">
              The code will expire in {formatTime(secondsLeft)}
            </span>
          </p>

          <div className="mb-6 flex justify-center gap-3">
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[i]}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="h-12 w-12 rounded-md border border-[#e4bd46] bg-transparent text-center text-lg font-bold text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
              />
            ))}
          </div>

          <div className="mb-3 flex justify-center">
            <button
              type="button"
              className="h-11 w-40 rounded-md border border-white text-sm font-semibold text-white transition-colors hover:border-[#e4bd46] hover:text-[#e4bd46]"
            >
              Verify
            </button>
          </div>

          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-white underline-offset-2 hover:underline"
            >
              Resend Code
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="h-12 flex-1 rounded-full bg-[#e4bd46] text-base font-bold text-[#0a0a0a] transition-opacity hover:opacity-90"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/welcome");
              }}
              className="h-12 flex-1 rounded-full bg-[#e4bd46] text-base font-bold text-[#0a0a0a] transition-opacity hover:opacity-90"
            >
              Save
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
