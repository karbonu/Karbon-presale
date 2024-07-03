// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  email: string;
  setEmail: (email: string) => void;
  UserID: string;
  setUserID: (UserID: string) => void;
  password: string;
  setPassword: (password: string) => void;
  referralCode: string;
  setReferralCOde: (password: string) => void;
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState('');
  const [UserID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCOde] = useState('');
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ email, setEmail, isAuthenticated, setAuthenticated, UserID, setUserID, password, setPassword, referralCode, setReferralCOde }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
