import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createProject, updateProject, getProject } from '../api/client';

export default function ProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({ title: '', description: '', deadline: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    getProject(id)
      .then(res => {
        const p = res.data;
        setForm({
          title: p.title || '',
          description: p.description || '',
          deadline: p.deadline || '',
        });
      })
      .catch(() => setServerError('Failed to load project'))
      .finally(() => setFetching(false));
  }, [id, isEditing]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length < 3) errs.title = 'Min 3 characters';
    else if (form.title.length > 100) errs.title = 'Max 100 characters';
    if (form.description && form.description.length > 1000) errs.description = 'Max 1000 characters';
    if (form.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(form.deadline) < today) errs.deadline = 'Deadline must be today or in the future';
    }
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
      deadline: form.deadline || null,
    };

    try {
      if (isEditing) {
        await updateProject(id, payload);
        navigate(`/projects/${id}`);
      } else {
        const res = await createProject(payload);
        navigate(`/projects/${res.data.id}`);
      }
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

  if (fetching) return <div className="loading">Loading project...</div>;

  return (
    <div className="container" style={{ maxWidth: '560px', paddingTop: '2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          to={isEditing ? `/projects/${id}` : '/projects'}
          style={{ fontSize: '0.85rem', color: 'var(--gray-500)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          ← {isEditing ? 'Back to project' : 'Back to projects'}
        </Link>
      </div>

      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--gray-900)' }}>
          {isEditing ? 'Edit Project' : 'Create New Project'}
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
              placeholder="e.g. Website Redesign"
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
              placeholder="What is this project about?"
              rows={4}
              maxLength={1000}
              style={{ resize: 'vertical' }}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', alignSelf: 'flex-end' }}>
              {form.description.length}/1000
            </span>
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input
              className={`form-control ${errors.deadline ? 'error' : ''}`}
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.deadline && <span className="error-text">{errors.deadline}</span>}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
            </button>
            <Link
              to={isEditing ? `/projects/${id}` : '/projects'}
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
