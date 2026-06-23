import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyTasks, changeTaskStatus } from '../api/client';

const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
const STATUS_BADGE = { TODO: 'badge-todo', IN_PROGRESS: 'badge-in-progress', DONE: 'badge-done' };
const PRIORITY_BADGE = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high' };
const STATUS_ORDER = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getMyTasks()
      .then(res => setTasks(res.data))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (taskId, currentStatus) => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    const nextStatus = STATUS_ORDER[(currentIndex + 1) % STATUS_ORDER.length];
    try {
      const res = await changeTaskStatus(taskId, nextStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? res.data : t));
    } catch {
      alert('Failed to update status');
    }
  };

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);

  if (loading) return <div className="loading">Loading your tasks...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">My Tasks</h1>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['ALL', ...STATUS_ORDER].map(s => (
            <button
              key={s}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(s)}
            >
              {s === 'ALL' ? 'All' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
          <p>{filter === 'ALL' ? 'No tasks assigned to you yet.' : `No ${STATUS_LABELS[filter]} tasks.`}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(task => (
            <div key={task.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{task.title}</span>
                  <span className={`badge ${PRIORITY_BADGE[task.priority]}`}>{task.priority}</span>
                </div>
                {task.description && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>{task.description}</p>
                )}
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', display: 'flex', gap: '0.75rem' }}>
                  <Link to={`/projects/${task.projectId}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                    📁 {task.projectTitle}
                  </Link>
                  {task.dueDate && <span>📅 {task.dueDate}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className={`badge ${STATUS_BADGE[task.status]}`}
                  style={{ cursor: 'pointer', border: 'none' }}
                  onClick={() => handleStatusChange(task.id, task.status)}
                  title="Click to advance status"
                >
                  {STATUS_LABELS[task.status]}
                </button>
                <Link to={`/tasks/${task.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--gray-400)', textAlign: 'right' }}>
        {filtered.length} task{filtered.length !== 1 ? 's' : ''} shown
      </div>
    </div>
  );
}
