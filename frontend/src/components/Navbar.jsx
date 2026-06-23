import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--gray-200)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>
          ✦ TaskFlow
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {user ? (
            <>
              <Link to="/projects" style={{ fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 500 }}>Projects</Link>
              <Link to="/my-tasks" style={{ fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 500 }}>My Tasks</Link>
              <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>Hi, {user.username}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 500 }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
