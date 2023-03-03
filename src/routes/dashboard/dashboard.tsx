import * as React from 'react'
import { dashboardRoute } from '.'
import { router } from '../../router'

export const dashboardIndexRoute = dashboardRoute.createRoute({
  path: '/',
  element: <DashboardHome />,
})

function DashboardHome() {
  return (
    <div className="p-2">
      <div className="p-2">
        Welcome to the dashboard!
      </div>
    </div>
  )
}
