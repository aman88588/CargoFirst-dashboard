import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  email: string;
  role: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: string, address: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signin = async (email: string, password: string) => {
    const response = await authAPI.signin({ email, password });
    // Check if token is in data.token or data.data.token
    const newToken = response.data.token || response.data.data?.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const profileResponse = await authAPI.getProfile();
    setUser(profileResponse.data);
  };

  const signup = async (email: string, password: string, role: string, address: string) => {
    const response = await authAPI.signup({ email, password, role, address });
    // Token is nested in data.data.token for signup
    const newToken = response.data.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    // Set user data from signup response instead of making another API call
    setUser({
      email: response.data.data.email,
      role: response.data.data.role,
      address: response.data.data.address,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};