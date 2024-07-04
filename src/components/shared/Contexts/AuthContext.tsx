// src/components/shared/Contexts/AuthContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';


interface AuthContextType {
  email: string;
  setEmail: (email: string) => void;
  UserID: string;
  setUserID: (UserID: string) => void;
  password: string;
  setPassword: (password: string) => void;
  referralCode: string;
  setReferralCOde: (referralCode: string) => void;
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [UserID, setUserID] = useState(localStorage.getItem('UserID') || '');
  const [password, setPassword] = useState(localStorage.getItem('password') || '');
  const [referralCode, setReferralCOde] = useState(localStorage.getItem('referralCode') || '');
  const [isAuthenticated, setAuthenticated] = useState<boolean>(JSON.parse(localStorage.getItem('isAuthenticated') || 'false'));

  useEffect(() => {
    localStorage.setItem('email', email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem('UserID', UserID);
  }, [UserID]);

  useEffect(() => {
    localStorage.setItem('password', password);
  }, [password]);

  useEffect(() => {
    localStorage.setItem('referralCode', referralCode);
  }, [referralCode]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ email, setEmail, isAuthenticated, setAuthenticated, UserID, setUserID, password, setPassword, referralCode, setReferralCOde, }}>
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
