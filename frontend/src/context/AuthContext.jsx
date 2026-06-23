import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logout as apiLogout } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
