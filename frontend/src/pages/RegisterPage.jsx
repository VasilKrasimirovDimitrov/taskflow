import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'Min 3 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');
    try {
      const res = await register(form);
      setUser(res.data);
      navigate('/projects');
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === 'object' && !data.error) {
        setErrors(data);
      } else {
        setServerError(data?.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="container" style={{ maxWidth: '420px', paddingTop: '3rem' }}>
      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--gray-900)' }}>
          Create your account
        </h2>

        {serverError && <div className="error-banner">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {[
            { name: 'username', label: 'Username', type: 'text', placeholder: 'your_username' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div className="form-group" key={field.name}>
              <label>{field.label}</label>
              <input
                className={`form-control ${errors[field.name] ? 'error' : ''}`}
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
              />
              {errors[field.name] && <span className="error-text">{errors[field.name]}</span>}
            </div>
          ))}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
