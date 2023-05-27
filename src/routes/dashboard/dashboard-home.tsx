import * as React from 'react';
import { dashboardRoute } from '.';
export const DbHomeRoute = dashboardRoute.createRoute({
  path: '/',
  element: <DbHome />,
});

function DbHome() {
  return (
    <div className="p-2">
      <div className="p-2">Welcome to the dashboard!</div>
    </div>
  );
}
