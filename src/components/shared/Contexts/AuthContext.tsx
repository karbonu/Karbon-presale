// src/components/shared/Contexts/AuthContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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
  hasDisplayedDisclaimet: boolean;
  setHasDisplayedDisclaimet: (hasDisplayedConnectModal: boolean) => void;
  isDropDownOpen: boolean;
  setIsDropDownOpen: (isDropDownOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState(localStorage.getItem('KARBON_email') || "");
  const [UserID, setUserID] = useState(localStorage.getItem('KARBON_UserID') || "");
  const [password, setPassword] = useState(localStorage.getItem('KARBON_password') || "");
  const [accessToken, setAccessTToken] = useState(localStorage.getItem('KARBON_accesstoken') || "");
  const [presaleID, setPresaleID] = useState(localStorage.getItem('KARBON_presaleid') || "");
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('KARBON_walletAddress') || "");
  const [referralCode, setReferralCOde] = useState(localStorage.getItem('KARBON_referralCode') || "");
  const [lastSignInTime, setLastSignInTime] = useState<number>(parseInt(localStorage.getItem('KARBON_lastSignInTime') || '0'));
  const [isAuthenticated, setAuthenticated] = useState<boolean>(JSON.parse(localStorage.getItem('KARBON_isAuthenticated') || 'false'));
  const [isGoogleSignIn, setIsGoogleSignIn] = useState<boolean>(JSON.parse(localStorage.getItem('KARBON_isGoogleSignIn') || 'false'));
  const [hasDisplayedConnectModal, setHasDisplayedConnectModal] = useState<boolean>(JSON.parse(localStorage.getItem('KARBON_displayedModalConnect') || 'false'));
  const [hasDisplayedDisclaimet, setHasDisplayedDisclaimet] = useState<boolean>(JSON.parse(localStorage.getItem('KARBON_displayedDisclaimerModal') || 'true'));
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const navigate = useNavigate();

  const clearAuthData = () => {
    navigate('/')
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

  };

  useEffect(() => {
    const checkSessionExpiration = () => {
      const currentTime = Date.now();
      if (lastSignInTime > 0 && currentTime - lastSignInTime > 10 * 60 * 60 * 1000) {
        clearAuthData();
      }
    };

    checkSessionExpiration();
    const intervalId = setInterval(checkSessionExpiration, 2000);

    return () => clearInterval(intervalId);
  }, [lastSignInTime]);

  useEffect(() => {
    localStorage.setItem('KARBON_lastSignInTime', lastSignInTime.toString());
  }, [lastSignInTime]);

  useEffect(() => {
    localStorage.setItem('KARBON_email', email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem('KARBON_UserID', UserID);
  }, [UserID]);

  useEffect(() => {
    localStorage.setItem('KARBON_password', password);
  }, [password]);

  useEffect(() => {
    localStorage.setItem('KARBON_presaleid', presaleID);
  }, [presaleID]);

  useEffect(() => {
    localStorage.setItem('KARBON_accesstoken', accessToken);
  }, [accessToken]);


  useEffect(() => {
    localStorage.setItem('KARBON_  walletAddress', walletAddress);
  }, [walletAddress]);

  useEffect(() => {
    localStorage.setItem('KARBON_referralCode', referralCode);
  }, [referralCode]);

  useEffect(() => {
    localStorage.setItem('KARBON_isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('KARBON_isGoogleSignIn', JSON.stringify(isGoogleSignIn));
  }, [isGoogleSignIn]);

  useEffect(() => {
    const displayedModalConnect = JSON.parse(localStorage.getItem('displayedModalConnect') || 'false');
    setHasDisplayedConnectModal(displayedModalConnect);
  }, [setHasDisplayedConnectModal]);


  useEffect(() => {
    const displayedDisclaimerModal = JSON.parse(localStorage.getItem('displayedDisclaimerModal') || 'true');
    setHasDisplayedDisclaimet(displayedDisclaimerModal);
  }, [setHasDisplayedDisclaimet]);


  return (
    <AuthContext.Provider value={{ email, setEmail, isAuthenticated, setAuthenticated, UserID, setUserID, password, setPassword, referralCode, setReferralCOde, setHasDisplayedConnectModal, hasDisplayedConnectModal, setWalletAddress, walletAddress, presaleID, setPresaleID, accessToken, setAccessTToken, isGoogleSignIn, setIsGoogleSignIn, lastSignInTime, setLastSignInTime, isDropDownOpen, setIsDropDownOpen, setHasDisplayedDisclaimet, hasDisplayedDisclaimet }}>
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
