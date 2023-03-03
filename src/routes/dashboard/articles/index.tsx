import { dashboardRoute } from '..'
import { router } from '../../../router'
import * as React from 'react'
import { Spinner } from '../../../components/Spinner';
import { Article, fetchArticles } from '../../../utils';
import { Outlet } from '@tanstack/react-router';

export const articlesRoute = dashboardRoute.createRoute({
  path: 'articles',
  element: <Articles />,
  loader: async () => {
    console.log('Fetching all articles...')
    const articles = await fetchArticles('react')
    return {
      articles,
    }
  },
})

function Articles() {
  const {
    loaderData: { articles },
    Link,
    MatchRoute,
    useRoute,
  } = router.useMatch(articlesRoute.id);

  // const articlesIndexRoute = useRoute('./');
  // const articleDetailsRoute = useRoute('./:articleId');
  return (
    <div className="flex-1 flex">
      <div className="divide-y">
        {!!(articles as Article[]).length &&
          (articles as Article[])?.map(article => {
            return (
              <div key={article.id}>
                <Link
                  to="/dashboard/articles/:articleId"
                  params={{
                    articleId: `${article.id}`,
                  }}
                  preload="intent"
                  className="block py-2 px-3 text-blue-700"
                  activeProps={{ className: `font-bold` }}
                >
                  <pre className="text-sm">
                    #{article.id} - {article.title}

                    <MatchRoute
                      to="./:id"
                      params={{
                        id: article.id,
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
      </div>
      <div className="flex-1 border-l border-gray-200">
        <Outlet />
      </div>
    </div>
  )
}

