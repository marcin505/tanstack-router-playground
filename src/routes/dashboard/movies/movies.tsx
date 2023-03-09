import * as React from 'react'
import { router } from '../../../router'
import { dashboardRoute } from '..'
import { Spinner } from '../../../components/Spinner';
import { countOptions } from '../../../utils';
import { fetchMovies } from '../../../api';
import { Outlet, SearchSchemaValidator, SearchSchemaValidatorObj } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import _debounce from 'lodash/debounce';
import { z } from 'zod'
import { Movie } from '../../../types';
import { PacmanLoader } from 'react-spinners';

const moviesSearchSchema = z.object({
  keyword: z.string().optional(),
  limit: z.number().optional(),
})

export const moviesRoute = dashboardRoute.createRoute({
  path: 'movies',
  element: <Movies />,
  validateSearch: (search) => moviesSearchSchema.parse(search)
})

function Movies() {
  const {
    Link,
    MatchRoute,
    useRoute,
    navigate,
    search: { keyword, limit }
  } = router.useMatch(moviesRoute.id);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (inputRef?.current === null) return;
    inputRef.current.focus();
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    debouncedSendRequest(signal)
    return () => controller.abort();
  }, [keyword, limit]);

  const sendRequest = React.useCallback(
    (signal?: AbortSignal) => {
      if (!keyword) {
        setMovies([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      fetchMovies({ keyword: keyword ?? '', limit: limit ?? 9, signal })
        .then(({ results }) => {
          setMovies(results)
          setLoading(false);
        })
    },
    [keyword, limit],
  )

  const debouncedSendRequest = React.useMemo(() => {
    return _debounce(sendRequest, 500);
  }, [sendRequest]);

  const updateSearchParam = React.useCallback((
    { searchParam, value }: {
      searchParam: string; value: string | number
    }
  ) => {
    navigate({
      search: old => {
        return {
          ...old,
          [searchParam]: value,
        }
      }
    })
  }, [])

  const onChange = React.useCallback((searchParam: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    updateSearchParam({ searchParam, value: searchParam === 'limit' ? parseInt(value) : value })
  }, []);

  return (
    <div className="flex-1 flex p-4">
      <div className="flex flex-col pr-4" style={{ maxWidth: 500, width: 500, minWidth: 500 }}>
        <div className="flex mb-4">
          <div className="flex flex-col" style={{ flexGrow: 1 }}>
            <span style={{ fontSize: 12 }}>keyword</span>
            <input
              value={keyword ?? ''}
              onChange={onChange('keyword')}
              placeholder="Search keyword..."
              className="border p-1 mr-2"
              ref={inputRef}
            />
          </div>
          <div className="flex flex-col">
            <span style={{ fontSize: 12 }}>limit</span>
            <select
              className="flex-1 border"
              onChange={onChange('limit')}
              value={limit}
              style={{ width: 50 }}
            >
              {countOptions.map(option => <option key={option.value} children={option.label} />)}
            </select>
          </div>
        </div>
        {loading &&
          <PacmanLoader color="#159d96f3" size={40} speedMultiplier={2.1} />
        }
        {!!movies?.length && !loading &&
          <>
            <div className="flex" style={{ background: 'white', height: 30 }}>
              <span className="w-24">#id</span>
              <span className="pl-3">
                keyword
          </span>
            </div>
            <div className="divide-y" style={{ maxHeight: 'calc(100vh - 310px)', minHeight: 200, overflowY: 'auto' }}>
              {(movies as Movie[]).map(movie => {
                return (
                  <div key={movie.id} className="block py-2 ">
                    <pre className="text-sm flex">
                      <Link
                        to="/dashboard/movies/:movieId"
                        params={{
                          movieId: `${movie.id}`,
                        }}
                        search={{ keyword, limit }}
                        // preload="intent"
                        className="flex text-blue-700"
                        activeProps={{ className: `font-bold` }}
                      >
                        <span className="w-24">#{movie.id}</span>
                        <span className="pl-3" style={{ width: 330, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {movie.titleText.text}
                        </span>
                        <MatchRoute
                          to="/dashboard/movies/:movieId"
                          params={{
                            movieId: movie.id,
                          }}
                          pending
                        >
                          <Spinner />
                        </MatchRoute>
                      </Link>
                    </pre>
                  </div>
                )
              })}
            </div>
          </>
        }
        {!movies.length && !loading &&
          <span>No results found</span>
        }
      </div>
      <div className="flex flex-grow-1" style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
    </div >
  )
}