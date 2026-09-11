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

  const login = async (credentials) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await apiAdminLogin(credentials);
      const returnedUser = res.data?.user || (typeof res.data === 'object' && res.data?.username ? res.data : null);
      const userData = returnedUser || {
        username: credentials.username || 'admin',
        name: credentials.username || 'Administrator',
        role: 'Administrator',
        email: credentials.email || `${credentials.username || 'admin'}@insurance.com`
      };
      setUser(userData);
      setToken(res.data?.token || res.data?.access || res.data?.key || 'authenticated');
      return { success: true };
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
