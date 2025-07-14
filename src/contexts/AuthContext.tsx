import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar?: string;
  joinDate: Date;
  totalBookings: number;
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { email: string; password: string; fullName: string; phone: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    try {
      // Mock authentication - in real app this would be an API call
      if (email && password) {
        const mockUser: User = {
          id: '1',
          email,
          fullName: 'John Doe',
          phone: '+1234567890',
          avatar: undefined,
          joinDate: new Date(),
          totalBookings: 5,
          memberSince: '2024'
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: { email: string; password: string; fullName: string; phone: string }): Promise<boolean> => {
    // Simulate API call
    try {
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        avatar: undefined,
        joinDate: new Date(),
        totalBookings: 0,
        memberSince: new Date().getFullYear().toString()
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 