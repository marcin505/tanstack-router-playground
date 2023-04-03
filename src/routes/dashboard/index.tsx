import { createRouteConfig, Outlet } from '@tanstack/react-router'
import * as React from 'react'

import { router } from '../../router';

export const dashboardRoute = createRouteConfig().createRoute({
  path: 'dashboard',
  element: <Dashboard />,
})

function Dashboard() {
  const route = router.useMatch(dashboardRoute.id)

  return (
    <>
      <div className="flex items-center border-b">
        <h2 className="text-xl p-2">Dashboard</h2>

      </div>
      <div className="flex flex-wrap divide-x">
        {(
          [
            ['.', 'Summary'],
            ['/dashboard/movies', 'Movies', { limit: 3 }],
            // ['/dashboard/moviesState', 'Movies State']
            // ['/dashboard/users', 'Users'],
          ] as const
        ).map(([to, label, searchParams]) => {
          return (
            <route.Link
              key={to}
              to={to}
              search={searchParams}
              activeOptions={{ exact: to === '.' }}
              activeProps={{ className: `font-bold` }}
              className="p-2"
            >
              {label}
            </route.Link>
          )
        })}
      </div>
      <hr />
      <Outlet />
    </>
  )
}
