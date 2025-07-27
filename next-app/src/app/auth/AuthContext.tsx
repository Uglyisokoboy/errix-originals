'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = { email: string; role: string } | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (profile: any) => Promise<{ ok: boolean; error?: string; user?: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:4000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (stored) {
      setToken(stored);
      if (storedUser) setUser(JSON.parse(storedUser));
      fetchUser(stored);
    }
  }, []);

  async function fetchUser(token: string) {
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else setUser(null);
    } catch {
      setUser(null);
    }
  }

  async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { ok: true };
      }
      setUser(null);
      return { ok: false, error: data.error || 'Login failed.' };
    } catch (err) {
      setUser(null);
      return { ok: false, error: 'Network error.' };
    }
  }

  async function register(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { ok: true };
      }
      setUser(null);
      return { ok: false, error: data.error || 'Registration failed.' };
    } catch (err) {
      setUser(null);
      return { ok: false, error: 'Network error.' };
    }
  }

  async function updateProfile(profile: any): Promise<{ ok: boolean; error?: string; user?: any }> {
    // Use user.email as the token for this endpoint
    if (!user || !user.email) return { ok: false, error: 'Not authenticated' };
    try {
      const res = await fetch(`${API_URL}/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.email}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { ok: true, user: data.user };
      }
      return { ok: false, error: data.error || 'Update failed.' };
    } catch (err) {
      return { ok: false, error: 'Network error.' };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
} 