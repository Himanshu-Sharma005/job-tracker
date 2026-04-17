import { Link } from 'react-router-dom';

function Home({ isAuthenticated }) {
  const ctaLink = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="landing-page" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      minHeight: '100vh',
      width: '100%'
    }}>
      
      {/* Hero Section */}
      <section style={{ 
        width: '100%',
        padding: '6rem 2rem', 
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 70%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            Track Your Job <br/> Applications <span style={{ color: 'transparent', background: '-webkit-linear-gradient(0deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Easily</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
            Organize your job applications, track progress, set reminders, and stay ahead in your placement journey.
          </p>

          <div className="landing-cta" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={ctaLink} className="primary-btn" style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }}>
              Track Your Applications
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '6rem 2rem', width: '100%', maxWidth: '1200px' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>Why use Job Tracker?</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗂️</div>
            <h3>Track Applications</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Never lose track of where you applied. Add statuses, notes, and roles in seconds.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏰</div>
            <h3>Set Reminders</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Get daily visual flags to follow up on interviews and technical tests.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h3>View Analytics</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Visualize your conversion rates and application health natively.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔥</div>
            <h3>Manage Priorities</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Filter your opportunities by strict priority levels so you focus on what matters.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '6rem 2rem', width: '100%', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>About</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            We built Job Tracker to specifically help students, developers, and relentless job seekers organize their placement pipelines without the bloat of massive messy spreadsheets. Keep it minimal, beautiful, and secure.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '6rem 2rem', width: '100%', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Get in Touch</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Running into issues navigating the platform? Feel free to reach out.
          </p>
          <a href="mailto:hello@jobtracker.test" className="secondary-btn" style={{ display: 'inline-block' }}>
            hello@jobtracker.test
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ width: '100%', padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
        <p>© {new Date().getFullYear()} Job Tracker. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default Home;
