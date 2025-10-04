'use client';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
 
import { usePathname, useRouter } from 'next/navigation';
import { User } from '../lib/types';
import { fetchApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          // ✅ FIX: Add '?populate=role' to the API call
          const userData = await fetchApi('/api/users/me?populate=role');
          setUser(userData);
        } catch (error) {
          console.error('Invalid token, logging out', error);
          logout(); // Token is invalid or expired
        }
      }
      setLoading(false);
    };
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Re-check on route change to be safe

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
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