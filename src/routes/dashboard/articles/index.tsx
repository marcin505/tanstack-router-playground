import * as React from 'react'
import { router } from '../../../router'
import { dashboardRoute } from '..'
import { Spinner } from '../../../components/Spinner';
import { Article, fetchMovies } from '../../../utils';
import { Outlet } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import _debounce from 'lodash/debounce';
import { z } from 'zod'
import { Movie } from '../../../types';

const articlesSearchSchema = z.object({
  title: z.string().optional(),
  movieId: z.string().optional(),
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

  const [movies, setMovies] = React.useState<Movie[]>([]);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    debouncedSendRequest(signal)
    return () => controller.abort();
  }, [title]);

  const onTitleChange = React.useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      console.log(value);
      navigate({
        search: old => {
          return {
            ...old,
            title: value,
          }
        }
      })
    },
    [],
  );

  const sendRequest = React.useCallback(
    (signal: AbortSignal) => {
      if (!title) {
        setMovies([]);
        return;
      }
      fetchMovies({ keyword: title ?? '', signal }).then(({ results }) => {
        setMovies(results)
      })
    },
    [title],
  )

  const debouncedSendRequest = React.useMemo(() => {
    return _debounce(sendRequest, 500);
  }, [sendRequest]);

  return (
    <div className="flex-1 flex-col" style={{ padding: 10 }}>
      <div className="flex flex-col">
        <div className="flex-1" >
          <input
            value={title ?? ''}
            onChange={onTitleChange}
            placeholder="Search title..."
            className="flex-1 border p-1"
            style={{ width: '100%', margin: '20px 0' }}
          />
        </div>
        <div className="divide-y">
          {!!movies?.length &&
            (movies as Movie[]).map(movie => {
              return (
                <div key={movie.id}>
                  <Link
                    to="/dashboard/articles/:movieId"
                    params={{
                      movieId: `${movie.id}`,
                    }}
                    search={{ title }}
                    // preload="intent"
                    className="block py-2 px-3 text-blue-700"
                    activeProps={{ className: `font-bold` }}
                  >
                    <pre className="text-sm">
                      #{movie.id} - {movie.titleText.text}
                      <MatchRoute
                        to="/dashboard/articles/:movieId"
                        params={{
                          movieId: movie.id,
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
    </div>
  )
}

