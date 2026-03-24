import { useState } from "react";
import { Link } from "react-router-dom";
import { SignUpModal } from "@/components/sign-up-modal";

export function Hero() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-[#1f1c1c]">
      <img
        src="/HeroImageRight 2.png"
        alt="Historical portrait photograph"
        className="absolute inset-0 h-full w-full object-cover object-left"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1f1c1c]/30 to-[#1f1c1c]/90" />

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center md:min-h-[620px] lg:min-h-[700px]">
        <div className="ml-auto flex w-full flex-col justify-center gap-6 px-8 py-16 md:w-[60%] md:py-24 lg:w-[55%] lg:px-16">
          <h1 className="text-balance text-4xl font-bold leading-tight text-white lg:text-5xl">
            What if a famous face in history was part of your story?
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-white/70">
            Old photographs often hold connections you may not even know exist.
            KinSnap invites you to help identify people, preserve family stories,
            and reconnect history through shared community projects.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md bg-[#e4bd46] px-6 py-3 text-base font-bold text-[#1c1919] transition-opacity hover:opacity-90"
            >
              Create An Account
            </button>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-3 text-base font-bold text-white transition-colors hover:border-[#e4bd46] hover:text-[#e4bd46]"
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
