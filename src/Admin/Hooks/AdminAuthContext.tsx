// src/Contexts/AdminAuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';


interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (isAdminAuthenticated: boolean) => void;
  accessToken: string;
  setAccessTToken: (accessToken: string) => void;
  presaleID: string;
  setPresaleID: (presaleID: string) => void;
  lastSignInTime: number;
  setLastSignInTime: (time: number) => void;

}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);


export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [accessToken, setAccessTToken] = useState(localStorage.getItem('accesstoken') || "");
  const [lastSignInTime, setLastSignInTime] = useState<number>(parseInt(localStorage.getItem('lastSignInTime') || '0'));
  const [presaleID, setPresaleID] = useState(localStorage.getItem('presaleid') || "");



  const clearAuthData = () => {
    setAccessTToken('');
    setPresaleID('');
    setIsAdminAuthenticated(false);
    setLastSignInTime(0);
    localStorage.clear();
  };

  useEffect(() => {
    const checkSessionExpiration = () => {
      const currentTime = Date.now();
      if (lastSignInTime > 0 && currentTime - lastSignInTime > 10 * 60 * 60 * 1000) {
        clearAuthData();
      }
    };

    checkSessionExpiration();
    const intervalId = setInterval(checkSessionExpiration, 60000);

    return () => clearInterval(intervalId);
  }, [lastSignInTime]);



  useEffect(() => {
    localStorage.setItem('accesstoken', accessToken);
  }, [accessToken]);


  useEffect(() => {
    localStorage.setItem('lastSignInTime', lastSignInTime.toString());
  }, [lastSignInTime]);


  useEffect(() => {
    localStorage.setItem('isAdminAuthenticated', JSON.stringify(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, setIsAdminAuthenticated, accessToken, setAccessTToken, presaleID, setPresaleID, lastSignInTime, setLastSignInTime }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
