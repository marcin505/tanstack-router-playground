import { createRouteConfig, Outlet } from '@tanstack/react-router';
import * as React from 'react';

import { router } from '../../router';
import { getCurrenSearchCachedResult } from '../../utils';

export const dashboardRoute = createRouteConfig().createRoute({
  path: 'dashboard',
  element: <Dashboard />,
});

interface MovieListSearchParams {
  readonly keyword?: string;
  readonly limit?: number;
}

function Dashboard() {
  const route = router.useMatch(dashboardRoute.id);
  const { search } = route;

  const searchCachedResult = React.useMemo(() => {
    const { keyword, limit } = {
      keyword: (search as MovieListSearchParams)?.keyword,
      limit: (search as MovieListSearchParams)?.limit,
    };
    return getCurrenSearchCachedResult({ keyword, limit });
  }, [search]);

  return (
    <>
      <div className="flex items-center border-b">
        <h2 className="text-xl p-2">Dashboard</h2>
      </div>
      <div className="flex flex-wrap divide-x">
        {(
          [
            { path: '.', label: 'DB Home', searchParams: {} },
            { path: '/dashboard/movie-list', label: 'Movie List', searchParams: { limit: 6 } },
            {
              path: '/dashboard/movie-list-state',
              label: 'Movie List from URL',
              searchParams: {
                movieList: searchCachedResult,
                disabled: !searchCachedResult,
              },
            },
            { path: '/dashboard/movie-details', label: 'Movie Details', searchParams: {} },
          ] as const
        ).map(({ path, label, searchParams }) => {
          return (
            <route.Link
              key={path}
              to={path}
              search={searchParams}
              activeOptions={{ exact: path === '.' }}
              activeProps={{ className: `font-bold` }}
              className="p-2"
            >
              {label}
            </route.Link>
          );
        })}
      </div>
      <hr />
      <Outlet />
    </>
  );
}
