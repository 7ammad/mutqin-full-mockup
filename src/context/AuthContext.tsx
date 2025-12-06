"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Persona } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: Persona;
  nameAr?: string;
  nameEn?: string;
}

interface AuthContextType {
  user: User | null;
  role: Persona | null;
  login: (email: string, password: string, role?: Persona, redirect?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Import MOCK_USERS from mockData
import { MOCK_USERS } from '@/lib/mockData';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionStr = localStorage.getItem('auth_session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session.expiresAt > Date.now()) {
            setUser(session.user);
            setRole(session.role);
            // Also set cookie for proxy
            document.cookie = `auth_session=${sessionStr}; path=/; max-age=${7 * 24 * 60 * 60}`;
            console.log('[Auth] Session loaded successfully');
          } else {
            localStorage.removeItem('auth_session');
            console.log('[Auth] Expired session removed');
          }
        }
      } catch (e) {
        localStorage.removeItem('auth_session');
        console.log('[Auth] Session load error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string, selectedRole?: Persona, redirect?: string) => {
    if (!selectedRole) {
      throw new Error('Role is required');
    }

    try {
      // Mock authentication - validate against mock users
      const mockUser = MOCK_USERS.find(
        u => u.email === email && u.password === password && u.role === selectedRole
      );
      
      if (mockUser) {
        const session = {
          user: mockUser,
          role: selectedRole,
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };
        
        const sessionStr = JSON.stringify(session);
        
        // Set localStorage and cookie
        try {
          localStorage.setItem('auth_session', sessionStr);
          document.cookie = `auth_session=${encodeURIComponent(sessionStr)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        } catch (storageError) {
          console.error('[Auth] Storage error:', storageError);
          throw new Error('Failed to save session');
        }
        
        setUser(mockUser);
        setRole(selectedRole);
        console.log(`[Auth] Login successful as ${selectedRole}`);
        
        // Redirect to intended destination or dashboard
        const roleSlug = selectedRole.toLowerCase().replace('_', '-');
        const destination = redirect || `/dashboard/${roleSlug}`;
        
        // Use window.location as fallback if router.push fails
        try {
          router.push(destination);
          // Also use window.location as backup for mobile browsers
          setTimeout(() => {
            if (window.location.pathname === '/auth/login') {
              window.location.href = destination;
            }
          }, 100);
        } catch (navError) {
          console.error('[Auth] Navigation error:', navError);
          window.location.href = destination;
        }
      } else {
        console.log('[Auth] Login failed: Invalid credentials');
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('[Auth] Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    document.cookie = 'auth_session=; path=/; max-age=0';
    setUser(null);
    setRole(null);
    console.log('[Auth] Logged out');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
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

