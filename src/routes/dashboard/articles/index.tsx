import { dashboardRoute } from '..'
import { router } from '../../../router'
import * as React from 'react'
import { Spinner } from '../../../components/Spinner';
import { Article, fetchArticles } from '../../../utils';
import { Outlet } from '@tanstack/react-router';
import { queryClient } from '../../../main';
import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, QueryObserverOptions } from '@tanstack/react-query';
import _debounce from 'lodash/debounce';

const getArticles = (title: string): Promise<Article[]> => fetchArticles(title).then(({ hits }) => {
  const articles = hits.map(article => ({ ...article, id: article.objectID }))
  return articles;
});

const queryOptions: Partial<UseQueryOptions> = { refetchOnMount: false };

export const articlesRoute = dashboardRoute.createRoute({
  path: 'articles',
  element: <Articles />,
})

function Articles() {
  const {
    Link,
    MatchRoute,
    useRoute,
    navigate,
    search: { title }
  } = router.useMatch(articlesRoute.id);

  const [titleQuery, setTitleQuery] = React.useState(title);

  const articles: Article[] = useQuery(['articles', titleQuery], () => {
    return titleQuery.length ? getArticles(titleQuery) : [];
  }, queryOptions).data ?? [];

  const onChangeHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) {
        setTitleQuery('');
        navigate({ search: undefined })
        return;
      }
      setTitleQuery(e.target.value)
    },
    [setTitleQuery],
  )

  const debounce = React.useCallback(() => {
    _debounce(e => {
      onChangeHandler(e)
    }, 800)
  }, [])

  React.useEffect(() => {
    navigate({
      search: searchQuery => (titleQuery ? {
        ...searchQuery, title: titleQuery
      } : undefined
      )
    })
  }, [titleQuery]);

  return (
    <div className="flex-1 flex-col">
      <input
        value={titleQuery}
        onChange={onChangeHandler}
        placeholder="Search title..."
        className="min-w-0 flex-1 border p-1 px-2 rounded"
      />
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

