import { createRouteConfig, Outlet } from '@tanstack/react-router';
import * as React from 'react';

import { router } from '../../router';
import { getCurrenSearchCachedResult } from '../../utils';

export const dashboardRoute = createRouteConfig().createRoute({
  path: 'dashboard',
  element: <Dashboard />,
});

interface MoviesSearchParams {
  readonly keyword?: string;
  readonly limit?: number;
}

function Dashboard() {
  const route = router.useMatch(dashboardRoute.id);
  const { search } = route;

  // console.log(route, search);

  const searchCachedResult = React.useMemo(() => {
    const { keyword, limit } = {
      keyword: (search as MoviesSearchParams)?.keyword,
      limit: (search as MoviesSearchParams)?.limit,
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
            { path: '.', label: 'Summary', searchParams: {} },
            { path: '/dashboard/movies', label: 'Movies', searchParams: { limit: 6 } },
            {
              path: '/dashboard/moviesState',
              label: 'Movies from URL',
              searchParams: {
                movies: searchCachedResult,
                disabled: !searchCachedResult,
              },
            },
            { path: '/dashboard/movieDetails', label: 'Movie Details', searchParams: {} },
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
