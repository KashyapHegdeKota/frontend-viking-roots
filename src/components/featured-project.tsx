import { Link } from "react-router-dom";

export function FeaturedProject() {
  return (
    <section className="w-full border-t border-border bg-background px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-foreground lg:text-5xl">
          Featured Project: Viking Roots (Community led Initiative)
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          A community-led project preserving the people and stories of Gimli,
          Manitoba — one photograph at a time.
        </p>
        <Link
          to="/projects/gimli-saga"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-all hover:opacity-90"
        >
          View Project
        </Link>
      </div>
    </section>
  );
}