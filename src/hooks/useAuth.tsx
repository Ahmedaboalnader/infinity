import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile } from '@/types/database';
import { getCurrentUser, signInWithEmail, signUpWithEmail, signOut } from '@/services/auth';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isMember: boolean;
  login: (email: string, pass: string) => Promise<Profile>;
  register: (email: string, pass: string, name: string) => Promise<Profile>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const u = await signInWithEmail(email, pass);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      const u = await signUpWithEmail(email, pass, name);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isMember = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isMember,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
