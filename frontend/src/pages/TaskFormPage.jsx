import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createTask, updateTask, getTask, getUsers } from '../api/client';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export default function TaskFormPage() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(taskId);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    assigneeId: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [users, setUsers] = useState([]);
  const [resolvedProjectId, setResolvedProjectId] = useState(projectId || null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersRes = await getUsers();
        setUsers(usersRes.data);

        if (isEditing) {
          const taskRes = await getTask(taskId);
          const t = taskRes.data;
          setResolvedProjectId(t.projectId);
          setForm({
            title: t.title || '',
            description: t.description || '',
            status: t.status || 'TODO',
            priority: t.priority || 'MEDIUM',
            dueDate: t.dueDate || '',
            assigneeId: t.assigneeId || '',
          });
        }
      } catch {
        setServerError('Failed to load data');
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [taskId, isEditing]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length < 3) errs.title = 'Min 3 characters';
    else if (form.title.length > 100) errs.title = 'Max 100 characters';
    if (form.description && form.description.length > 1000) errs.description = 'Max 1000 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      assigneeId: form.assigneeId || null,
    };

    try {
      if (isEditing) {
        await updateTask(taskId, payload);
      } else {
        await createTask(resolvedProjectId, payload);
      }
      navigate(`/projects/${resolvedProjectId}`);
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object' && !data.error) {
        setErrors(data);
      } else {
        setServerError(data?.error || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  if (fetching) return <div className="loading">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '560px', paddingTop: '2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          to={resolvedProjectId ? `/projects/${resolvedProjectId}` : '/projects'}
          style={{ fontSize: '0.85rem', color: 'var(--gray-500)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          ← Back to project
        </Link>
      </div>

      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--gray-900)' }}>
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </h2>

        {serverError && <div className="error-banner">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Title <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              className={`form-control ${errors.title ? 'error' : ''}`}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design homepage mockup"
              maxLength={100}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className={`form-control ${errors.description ? 'error' : ''}`}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Task details..."
              rows={3}
              maxLength={1000}
              style={{ resize: 'vertical' }}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select className="form-control" name="priority" value={form.priority} onChange={handleChange}>
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Due Date</label>
              <input
                className="form-control"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Assign to</label>
              <select className="form-control" name="assigneeId" value={form.assigneeId} onChange={handleChange}>
                <option value="">— Unassigned —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
            </button>
            <Link
              to={resolvedProjectId ? `/projects/${resolvedProjectId}` : '/projects'}
              className="btn btn-ghost"
              style={{ justifyContent: 'center', minWidth: '100px' }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
