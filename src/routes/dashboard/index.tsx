import { createRouteConfig, Outlet } from '@tanstack/react-router'
import * as React from 'react'

import { router } from '../../router'
import { fetchInvoices } from '../../mockTodos'

export const dashboardRoute = createRouteConfig().createRoute({
  path: 'dashboard',
  element: <Dashboard />,
  loader: async () => {
    console.log('Fetching all invoices...')
    return {
      invoices: await fetchInvoices(),
    }
  },
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
            ['/dashboard/invoices', 'Invoices'],
            ['/dashboard/users', 'Users'],
          ] as const
        ).map(([to, label, search]) => {
          return (
            <route.Link
              key={to}
              to={to}
              search={search}
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
