import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'operator' | 'master';
  masterId?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- 🚨 O'ZGARISH KIRITILGAN QISM: checkAuth Token bilan yuboriladi ---
  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    
    // Agar token topilmasa, tekshirishni o'tkazib yuboramiz
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          // Autentifikatsiya tokenini Serverga yuborish
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
        // Agar siz Token ishlatayotgan bo'lsangiz, 'credentials: "include"' kerak emas
        // credentials: 'include', 
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token yaroqsiz bo'lsa (401), o'chiramiz
        localStorage.removeItem('accessToken'); 
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  // -------------------------------------------------------------

  // --- 🚨 O'ZGARISH KIRITILGAN QISM: login funksiyasi Tokenni saqlaydi ---
  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login muvaffaqiyatsiz');
    }

    const data = await response.json();
    // Serverdan kelgan tokenni 'accessToken' nomi bilan saqlashni taxmin qilamiz
    if (data.accessToken) { 
      localStorage.setItem('accessToken', data.accessToken);
    }
    
    setUser(data.user || data); // Agar server to'g'ridan-to'g'ri user ma'lumotini qaytarsa
  };
  // -------------------------------------------------------------

  // --- 🚨 O'ZGARISH KIRITILGAN QISM: logout Tokenni o'chiradi ---
  const logout = async () => {
    // Agar Session Cookie ishlatilsa, bu so'rov Serverda sessiyani to'xtatadi
    await fetch('/api/auth/logout', { 
      method: 'POST',
      credentials: 'include',
    });
    
    // JWT ishlatilganda, token lokal xotiradan o'chiriladi
    localStorage.removeItem('accessToken'); 
    setUser(null);
  };
  // -------------------------------------------------------------

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    isLoading,
    login,
    logout,
    checkAuth,
  };
}
