'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type AuthUser = {
  id: number;
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (payload: { accessToken: string; user: AuthUser }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'flavorai_token';
const USER_KEY = 'flavorai_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null;

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to restore auth from localStorage', err);
    } finally {
      setInitialized(true);
    }
  }, []);

  const login = (payload: { accessToken: string; user: AuthUser }) => {
    setToken(payload.accessToken);
    setUser(payload.user);

    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, payload.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
  };

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm text-slate-400">Loading FlavorAI...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
