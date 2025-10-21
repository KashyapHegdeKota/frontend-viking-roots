const Header = () => {
  return (
    <>
      <header
        style={{
          backgroundColor: "#000",
          color: "white",
          padding: "16px 32px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Left side: Logo + Title (flush left) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flex: "1",
            }}
          >
            <a
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "white",
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              <img
                src="\favicon-32x32.png"
                alt="Viking Roots Logo"
                style={{
                  width: "32px",
                  height: "32px",
                  marginRight: "10px",
                }}
              />
              Viking Roots
            </a>
          </div>

          {/* Right side: Navigation */}
          <nav
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flex: "1",
            }}
          >
            <ul
              className="nav-desktop"
              style={{
                display: "flex",
                listStyle: "none",
                margin: 0,
                padding: 0,
                gap: "24px",
              }}
            >
              <li><a href="/about" style={linkStyle}>About</a></li>
              <li><a href="/gimli-saga" style={linkStyle}>Gimli Saga</a></li>
              <li><a href="/overview" style={linkStyle}>Overview</a></li>
              <li><a href="/partner" style={linkStyle}>Partner</a></li>
              <li><a href="/careers" style={linkStyle}>Careers</a></li>
              <li><a href="/login" style={linkStyle}>Login</a></li>
            </ul>

          </nav>
        </div>
      </header>

      
    </>
  );
};

// Shared link style
const linkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: 500,
  transition: "color 0.3s ease",
};

export default Header;