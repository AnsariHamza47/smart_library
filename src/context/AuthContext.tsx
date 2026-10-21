import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  login: (email: string, role?: UserRole) => Promise<void>;
  register: (data: { fullName: string; email: string; studentId: string; department: string }) => Promise<void>;
  logout: () => void;
  quickSwitchUser: (userId: number) => void;
  updateCurrentUser: (updated: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'slms_current_user_v1';
const CURRENT_TOKEN_KEY = 'slms_current_token_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      const savedToken = localStorage.getItem(CURRENT_TOKEN_KEY);
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(CURRENT_TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, targetRole?: UserRole) => {
    const res = await api.auth.login(email, targetRole);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user));
    localStorage.setItem(CURRENT_TOKEN_KEY, res.token);
  };

  const register = async (data: { fullName: string; email: string; studentId: string; department: string }) => {
    const res = await api.auth.register(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user));
    localStorage.setItem(CURRENT_TOKEN_KEY, res.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_TOKEN_KEY);
  };

  const quickSwitchUser = async (userId: number) => {
    try {
      const targetUser = await api.students.getById(userId);
      setUser(targetUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(targetUser));
    } catch (e) {
      console.error('Failed to switch user', e);
    }
  };

  const updateCurrentUser = (updated: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        token,
        login,
        register,
        logout,
        quickSwitchUser,
        updateCurrentUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
