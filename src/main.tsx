import React from 'react';
import ReactDOM from 'react-dom/client';
import { Outlet, RouterProvider } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { router } from './router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
            position="top-right"
            toggleButtonProps={{
              style: {
                transform: `scale(.6)`,
                transformOrigin: 'top right',
                position: 'absolute',
                top: 0,
              },
            }}
          />
        </RouterProvider>
      </QueryClientProvider>
    </>
  );
}

function Root() {
  const routerState = router.useState();

  return (
    <div className={`flex flex-col`}>
      <div className={`flex flex-col`}>
        <div className="flex">
          <div className="flex">
            <router.Link
              to={'/'}
              className={`block py-2 px-3 text-blue-700`}
              activeProps={{ className: `font-bold` }}
            >
              Home
            </router.Link>
            <router.Link
              className={`block py-2 px-3 text-blue-700`}
              activeProps={{ className: `font-bold` }}
              to={'/dashboard'}
            >
              Dashboard
            </router.Link>
            <router.Link
              to={'/expensive'}
              className={`block py-2 px-3 text-blue-700`}
              activeProps={{ className: `font-bold` }}
            >
              Expensive
            </router.Link>
          </div>
        </div>
        <div className={`flex-1 border-l border-gray-200`}>
          {/* Render our first route match */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
