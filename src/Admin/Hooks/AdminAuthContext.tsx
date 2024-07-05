// src/Contexts/AdminAuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  connectWallet: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_WALLET_ADDRESS = "0x7A9907da563fc9C80265a846F08b2ca413177F03"; 

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();
  const {disconnect } = useDisconnect();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });

  useEffect(() => {
    if (isConnected && address === ADMIN_WALLET_ADDRESS) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin')
    } else {
      setIsAuthenticated(false);
      disconnect();
      localStorage.removeItem('isAdminAuthenticated');
    }
  }, [isConnected, address]);

  const connectWallet = async () => {
    if (isConnected && address === ADMIN_WALLET_ADDRESS) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, connectWallet }}>
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
