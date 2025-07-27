import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/app/configs';
import { tokenManagerUtils } from '@/shared/utils';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const accessToken = tokenManagerUtils.getToken();
  const refreshToken = tokenManagerUtils.getRefreshToken();

  const isAuthenticated = !(
    (accessToken && tokenManagerUtils.isTokenExpired(accessToken)) ||
    (refreshToken && tokenManagerUtils.isTokenExpired(refreshToken))
  );

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to={ROUTES.logIn} replace />;
  }

  return null;
}
