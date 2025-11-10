import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import "../styles/components.css";

const Footer: React.FC = () => {
  const mainLinks = [
    { name: "About", href: "/about" },
    { name: "Gimli Saga", href: "/gimli" },
    { name: "Overview", href: "/overview" },
    { name: "Partner", href: "/partner" },
    { name: "Profile", href: "/profile" },
  ];

  const policyLinks = [
    { name: "Terms of Use", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Copyright Policy", href: "/copyright" },
  ];

  const socialLinks = [
    { name: "Facebook", href: "https://www.facebook.com/VikingRoots/", icon: Facebook },
    { name: "Twitter", href: "https://x.com/TheVikingRoots", icon: Twitter },
    { name: "Instagram", href: "https://www.instagram.com/vikingroots/", icon: Instagram },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/vikingroots/", icon: Linkedin },
    { name: "YouTube", href: "https://www.youtube.com/TwrvsyHt-edcSFWy3qDL3A", icon: Youtube },
  ];

  return (
    <footer className="footer-wrapper">
      {/* Top Section - Background Image */}
      <div className="footer-hero">
        <div className="footer-hero-content">
          <h2 className="footer-hero-title">
            Discover Your Ancestry with Viking Roots
          </h2>
          <p className="footer-hero-tagline">
            Bridging Generations: Reconnecting Icelandic Families Through Ancestral Lineage and Heritage Discoveries
          </p>
        </div>
      </div>

      {/* Center Logo Circle - Overlapping both sections */}
      <div className="footer-logo-circle">
        <div className="footer-logo-image" role="img" aria-label="Viking Roots Logo" />
      </div>

      {/* Bottom Section - White Background with Logo Cutout */}
      <div className="footer-content-wrapper">
        {/* SVG Cutout for Logo */}
        <svg 
          className="footer-cutout"
          viewBox="0 0 1400 150"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,150 L 0,0 L 630,0 Q 630,0 630,75 A 70,70 0 0,0 770,75 Q 770,0 770,0 L 1400,0 L 1400,150 Z"
            fill="black"
          />
        </svg>
        
        <div className="footer">
          <div className="footer-container">
            {/* Navigation and Social Icons Row */}
            <div className="footer-nav-social">
              {/* Left Navigation Links */}
              <nav>
                <ul className="footer-links">
                  {mainLinks.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </nav>

              
              <div className="footer-social">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.name} page`}
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>
            </div>

            
            <div className="footer-bottom">

              {/* Policy Links */}
              <ul className="footer-legal">
                {policyLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>

              
              <p className="footer-statement">
                At Viking Ancestry, we are committed to fostering a community that celebrates diversity, promotes equity, and ensures inclusion for all individuals. Our mission is to provide a platform where everybody can explore their ancestry and heritage with respect, dignity, and a sense of belonging.
              </p>

              <p className="footer-statement">
                We acknowledge that Viking Roots® operates on the traditional territories of the indigenous peoples of our region.
              </p>

              {/* Copyright */}
              <p className="footer-copyright">Copyright Viking Roots 2025</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
