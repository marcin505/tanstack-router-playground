import { createRouteConfig } from '@tanstack/react-router'
import * as React from 'react'
import { router } from '../router'

export const indexRoute = createRouteConfig().createRoute({
  path: '/',
  element: <Home />,
})

function Home() {
  const route = router.useMatch(indexRoute.id)

  return (
    <div className={`p-2`}>
      <div className={`text-lg`}>Welcome Home!</div>
      <hr className={`my-2`} />
      <route.Link
        to="/dashboard/invoices/:invoiceId"
        params={{
          invoiceId: 3,
        }}
        className={`py-1 px-2 text-xs bg-blue-500 text-white rounded-full`}
      >
        1 New Invoice
      </route.Link>
      <hr className={`my-2`} />
      <div className={`max-w-xl`}>
        As you navigate around take note of the UX. It should feel
        suspense-like, where routes are only rendered once all of their data and
        elements are ready.
        <hr className={`my-2`} />
        To exaggerate async effects, play with the artificial request delay
        slider in the bottom-left corner. You can also play with the default
        timings for displaying the pending fallbacks and the minimum time any
        pending fallbacks will remain shown.
        <hr className={`my-2`} />
        The last 2 sliders determine if link-hover preloading is enabled (and
        how long those preloads stick around) and also whether to cache rendered
        route data (and for how long). Both of these default to 0 (or off).
      </div>
    </div>
  )
}
