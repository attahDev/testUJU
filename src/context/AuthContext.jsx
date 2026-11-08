import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authStore.js';
import { api, getToken, setToken } from '../api/client.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(() => !getToken());

  useEffect(() => {
    if (!getToken()) return;
    api('/api/auth/me')
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(() => {
    async function authenticate(path, body) {
      const res = await api(path, { method: 'POST', body, auth: false });
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    return {
      user,
      ready,
      login: (email, password) => authenticate('/api/auth/login', { email, password }),
      register: (name, email, password) => authenticate('/api/auth/register', { name, email, password }),
      refreshUser: () => api('/api/auth/me').then(setUser),
      updateName: async (name) => {
        const updated = await api('/api/auth/me', { method: 'PATCH', body: { name } });
        setUser(updated);
      },
      changePassword: (currentPassword, newPassword) =>
        api('/api/auth/change-password', {
          method: 'POST',
          body: { current_password: currentPassword, new_password: newPassword },
        }),
      logout: () => {
        setToken(null);
        setUser(null);
      },
    };
  }, [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
