import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1c1919] px-6 text-center">
      <h1 className="text-6xl font-bold text-[#e4bd46]">404</h1>
      <p className="mt-4 text-lg text-white/70">Page not found</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-[#e4bd46] px-6 py-3 text-base font-bold text-[#1c1919] transition-opacity hover:opacity-90"
      >
        Go back home
      </Link>
    </div>
  );
}
