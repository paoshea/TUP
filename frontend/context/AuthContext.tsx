"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, User, AuthResponse } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and verify it
    const token = localStorage.getItem('auth_token');
    if (token) {
      auth.verifyToken(token).then((user) => {
        setUser(user);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await auth.signIn(email, password);
    if (response.user && response.token) {
      setUser(response.user);
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const signUp = async (email: string, password: string) => {
    const response = await auth.signUp(email, password);
    if (response.user && response.token) {
      setUser(response.user);
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};