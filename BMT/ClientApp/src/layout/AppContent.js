import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// routes config

import { useSelector } from 'react-redux';
import Loading from 'src/components/UI/Loading';
import Page404 from 'src/pages/Error/Page404';
import { rolesRoutes, routes } from 'src/routes';
import '../CSS/Form.css';
import '../CSS/Style.css';
import '../scss/style.scss';

const AppContent = () => {
  const nav = useSelector((state) => state.navItems.navItems);

  const matchingRoutes = rolesRoutes.filter((roleRoute) =>
    nav.some(
      (item) =>
        item.items.some((nestedItem) => nestedItem.to === roleRoute.path) ||
        item.to === roleRoute.path,
    ),
  );
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {matchingRoutes.map((route, idx) => {
          return (
            route.element && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={<route.element />}
              />
            )
          );
        })}
        {routes.map((route, idx) => {
          return (
            route.element && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={<route.element />}
              />
            )
          );
        })}
        <Route path="*" element={<Page404 />} />

        {/* <Route path="/" element={<Navigate to="dashboard" replace />} /> */}
      </Routes>
    </Suspense>
  );
};

export default React.memo(AppContent);
