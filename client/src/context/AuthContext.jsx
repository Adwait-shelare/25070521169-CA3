import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('wanderly_token') || null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Load user profile on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.warn('[AuthContext] Session expired:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem('wanderly_token', newToken);
      setToken(newToken);
      setUser(userData);
      addToast(`Welcome back, ${userData.name}!`, 'success');
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (name, email, password, phone) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      const { token: newToken, user: userData } = res.data;

      localStorage.setItem('wanderly_token', newToken);
      setToken(newToken);
      setUser(userData);
      addToast(`Welcome to Wanderly, ${userData.name}!`, 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('wanderly_token');
    localStorage.removeItem('wanderly_user');
    setToken(null);
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/auth/profile', formData);
      setUser(res.data.user);
      addToast('Profile updated successfully!', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
