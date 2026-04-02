'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authService } from '../services/authService';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  account_status: string;
  avatar_url?: string;
  timezone?: string;
  shopping_preferences?: string[];
  category_ids?: number[];
  watchlist_count?: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user on mount if token exists
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = Cookies.get('bidooze_token');
        if (token) {
          const response = await authService.getCurrentUser();
          if (response?.user) {
            setUser(response.user);
          }
        }
      } catch (error) {
        // Token might be invalid or expired
        Cookies.remove('bidooze_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const value: UserContextType = {
    user,
    setUser,
    isLoggedIn: !!user,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
