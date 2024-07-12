// src/components/shared/Contexts/AuthContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';


interface AuthContextType {
  email: string;
  setEmail: (email: string) => void;
  UserID: string;
  setUserID: (UserID: string) => void;
  password: string;
  setPassword: (password: string) => void;
  presaleID: string;
  setPresaleID: (presaleID: string) => void;
  accessToken: string;
  setAccessTToken: (accessToken: string) => void;
  referralCode: string;
  setWalletAddress: (password: string) => void;
  lastSignInTime: number;
  setLastSignInTime: (time: number) => void;
  walletAddress: string;
  setReferralCOde: (referralCode: string) => void;
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
  isGoogleSignIn: boolean;
  setIsGoogleSignIn: (isGoogleSignIn: boolean) => void;
  hasDisplayedConnectModal: boolean;
  setHasDisplayedConnectModal: (hasDisplayedConnectModal: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState(localStorage.getItem('email') || "");
  const [UserID, setUserID] = useState(localStorage.getItem('UserID') || "");
  const [password, setPassword] = useState(localStorage.getItem('password') || "");
  const [accessToken, setAccessTToken] = useState(localStorage.getItem('accesstoken') || "");
  const [presaleID, setPresaleID] = useState(localStorage.getItem('presaleid') || "");
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('walletAddress') || "");
  const [referralCode, setReferralCOde] = useState(localStorage.getItem('referralCode') || "");
  const [lastSignInTime, setLastSignInTime] = useState<number>(parseInt(localStorage.getItem('lastSignInTime') || '0'));
  const [isAuthenticated, setAuthenticated] = useState<boolean>(JSON.parse(localStorage.getItem('isAuthenticated') || 'false'));
  const [isGoogleSignIn, setIsGoogleSignIn] = useState<boolean>(JSON.parse(localStorage.getItem('isGoogleSignIn') || 'false'));
  const [hasDisplayedConnectModal, setHasDisplayedConnectModal] = useState<boolean>(JSON.parse(localStorage.getItem('displayedModalConnect') || 'false'));


  const clearAuthData = () => {
    setEmail('');
    setUserID('');
    setPassword('');
    setAccessTToken('');
    setPresaleID('');
    setWalletAddress('');
    setReferralCOde('');
    setAuthenticated(false);
    setIsGoogleSignIn(false);
    setHasDisplayedConnectModal(false);
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
    localStorage.setItem('lastSignInTime', lastSignInTime.toString());
  }, [lastSignInTime]);

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
    localStorage.setItem('presaleid', presaleID);
  }, [presaleID]);

  useEffect(() => {
    localStorage.setItem('accesstoken', accessToken);
  }, [accessToken]);


  useEffect(() => {
    localStorage.setItem('  walletAddress', walletAddress);
  }, [walletAddress]);

  useEffect(() => {
    localStorage.setItem('referralCode', referralCode);
  }, [referralCode]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('isGoogleSignIn', JSON.stringify(isGoogleSignIn));
  }, [isGoogleSignIn]);

  useEffect(() => {
    const displayedModalConnect = JSON.parse(localStorage.getItem('displayedModalConnect') || 'false');
    setHasDisplayedConnectModal(displayedModalConnect);
  }, [setHasDisplayedConnectModal]);


  return (
    <AuthContext.Provider value={{ email, setEmail, isAuthenticated, setAuthenticated, UserID, setUserID, password, setPassword, referralCode, setReferralCOde, setHasDisplayedConnectModal, hasDisplayedConnectModal, setWalletAddress, walletAddress, presaleID, setPresaleID, accessToken, setAccessTToken, isGoogleSignIn, setIsGoogleSignIn, lastSignInTime, setLastSignInTime, }}>
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
