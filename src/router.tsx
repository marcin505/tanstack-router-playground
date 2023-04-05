import { createReactRouter, createRouteConfig } from '@tanstack/react-router'

import { indexRoute } from './routes'
import { dashboardRoute } from './routes/dashboard'
import { expensiveRoute } from './routes/expensive'
import { dashboardIndexRoute } from './routes/dashboard/dashboard'
import { moviesRoute } from './routes/dashboard/movies/movies'
import { movieRoute } from './routes/dashboard/movies/movie'
import { moviesStateRoute } from './routes/dashboard/moviesState/moviesState'
import { movieDetailsRoute } from './routes/dashboard/movieDetails/movieDetails'

const routeConfig = createRouteConfig().addChildren([
  indexRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    moviesRoute.addChildren([movieRoute]),
    moviesStateRoute,
    movieDetailsRoute,
  ]),
  expensiveRoute,
])

export const router = createReactRouter({
  routeConfig,
})
