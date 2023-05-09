import React from 'react'
import ReactDOM from 'react-dom/client'
import { Outlet, RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import ClipLoader from "react-spinners/ClipLoader";
import { router } from './router'
import { Spinner } from './components/Spinner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export const queryClient = new QueryClient();

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <Root />
          <TanStackRouterDevtools router={router} position="bottom-right" initialIsOpen={true} />
          <ReactQueryDevtools
            initialIsOpen
            position="bottom-left"
            toggleButtonProps={{
              style: {
                transform: `scale(.7)`,
                transformOrigin: 'top right',
                position: 'absolute',
                top: 0,
              },
            }}
          />
        </RouterProvider>
      </QueryClientProvider>
    </>
  )
}

function Root() {
  const routerState = router.useState()

  return (
    <div className={`flex flex-col`}>
      <div className={`flex flex-col`}>
        <div className="flex">
          {(
            [
              ['.', 'Home'],
              ['/dashboard', 'Dashboard'],
              ['/expensive', 'Expensive'],
            ] as const
          ).map(([to, label]) => {
            return (
              <div key={to}>
                <router.Link
                  to={to}
                  className={`block py-2 px-3 text-blue-700`}
                  activeProps={{ className: `font-bold` }}
                >
                  {label}
                </router.Link>
              </div>
            )
          })}
        </div>
        <div className={`flex-1 border-l border-gray-200`}>
          {/* Render our first route match */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
