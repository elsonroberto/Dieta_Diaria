import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('daily-diet-token');
    if (!token) { setLoading(false); return undefined; }
    api.get('/me')
      .then(({ data }) => { if (active) setUser(data.user); })
      .catch(() => {
        if (active) {
          localStorage.removeItem('daily-diet-token');
          setUser(null);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function acceptAuth(data) {
    localStorage.setItem('daily-diet-token', data.token);
    setUser(data.user);
  }

  async function login(email, password) {
    const { data } = await api.post('/sessions', { email, password });
    acceptAuth(data);
  }

  async function register(name, email, password) {
    const { data } = await api.post('/users', { name, email, password });
    acceptAuth(data);
  }

  function logout() {
    localStorage.removeItem('daily-diet-token');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth precisa estar dentro de AuthProvider.');
  return auth;
}
