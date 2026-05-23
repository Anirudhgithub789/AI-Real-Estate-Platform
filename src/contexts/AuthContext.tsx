import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '@/types';
import { api } from '@/services/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage, then re-validate with the server.
  // We never trust the cached `user` (especially `role`) as authoritative —
  // it is only used as an optimistic placeholder while /auth/me is in-flight.
  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Optimistic hydration (UI only — server response below is authoritative)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const cachedUser = JSON.parse(userStr) as User;
        setState({ user: cachedUser, token, isAuthenticated: true, isLoading: true });
      } catch {
        localStorage.removeItem('user');
      }
    }

    // Authoritative re-validation against backend
    api.getCurrentUser()
      .then((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        setState({ user, token, isAuthenticated: true, isLoading: false });
      })
      .catch(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await api.login(credentials);
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await api.register(data);
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
