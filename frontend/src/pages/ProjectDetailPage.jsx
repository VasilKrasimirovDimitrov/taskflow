import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProject, getProjectTasks, deleteTask, changeTaskStatus, getUsers } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
const STATUS_BADGE = { TODO: 'badge-todo', IN_PROGRESS: 'badge-in-progress', DONE: 'badge-done' };
const PRIORITY_BADGE = { LOW: 'badge-low', MEDIUM: 'badge-medium', HIGH: 'badge-high' };
const STATUS_ORDER = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getProject(id), getProjectTasks(id)])
      .then(([pRes, tRes]) => {
        setProject(pRes.data);
        setTasks(tRes.data);
      })
      .catch(() => setError('Failed to load project'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch {
      alert('Failed to delete task');
    }
  };

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

  if (loading) return <div className="loading">Loading project...</div>;
  if (error) return <div className="container"><div className="error-banner">{error}</div></div>;
  if (!project) return null;

  const isOwner = user?.id === project.ownerId;

  return (
    <div className="container">
      {/* Project header */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)' }}>{project.title}</h1>
            {project.description && (
              <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>{project.description}</p>
            )}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--gray-400)' }}>
              <span>👤 {project.ownerUsername}</span>
              {project.deadline && <span>📅 Deadline: {project.deadline}</span>}
              <span>📋 {tasks.length} tasks</span>
            </div>
          </div>
          {isOwner && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/projects/${id}/edit`} className="btn btn-ghost btn-sm">Edit Project</Link>
            </div>
          )}
        </div>
      </div>

      {/* Tasks section */}
      <div className="page-header">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--gray-800)' }}>Tasks</h2>
        {isOwner && (
          <Link to={`/projects/${id}/tasks/new`} className="btn btn-primary btn-sm">+ Add Task</Link>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--gray-400)' }}>
          <p>No tasks yet.{isOwner ? ' Add the first one!' : ''}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.map(task => (
            <div key={task.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--gray-900)' }}>{task.title}</span>
                  <span className={`badge ${PRIORITY_BADGE[task.priority]}`}>{task.priority}</span>
                </div>
                {task.description && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>{task.description}</p>
                )}
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: '0.25rem', display: 'flex', gap: '0.75rem' }}>
                  {task.assigneeUsername && <span>👤 {task.assigneeUsername}</span>}
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

                {(isOwner || user?.id === task.assigneeId) && (
                  <>
                    <Link to={`/tasks/${task.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                    {isOwner && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(task.id)}>Del</button>
                    )}
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
