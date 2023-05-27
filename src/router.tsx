import { createReactRouter, createRouteConfig } from '@tanstack/react-router';

import { indexRoute } from './routes';
import { dashboardRoute } from './routes/dashboard';
import { expensiveRoute } from './routes/expensive';
import { dashboardIndexRoute } from './routes/dashboard/dashboard';
import { movieListRoute } from './routes/dashboard/movie-list/movie-list';
import { movieRoute } from './routes/dashboard/movie-list/movie';
import { movieListStateRoute } from './routes/dashboard/movie-list-state/movie-list-state';
import { movieDetailsRoute } from './routes/dashboard/movie-details/movie-details';

const routeConfig = createRouteConfig().addChildren([
  indexRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    movieListRoute.addChildren([movieRoute]),
    movieListStateRoute,
    movieDetailsRoute,
  ]),
  expensiveRoute,
]);

export const router = createReactRouter({
  routeConfig,
});
