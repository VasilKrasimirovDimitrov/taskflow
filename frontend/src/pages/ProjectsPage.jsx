import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data))
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete project');
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">All Projects</h1>
        <Link to="/projects/new" className="btn btn-primary">+ New Project</Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
          <p>No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {projects.map(project => (
            <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <Link to={`/projects/${project.id}`} style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--gray-900)' }}>
                  {project.title}
                </Link>
                {project.description && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '0.35rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                <span>👤 {project.ownerUsername}</span>
                <span>📋 {project.taskCount} tasks</span>
                {project.deadline && <span>📅 {project.deadline}</span>}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link to={`/projects/${project.id}`} className="btn btn-ghost btn-sm">View</Link>
                {user?.id === project.ownerId && (
                  <>
                    <Link to={`/projects/${project.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(project.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
