import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthLayout, DefaultLayout } from '@/layouts';
import AboutPage from '@/pages/about-page';
import Login from '@/pages/login';
import NotFoundPage from '@/pages/not-found-page';
import { PAGES } from '@/shared/constants';

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<DefaultLayout />}></Route>

      <Route path='auth' element={<AuthLayout />}>
        <Route index element={<Navigate replace to={PAGES.logIn} />} />
        <Route path={PAGES.logIn} element={<Login />} />
      </Route>

      <Route path={PAGES.about} element={<AboutPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
