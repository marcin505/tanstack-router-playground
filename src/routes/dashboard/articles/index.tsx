import * as React from 'react'
import { router } from '../../../router'
import { dashboardRoute } from '..'
import { Spinner } from '../../../components/Spinner';
import { Article, fetchArticles, getArticles, OptionType } from '../../../utils';
import { Outlet } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import _debounce from 'lodash/debounce';
import { z } from 'zod'

const articlesSearchSchema = z.object({
  title: z.string().optional(),
  articleId: z.string().optional(),
})

export const articlesRoute = dashboardRoute.createRoute({
  path: 'articles',
  element: <Articles />,
  validateSearch: (search) => articlesSearchSchema.parse(search)
})

function Articles() {
  const {
    Link,
    MatchRoute,
    useRoute,
    navigate,
    search: { title }
  } = router.useMatch(articlesRoute.id);

  const articles: Article[] | unknown = useQuery(['articles', title], () => {
    return title?.length ? getArticles(title) : [];
  }, { refetchOnMount: false }).data ?? [];

  const onTitleChange = React.useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      navigate({
        search: old => {
          return {
            ...old,
            ...(value ? { title: value } : undefined),
          }
        }
      })
    },
    [],
  )

  return (
    <div className="flex-1 flex-col">
      <div className="flex-1">
        <input
          value={title}
          onChange={onTitleChange}
          placeholder="Search title..."
          className="min-w-0 flex-1 border p-1 px-2 rounded"
        />
      </div>
      <div className="divide-y">
        {
          (articles as Article[]).map(article => {
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
                      to="/dashboard/articles/:articleId"
                      params={{
                        articleId: article.id,
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

