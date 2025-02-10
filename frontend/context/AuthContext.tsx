"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/services/storage';

interface User {
  id: string;
  name: string;
  email: string;
  farm: string;
  location: string;
  role: string;
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id' | 'role' | 'memberSince'>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = storage.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    try {
      setIsLoading(true);
      // Find user by email
      const storedUser = storage.getUser();
      
      if (storedUser?.email === email) {
        // Any password works at this stage
        setUser(storedUser);
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'role' | 'memberSince'>) => {
    try {
      setIsLoading(true);
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        role: 'user',
        memberSince: new Date().toISOString(),
        ...userData,
      };

      // Store user data
      storage.setUser(newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      storage.clearAll(); // Clear all stored data
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Basic middleware for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}