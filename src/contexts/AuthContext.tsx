import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (in production, this would be handled by your backend)
const users = [
  {
    username: 'admin',
    password: '19141971',
    roles: ['admin']
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const userData = { username: foundUser.username, roles: foundUser.roles };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
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