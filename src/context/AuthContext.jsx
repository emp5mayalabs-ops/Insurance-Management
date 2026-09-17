import { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as apiAdminLogin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('insure_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('insure_auth_token'));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('insure_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('insure_auth_user');
    }
  }, [user]);

  const setAuthSession = (newToken, newUser) => {
    setUser(newUser);
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('insure_auth_token', newToken);
    } else {
      localStorage.removeItem('insure_auth_token');
    }
    if (newUser) {
      localStorage.setItem('insure_auth_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('insure_auth_user');
    }
  };

  const login = async (credentials, param2) => {
    // If called directly as setAuthSession(token, userObject)
    if (typeof credentials === 'string' && typeof param2 === 'object' && param2 !== null) {
      setAuthSession(credentials, param2);
      return { success: true };
    }

    setLoading(true);
    setAuthError(null);
    try {
      const res = await apiAdminLogin(credentials, param2);
      const token = res.data?.token || res.data?.access || res.data?.key || res.data?.jwt || 'authenticated';
      const returnedUser = res.data?.user || (typeof res.data === 'object' && res.data?.username ? res.data : null);
      const username = typeof credentials === 'object' ? credentials?.username : credentials;
      const userData = returnedUser || {
        username: username || 'admin',
        name: username || 'Administrator',
        role: 'Administrator',
        email: `${username || 'admin'}@insurance.com`
      };
      setAuthSession(token, userData);
      return { success: true, data: res.data };
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('insure_auth_token');
    localStorage.removeItem('insure_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user || !!token,
        loading,
        authError,
        login,
        setAuthSession,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
