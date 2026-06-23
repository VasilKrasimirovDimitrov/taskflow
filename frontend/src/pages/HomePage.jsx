import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '3rem' }}>✦</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gray-900)', marginTop: '0.5rem' }}>
          TaskFlow
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', marginTop: '1rem', maxWidth: '480px', margin: '1rem auto 0' }}>
          Organize your projects, track your tasks, and collaborate with your team — all in one place.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        {user ? (
          <Link to="/projects" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
            Go to Projects →
          </Link>
        ) : (
          <>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
              Get Started
            </Link>
            <Link to="/login" className="btn btn-ghost" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
              Login
            </Link>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '5rem', maxWidth: '800px', margin: '5rem auto 0' }}>
        {[
          { icon: '📁', title: 'Manage Projects', desc: 'Create and organize projects with deadlines and descriptions.' },
          { icon: '✅', title: 'Track Tasks', desc: 'Break projects into tasks with priorities and status tracking.' },
          { icon: '👥', title: 'Assign & Collaborate', desc: 'Assign tasks to team members and track progress together.' },
        ].map(feature => (
          <div key={feature.title} className="card" style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{feature.icon}</div>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--gray-900)' }}>{feature.title}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
