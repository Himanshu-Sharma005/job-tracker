import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Home, Info, Mail, User } from 'lucide-react';

function Navbar({ isAuthenticated, onLogout }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    }

    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          setUser(data.data);
        }
      } catch (err) {
        console.error('Failed to load user profile');
      }
    };
    
    fetchMe();
  }, [isAuthenticated]);

  return (
    <header className="main-header">
      <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer', margin: 0 }}>
        Job Tracker
      </h1>
      
      <nav className="nav-wrapper">
        {/* Public Links */}
        <Link to="/" className="nav-link">
          <Home size={18} />
          <span>Home</span>
        </Link>
        <a href="#about" className="nav-link">
          <Info size={18} />
          <span>About</span>
        </a>
        <a href="#contact" className="nav-link">
          <Mail size={18} />
          <span>Contact</span>
        </a>

        {/* Authentication Controls */}
        {!isAuthenticated ? (
          <div className="user-controls">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="primary-btn">Sign Up</Link>
          </div>
        ) : (
          <div className="user-controls" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/dashboard" className="nav-link" style={{ color: 'var(--accent)' }}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            {user && (
              <div className="user-info">
                <div className="user-info-text">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                <div className="user-avatar">
                  <User size={20} />
                </div>
              </div>
            )}
            <button className="icon-btn logout-btn" onClick={onLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
