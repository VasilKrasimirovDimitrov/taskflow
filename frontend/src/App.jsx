import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProjectFormPage from './pages/ProjectFormPage';
import TaskFormPage from './pages/TaskFormPage';
import MyTasksPage from './pages/MyTasksPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return !user ? children : <Navigate to="/projects" />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/projects" element={<PrivateRoute><ProjectsPage /></PrivateRoute>} />
          <Route path="/projects/new" element={<PrivateRoute><ProjectFormPage /></PrivateRoute>} />
          <Route path="/projects/:id" element={<PrivateRoute><ProjectDetailPage /></PrivateRoute>} />
          <Route path="/projects/:id/edit" element={<PrivateRoute><ProjectFormPage /></PrivateRoute>} />
          <Route path="/projects/:projectId/tasks/new" element={<PrivateRoute><TaskFormPage /></PrivateRoute>} />
          <Route path="/tasks/:taskId/edit" element={<PrivateRoute><TaskFormPage /></PrivateRoute>} />
          <Route path="/my-tasks" element={<PrivateRoute><MyTasksPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}
