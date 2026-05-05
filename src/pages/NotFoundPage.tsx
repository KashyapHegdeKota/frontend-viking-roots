import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
      <Link
        to="/dashboard"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-all hover:opacity-90"
      >
        Go back home
      </Link>
    </div>
  );
}