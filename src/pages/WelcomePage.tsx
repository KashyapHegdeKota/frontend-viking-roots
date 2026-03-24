import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KinLogo } from "@/components/kin-logo";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [familyOrigin, setFamilyOrigin] = useState("");

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#1c1919]">
      {/* Navbar */}
      <header className="w-full border-b border-[#2f2a2a] bg-[#1c1919]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <KinLogo />
            <span className="text-xl font-bold text-white">KinSnap</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-white/60 transition-colors hover:text-[#e4bd46]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button className="rounded-full p-2 text-white/60 transition-colors hover:text-[#e4bd46]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4bd46] text-sm font-bold text-[#1c1919]">
                K
              </div>
              <span className="text-sm font-semibold text-white">Karen</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-[#2f2a2a] bg-[#2f2a2a]/60 p-8 shadow-2xl md:p-12">
            {/* Decorative sparkles */}
            <div className="pointer-events-none absolute right-8 top-6 text-[#e4bd46]/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
            <div className="pointer-events-none absolute right-24 top-16 text-[#e4bd46]/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                Welcome to Your Family Storybuilder!
              </h1>
              <p className="text-base text-white/60">
                Let's start with a few details for your profile.
              </p>
            </div>

            <div className="flex flex-col gap-8 md:flex-row">
              {/* Mascot speech bubble */}
              <div className="flex flex-col items-center gap-3 md:w-1/3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#e4bd46] bg-[#e4bd46]/10">
                  <KinLogo size={48} />
                </div>
                <div className="relative rounded-xl border border-[#e4bd46]/30 bg-[#1c1919] p-4">
                  <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-[#e4bd46]/30 bg-[#1c1919]" />
                  <p className="relative text-center text-sm text-white/80">
                    <span className="font-bold text-[#e4bd46]">Hello!</span> Let's build
                    the first chapter of your family story.
                  </p>
                </div>

                {/* Decorative family photos collage */}
                <div className="mt-4 hidden md:block">
                  <div className="relative h-32 w-40">
                    <div className="absolute left-0 top-0 h-20 w-16 rotate-[-6deg] rounded-md border border-[#e4bd46]/20 bg-[#1c1919] p-1 shadow-lg">
                      <div className="flex h-full w-full items-center justify-center rounded bg-[#2f2a2a]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c5151" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute left-8 top-2 h-20 w-16 rotate-[3deg] rounded-md border border-[#e4bd46]/20 bg-[#1c1919] p-1 shadow-lg">
                      <div className="flex h-full w-full items-center justify-center rounded bg-[#2f2a2a]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c5151" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute left-16 top-4 h-20 w-16 rotate-[8deg] rounded-md border border-[#e4bd46]/20 bg-[#1c1919] p-1 shadow-lg">
                      <div className="flex h-full w-full items-center justify-center rounded bg-[#2f2a2a]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c5151" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleNext} className="flex flex-1 flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="welcomeName" className="text-sm font-semibold text-white">
                    What is your full name?
                  </label>
                  <input
                    id="welcomeName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Karen Erikkson"
                    className="h-11 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white placeholder-[#6c5151] outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
                  />
                  <span className="text-xs text-[#6c5151]">Ex: Martha Johnsonson</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="welcomeBirth" className="text-sm font-semibold text-white">
                    Date of birth
                  </label>
                  <input
                    id="welcomeBirth"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="h-11 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#e4bd46]/60 [color-scheme:dark]"
                  />
                  <span className="text-xs text-[#6c5151]">Ex: October 24, 1955</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="welcomePlace" className="text-sm font-semibold text-white">
                    Where were you born?
                  </label>
                  <input
                    id="welcomePlace"
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="Winnipeg, Manitoba"
                    className="h-11 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white placeholder-[#6c5151] outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="welcomeOrigin" className="text-sm font-semibold text-white">
                    Family heritage or origin (optional)
                  </label>
                  <input
                    id="welcomeOrigin"
                    type="text"
                    value={familyOrigin}
                    onChange={(e) => setFamilyOrigin(e.target.value)}
                    placeholder="Icelandic, Norwegian..."
                    className="h-11 rounded-md border border-[#e4bd46] bg-transparent px-3 text-sm text-white placeholder-[#6c5151] outline-none focus:ring-2 focus:ring-[#e4bd46]/60"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 h-12 w-full rounded-full bg-[#e4bd46] text-base font-bold tracking-widest text-[#1c1919] transition-opacity hover:opacity-90"
                >
                  NEXT
                </button>
              </form>
            </div>

            {/* Privacy note */}
            <div className="mt-8 flex items-center justify-between border-t border-[#2f2a2a] pt-6">
              <p className="text-xs text-white/40">
                Only you can see this. We will never share without your permission.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm font-semibold text-[#e4bd46] transition-opacity hover:opacity-80"
              >
                Skip this for now &gt;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2f2a2a] bg-[#1c1919] px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>English</span>
          </div>
          <nav className="flex gap-6">
            <Link to="/about" className="text-xs text-white/40 transition-colors hover:text-[#e4bd46]">
              About Us
            </Link>
            <Link to="/help" className="text-xs text-white/40 transition-colors hover:text-[#e4bd46]">
              Help
            </Link>
            <Link to="/privacy" className="text-xs text-white/40 transition-colors hover:text-[#e4bd46]">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
