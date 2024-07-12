// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext.tsx';


const AdminProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAdminAuthenticated } = useAdminAuth();

  if (!isAdminAuthenticated) {
    return <Navigate to="/adminSignin" />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
