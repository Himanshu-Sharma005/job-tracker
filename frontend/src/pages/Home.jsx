import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Clock, BarChart3, Zap, Mail } from 'lucide-react';

function Home({ isAuthenticated }) {
  const ctaLink = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="landing-page">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="hero-title">
            Track Your Job <br/> Applications <span style={{ color: 'var(--accent)' }}>Easily</span>
          </h1>
          
          <p className="hero-subtitle">
            Organize your job search, track every stage of your applications, and stay ahead with a clean, professional workspace.
          </p>

          <div className="landing-cta" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to={ctaLink} className="primary-btn" style={{ padding: '0.8rem 2rem', fontSize: '1.125rem' }}>
              <span>Get Started</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Everything you need to land the job</h2>
        
        <div className="feature-grid">
          <div className="card feature-card">
            <div className="feature-icon" style={{ color: 'var(--accent)' }}>
              <Briefcase size={40} />
            </div>
            <h3>Track Applications</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Never lose track of where you applied. Organize statuses, notes, and roles in one place.</p>
          </div>
          
          <div className="card feature-card">
            <div className="feature-icon" style={{ color: 'var(--warning)' }}>
              <Clock size={40} />
            </div>
            <h3>Set Reminders</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Stay on top of follow-ups and technical tests with intuitive visual reminders.</p>
          </div>
          
          <div className="card feature-card">
            <div className="feature-icon" style={{ color: 'var(--success)' }}>
              <BarChart3 size={40} />
            </div>
            <h3>View Analytics</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Visualize your application health and conversion rates with native built-in stats.</p>
          </div>
          
          <div className="card feature-card">
            <div className="feature-icon" style={{ color: 'var(--danger)' }}>
              <Zap size={40} />
            </div>
            <h3>Manage Priorities</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Focus on high-impact opportunities with clear priority levels and smart filtering.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="landing-section-alt">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '0 var(--s-8)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Built for the Relentless</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            We built Job Tracker to help developers and job seekers organize their placement pipelines without the chaos of spreadsheets. Keep it minimal, beautiful, and secure.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: 'var(--s-12)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Have questions?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Running into issues or have feedback? We'd love to hear from you.
          </p>
          <a href="mailto:hello@jobtracker.test" className="secondary-btn">
            <Mail size={20} />
            <span>hello@jobtracker.test</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 'var(--s-12) var(--s-8)', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <p>© {new Date().getFullYear()} Job Tracker. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;
