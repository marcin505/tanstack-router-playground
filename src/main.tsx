import React from 'react'
import ReactDOM from 'react-dom/client'
import { Outlet, RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import ClipLoader from "react-spinners/ClipLoader";
import { router } from './router'
import { Spinner } from './components/Spinner'
import { useSessionStorage } from './utils'

function App() {

  return (
    <>
      {/* More stuff to tweak our sandbox setup in real-time */}
      <RouterProvider
        router={router}

      >
        {/* Normally <Router /> acts as it's own outlet,
            but if we pass it children, route matching is 
            deferred until the first <Outlet /> is found. */}
        <Root />
      </RouterProvider>
      <TanStackRouterDevtools router={router} position="bottom-right" initialIsOpen={true} />
    </>
  )
}

function Root() {
  const routerState = router.useState()

  return (
    <div className={`min-h-screen flex flex-col`}>
      <div className={`flex items-center border-b gap-2`}>
        <h1 className={`text-3xl p-2`}>Kitchen Sink</h1>
        {/* Show a global spinner when the router is transitioning */}
        <div
          className={`text-3xl duration-300 delay-0 opacity-0 ${routerState.status === 'loading' || routerState.isFetching
            ? ` duration-1000 opacity-40`
            : ''
            }`}
        >
          <Spinner />
        </div>
      </div>
      <div className={`flex flex-col`}>
        <div className="flex">
          {(
            [
              ['.', 'Home'],
              ['/dashboard', 'Dashboard'],
              ['/expensive', 'Expensive'],
              // ['/authenticated', 'Authenti\cated'],
              // ['/layout-a', 'Layout A'],
              // ['/layout-b', 'Layout B'],
            ] as const
          ).map(([to, label]) => {
            return (
              <div key={to}>
                <router.Link
                  to={to}
                  activeOptions={
                    {
                      // If the route points to the root of it's parent,
                      // make sure it's only active if it's exact
                      // exact: to === '.',
                    }
                  }
                  className={`block py-2 px-3 text-blue-700`}
                  // Make "active" links bold
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
