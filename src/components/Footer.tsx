import { Link } from "react-router-dom";
import { KinLogo } from "@/components/kin-logo";

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/VikingRoots/", icon: "/socials/fb.png" },
  { label: "Instagram", href: "https://www.instagram.com/vikingroots/", icon: "/socials/ig.png" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/vikingroots/", icon: "/socials/yt.png" },
  { label: "TikTok", href: "https://www.tiktok.com/@thevikingroots", icon: "/socials/tk.png" },
  { label: "X", href: "https://x.com/TheVikingRoots", icon: "/socials/x.png" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-[#262626] bg-[#0a0a0a] px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6">
        <Link to="/" aria-label="Viking Roots home">
          <KinLogo size={56} />
        </Link>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-[#c88a65]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Social media">
          <ul className="flex gap-6">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-transform hover:scale-110"
                  aria-label={link.label}
                >
                  <img
                    src={link.icon}
                    alt={link.label}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
