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
        <route.Link
          to={'.'}
          search={{}}
          activeOptions={{ exact: true }}
          activeProps={{ className: `font-bold` }}
          className="p-2"
        >
          DB Home
        </route.Link>
        <route.Link
          to={'/dashboard/movie-list'}
          search={{ limit: 6 }}
          activeProps={{ className: `font-bold` }}
          className="p-2"
        >
          Movie List
        </route.Link>
        <route.Link
          to={'/dashboard/movie-list-state'}
          search={{
            movieList: searchCachedResult,
          }}
          activeProps={{ className: `font-bold` }}
          className="p-2"
        >
          Movie List State from URL
        </route.Link>
        <route.Link
          to={'/dashboard/movie-details'}
          search={{}}
          activeProps={{ className: `font-bold` }}
          className="p-2"
        >
          Movie Details
        </route.Link>
      </div>
      <hr />
      <Outlet />
    </>
  );
}
