import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PAGES } from '@/shared/constants';
import { tokenManagerUtils } from '@/shared/utils';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const accessToken = tokenManagerUtils.getToken();
  const refreshToken = tokenManagerUtils.getRefreshToken();
  const navigate = useNavigate();

  const isAuthenticated = !(
    (accessToken && tokenManagerUtils.isTokenExpired(accessToken)) ||
    (refreshToken && tokenManagerUtils.isTokenExpired(refreshToken))
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PAGES.logIn);
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}
