import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin(data.data.token);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--s-4)' }}>
          <div style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: 'var(--s-3)', borderRadius: '12px' }}>
            <LogIn size={32} />
          </div>
        </div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to manage your job applications</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="name@company.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button className="primary-btn" type="submit" disabled={isLoading} style={{ width: '100%', marginTop: 'var(--s-4)' }}>
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/signup" style={{ fontWeight: '600' }}>Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
