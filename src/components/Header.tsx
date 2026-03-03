import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Fetch notification count
    const fetchNotificationCount = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${apiBaseUrl}/form/groups/invites/`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setNotificationCount(data.invites?.length || 0);
        }
      } catch (err) {
        console.error('Error fetching notification count:', err);
      }
    };

    fetchNotificationCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

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
              alignItems: "center",
              flex: "1",
              gap: "16px"
            }}
          >
            {/* Notification Bell */}
            <button
              onClick={() => navigate('/notifications')}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Bell size={22} />
              {notificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #000'
                  }}
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

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
