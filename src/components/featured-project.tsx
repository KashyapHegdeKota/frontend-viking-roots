import { Link } from "react-router-dom";

export function FeaturedProject() {
  return (
    <section className="w-full bg-[#1f1c1c] px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-white lg:text-5xl">
          Featured Project: Gimli Saga
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/60">
          A community-led project preserving the people and stories of Gimli,
          Manitoba — one photograph at a time.
        </p>
        <Link
          to="/projects/gimli-saga"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-[#e4bd46] px-6 py-3 text-base font-bold text-[#1c1919] transition-opacity hover:opacity-90"
        >
          View Project
        </Link>
      </div>
    </section>
  );
}
