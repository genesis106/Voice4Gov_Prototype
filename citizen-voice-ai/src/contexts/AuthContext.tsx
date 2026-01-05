// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL - adjust to match your backend
const API_BASE_URL = 'http://localhost:3001/api/v1/users';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status by calling the current-user endpoint
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/current-user`, {
        method: 'GET',
        credentials: 'include', // Important: sends cookies with request
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          const mappedUser: User = {
            id: result.data._id,
            name: result.data.fullName,
            email: result.data.email
          };
          
          setUser(mappedUser);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: allows cookies to be set
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.message || 'Login failed' };
      }

      // Backend returns: { success: true, data: { user, accessToken, refreshToken }, message }
      if (result.success && result.data && result.data.user) {
        const mappedUser: User = {
          id: result.data.user._id,
          name: result.data.user.fullName,
          email: result.data.user.email
        };

        setUser(mappedUser);
        setIsAuthenticated(true);
        return {};
      }

      return { error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Network error. Please check your connection and try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullName: name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.message || 'Signup failed' };
      }

      // After successful signup, log the user in
      return await login(email, password);
    } catch (error) {
      console.error('Signup error:', error);
      return { error: 'Network error. Please check your connection and try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Important: sends cookies with request
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, isAuthenticated }}>
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