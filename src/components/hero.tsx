import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignUpModal } from "@/components/sign-up-modal";

const HERO_PHRASES = [
  "What if a famous face in history was part of your story?",
  "Who's in your photos that no one has named yet?",
  "Planning something special? Share every moment in one place."
];

export function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(() => Math.floor(Math.random() * HERO_PHRASES.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((current) => (current + 1) % HERO_PHRASES.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-card">
      <img
        src="/HeroImageRight 2.png"
        alt="Historical portrait photograph"
        className="absolute inset-0 h-full w-full object-cover object-[center_bottom]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-card/30 to-card/90" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center">
        <div className="ml-auto flex w-full flex-col justify-center gap-6 px-8 py-16 md:w-[60%] md:py-24 lg:w-[55%] lg:px-16">
          <h1
            key={phraseIndex}
            className="text-balance text-4xl font-bold leading-tight text-foreground lg:text-5xl animate-in fade-in duration-[2000ms]"
          >
            {HERO_PHRASES[phraseIndex]}
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            Old photographs often hold connections you may not even know exist.
            Viking Roots invites you to help identify people, preserve family stories,
            and reconnect history through shared community projects.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-all hover:opacity-90"
            >
              Create An Account
            </button>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-full border-2 border-foreground px-6 py-3 text-base font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
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