import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignUpModal } from "@/components/sign-up-modal";

const HERO_PHRASES = [
  "What if a famous face in history was part of your story?",
  "Who’s in your photos that no one has named yet?",
  "Planning something special? Share every moment in one place."
];

export function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(() => Math.floor(Math.random() * HERO_PHRASES.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((current) => (current + 1) % HERO_PHRASES.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#171717]">
      <img
        src="/HeroImageRight 2.png"
        alt="Historical portrait photograph"
        className="absolute inset-0 h-full w-full object-cover object-[center_bottom]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#171717]/30 to-[#171717]/90" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center">
        <div className="ml-auto flex w-full flex-col justify-center gap-6 px-8 py-16 md:w-[60%] md:py-24 lg:w-[55%] lg:px-16">
          <h1 
            key={phraseIndex}
            className="text-balance text-4xl font-bold leading-tight text-white lg:text-5xl animate-in fade-in duration-[2000ms]"
          >
            {HERO_PHRASES[phraseIndex]}
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-white/70">
            Old photographs often hold connections you may not even know exist.
            Viking Roots invites you to help identify people, preserve family stories,
            and reconnect history through shared community projects.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(to_right,#c88a65_-55%,white)] px-6 py-3 text-base font-bold text-[#000] transition-all hover:bg-[linear-gradient(to_right,#eab2a0,white)] hover:text-white"
            >
              Create An Account
            </button>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 text-base font-bold text-white transition-colors hover:border-[#c88a65] hover:text-[#c88a65]"
            >
              Explore a project
            </Link>
          </div>

          <SignUpModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
      </div>
    </section>
  );
}
