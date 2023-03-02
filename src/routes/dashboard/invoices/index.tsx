import { Outlet } from '@tanstack/react-router'
import * as React from 'react'
import { router } from '../../../router'
import { Spinner } from '../../../components/Spinner'
import { dashboardRoute } from '..'

export const invoicesRoute = dashboardRoute.createRoute({
  path: 'invoices',
  element: <Invoices />,
})

function Invoices() {
  const {
    loaderData: { invoices },
    Link,
    MatchRoute,
    useRoute,
  } = router.useMatch(invoicesRoute.id)

  // Get the action for a child route
  const invoiceIndexRoute = useRoute('./')
  const invoiceDetailRoute = useRoute('./:invoiceId')

  return (
    <div className="flex-1 flex">
      <div className="divide-y w-48">
        {invoices?.map((invoice) => {
          // console.log(foundPending);
          return (
            <div key={invoice.id}>
              <Link
                to="/dashboard/invoices/:invoiceId"
                params={{
                  invoiceId: `${invoice.id}`,
                }}
                preload="intent"
                className="block py-2 px-3 text-blue-700"
                activeProps={{ className: `font-bold` }}
              >
                <pre className="text-sm">
                  #{invoice.id} - {invoice.title.slice(0, 10)}{' '}

                  <MatchRoute
                    to="./:invoiceId"
                    params={{
                      invoiceId: `${invoice.id}`,
                    }}
                    pending
                  >
                    <Spinner />
                  </MatchRoute>

                </pre>
              </Link>
            </div>
          )
        })}
        {invoiceIndexRoute.action.submissions.map((action) => (
          <div key={action.submittedAt}>
            <a href="#" className="block py-2 px-3 text-blue-700">
              <pre className="text-sm">
                #<Spinner /> - {action.submission.title?.slice(0, 10)}
              </pre>
            </a>
          </div>
        ))}
      </div>
      <div className="flex-1 border-l border-gray-200">
        <Outlet />
      </div>
    </div>
  )
}
