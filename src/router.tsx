import { createReactRouter, createRouteConfig } from '@tanstack/react-router'

import { indexRoute } from './routes'
import { dashboardRoute } from './routes/dashboard'
import { expensiveRoute } from './routes/expensive'
import { dashboardIndexRoute } from './routes/dashboard/dashboard'
import { invoicesRoute } from './routes/dashboard/invoices'
import { usersRoute } from './routes/dashboard/users'
import { invoicesIndexRoute } from './routes/dashboard/invoices/invoices'
import { invoiceRoute } from './routes/dashboard/invoices/invoice'
import { usersIndexRoute } from './routes/dashboard/users/users'
import { userRoute } from './routes/dashboard/users/user'
import { articlesRoute } from './routes/dashboard/articles'

const routeConfig = createRouteConfig().addChildren([
  indexRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    articlesRoute,
    invoicesRoute.addChildren([invoicesIndexRoute, invoiceRoute]),
    usersRoute,
  ]),
  expensiveRoute,
])

export const router = createReactRouter({
  routeConfig,
})
