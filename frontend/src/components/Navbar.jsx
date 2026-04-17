import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <header className="main-header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer', margin: 0 }}>
        Job Tracker
      </h1>
      
      <nav className="nav-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Public Links */}
        <Link to="/" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Home</Link>
        <a href="#about" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>About</a>
        <a href="#contact" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Contact</a>

        {/* Authentication Controls */}
        {!isAuthenticated ? (
          <div className="user-controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Login</Link>
            <Link to="/signup" className="primary-btn" style={{ padding: '0.5rem 1rem' }}>Sign Up</Link>
          </div>
        ) : (
          <div className="user-controls" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/dashboard" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Dashboard</Link>
            {user && (
              <div className="user-info" style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
              </div>
            )}
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
