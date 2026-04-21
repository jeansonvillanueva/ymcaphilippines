import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { ADMIN_API_URL } from '../hooks/useApi';

const AUTH_STATUS_URL = `${ADMIN_API_URL}/status`;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authState, setAuthState] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const response = await axios.get(AUTH_STATUS_URL);

        if (!mounted) return;
        if (response.data?.authenticated) {
          setAuthState('authorized');
        } else {
          setAuthState('unauthorized');
        }
      } catch (error) {
        if (!mounted) return;
        setAuthState('unauthorized');
      }
    };

    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  if (authState === 'loading') {
    return null;
  }

  if (authState === 'unauthorized') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
