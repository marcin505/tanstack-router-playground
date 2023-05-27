import { createRouteConfig } from '@tanstack/react-router';
import * as React from 'react';
import { router } from '../router';

export const indexRoute = createRouteConfig().createRoute({
  path: '/',
  element: <Home />,
});

function Home() {
  const route = router.useMatch(indexRoute.id);

  return (
    <div className={`p-2`}>
      <div className={`text-lg`}>Home Route</div>
    </div>
  );
}
