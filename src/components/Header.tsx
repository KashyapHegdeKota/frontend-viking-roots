import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

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
            <button
              onClick={() => navigate('/')}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "white",
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
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
            </button>
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
              <li><button onClick={() => navigate('/about')} style={linkStyle}>About</button></li>
              <li><button onClick={() => navigate('/gimli-saga')} style={linkStyle}>Gimli Saga</button></li>
              <li><button onClick={() => navigate('/overview')} style={linkStyle}>Overview</button></li>
              <li><button onClick={() => navigate('/partner')} style={linkStyle}>Partner</button></li>
              <li><button onClick={() => navigate('/careers')} style={linkStyle}>Careers</button></li>
              <li><button onClick={() => navigate('/login')} style={linkStyle}>Login</button></li>
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
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

export default Header;
