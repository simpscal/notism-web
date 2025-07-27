import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/app/configs';
import { AuthLayout, DefaultLayout } from '@/layouts';
import AboutPage from '@/pages/about';
import Login from '@/pages/login';
import NotFoundPage from '@/pages/not-found';

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<DefaultLayout />}></Route>

      <Route path='auth' element={<AuthLayout />}>
        <Route index element={<Navigate replace to={ROUTES.logIn} />} />
        <Route path={ROUTES.logIn} element={<Login />} />
      </Route>

      <Route path={ROUTES.about} element={<AboutPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
