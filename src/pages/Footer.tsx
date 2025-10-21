import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Music } from "lucide-react";

const Footer: React.FC = () => {
  const mainLinks = [
    { name: "About", href: "/about" },
    { name: "Gimli Saga", href: "/gimli-saga" },
    { name: "Overview", href: "/overview" },
    { name: "Partner", href: "/partner" },
    { name: "Profile", href: "/profile" },
  ];

  const policyLinks = [
    { name: "Terms of Use", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Copyright Policy", href: "/copyright" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#000000",
        color: "#f0f0f0",
        padding: "60px 20px",
        marginTop: "auto",
      }}
    >
      {/* Top Row: Links (left) + Social Icons (right) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "40px",
          padding: "0 20px",
        }}
      >
        {/* Main navigation links */}
        <nav>
          {mainLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              style={{
                marginRight: "30px",
                color: "#f5f5f5",
                fontSize: "16px",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#76c7c0")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#f5f5f5")}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Social Media Icons */}
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="https://www.facebook.com/VikingRoots/" target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <Facebook size={22} />
          </a>
          <a href="https://x.com/TheVikingRoots" target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <Twitter size={22} />
          </a>
          <a href="https://www.instagram.com/vikingroots/" target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <Instagram size={22} />
          </a>
          <a href="https://www.linkedin.com/company/vikingroots/" target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <Linkedin size={22} />
          </a>
          <a href="https://www.youtube.com/TwrvsyHt-edcSFWy3qDL3A" target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <Youtube size={22} />
          </a>
          <a href="https://www.tiktok.com/@thevikingroots" target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <Music size={22} />
          </a>
        </div>
      </div>

      {/* Centered section */}
      <div style={{ textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "10px", color: "#ffffff" }}>
          Discover Your Ancestry with Viking Roots
        </h2>
        <p style={{ fontSize: "18px", marginBottom: "40px", color: "#cccccc", fontStyle: "italic" }}>
          Bridging Generations: Reconnecting Icelandic Families Across Time and Distance
        </p>
      </div>

      <hr style={{ border: "none", height: "1px", backgroundColor: "#333", width: "60%", margin: "30px auto" }} />

      <nav style={{ marginBottom: "30px", textAlign: "center" }}>
        {policyLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.href}
            style={{
              margin: "0 12px",
              color: "#bbbbbb",
              fontSize: "14px",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#76c7c0")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#bbbbbb")}
          >
            {link.name}
          </a>
        ))}
      </nav>

      <p style={{ fontSize: "15px", color: "#b0b0b0", lineHeight: "1.7", marginBottom: "20px", maxWidth: "750px", margin: "0 auto 20px", textAlign: "center" }}>
        At Viking Ancestry, we are committed to preserving and sharing the rich cultural heritage of Norse peoples while respecting the privacy and dignity of all individuals.
      </p>

      <p style={{ fontSize: "13px", color: "#a8a8a8", lineHeight: "1.7", maxWidth: "750px", margin: "0 auto 40px", textAlign: "center" }}>
        We acknowledge and respect the indigenous peoples on whose traditional territories we gather and share our stories.
      </p>

      <p style={{ fontSize: "13px", color: "#888", textAlign: "center" }}>
        © Viking Roots 2025. All rights reserved.
      </p>
    </footer>
  );
};

const iconStyle: React.CSSProperties = {
  color: "#f5f5f5",
  transition: "color 0.3s ease",
  textDecoration: "none",
  cursor: "pointer",
};

export default Footer;