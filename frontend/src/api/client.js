import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

// Projects
export const getProjects = () => api.get('/projects');
export const getMyProjects = () => api.get('/projects/my');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Tasks
export const getProjectTasks = (projectId) => api.get(`/projects/${projectId}/tasks`);
export const getMyTasks = () => api.get('/tasks/my');
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (projectId, data) => api.post(`/projects/${projectId}/tasks`, data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const changeTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status });
export const assignTask = (id, assigneeId) => api.patch(`/tasks/${id}/assign`, { assigneeId });

// Users
export const getUsers = () => api.get('/users');

export default api;
