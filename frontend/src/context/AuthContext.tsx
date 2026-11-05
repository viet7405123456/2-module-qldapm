import React, { createContext, useContext, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import { AUTH_STORAGE_KEY } from '../api/client';
import type { RegisterPayload, User } from '../types';

interface StoredAuth {
  accessToken: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredAuth()?.user ?? null);

  const persist = (data: StoredAuth) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    persist(data);
    return data.user;
  };

  const register = async (payload: RegisterPayload) => {
    const data = await authApi.register(payload);
    persist(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, register, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
