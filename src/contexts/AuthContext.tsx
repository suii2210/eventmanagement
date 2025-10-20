import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
  userType?: 'organizer' | 'attendee';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, userType: 'organizer' | 'attendee') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, userType: 'organizer' | 'attendee') => {
    const response = await authAPI.signUp(email, password, fullName);
    const userWithType: User = { ...response.user, userType };
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(userWithType));
    setUser(userWithType);
  };

  const signIn = async (email: string, password: string) => {
    const response = await authAPI.signIn(email, password);
    const storedUser = localStorage.getItem('user');
    let userType: User['userType'];
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as User;
        userType = parsed.userType;
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }

    const userData: User = { ...response.user, userType };
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      await authAPI.signOut(token);
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
