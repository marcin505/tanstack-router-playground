import * as React from 'react'
import { router } from '../../../router'
import { dashboardRoute } from '..'
import { Spinner } from '../../../components/Spinner';
import { countOptions } from '../../../utils';
import { fetchMovies } from '../../../api';
import { Outlet } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import _debounce from 'lodash/debounce';
import { z } from 'zod'
import { Movie } from '../../../types';
import { PacmanLoader } from 'react-spinners';

const moviesSearchSchema = z.object({
  title: z.string().optional(),
  count: z.number().optional(),
  movieId: z.string().optional(),
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
    search: { title, count }
  } = router.useMatch(moviesRoute.id);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (inputRef?.current === null) return;
    inputRef.current.focus();
    console.log({ title, count: typeof count })
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    debouncedSendRequest(signal)
    return () => controller.abort();
  }, [title, count]);


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


  const sendRequest = React.useCallback(
    (signal?: AbortSignal) => {
      if (!title) {
        setMovies([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      fetchMovies({ keyword: title ?? '', limit: count ?? 9, signal })
        .then(({ results }) => {
          setMovies(results)
          setLoading(false);
        })
    },
    [title, count],
  )

  const debouncedSendRequest = React.useMemo(() => {
    return _debounce(sendRequest, 500);
  }, [sendRequest]);

  const onTitleChange = React.useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      console.log(value);
      updateSearchParam({ searchParam: 'title', value })
    },
    [],
  );

  const onCountChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    updateSearchParam({ searchParam: 'count', value: parseInt(value) })
  }, []);

  return (
    <div className="flex-1 flex p-4">
      <div className="flex flex-col pr-4" style={{ width: 500 }}>
        <div className="flex mb-4">
          <input
            value={title ?? ''}
            onChange={onTitleChange}
            placeholder="Search title..."
            className="border p-1 mr-2"
            style={{ flexGrow: 1 }}
            ref={inputRef}
          />
          <select
            className="flex-1 border"
            onChange={onCountChange}
            value={count}
          >
            {countOptions.map(option => <option key={option.value} children={option.label} />)}
          </select>
        </div>
        <div className="divide-y">
          {loading &&
            <PacmanLoader color="#571172f3" />
          }
          {!!movies?.length && !loading &&
            (movies as Movie[]).map(movie => {
              return (
                <div key={movie.id} className="block py-2 ">
                  <pre className="text-sm flex">
                    <Link
                      to="/dashboard/movies/:movieId"
                      params={{
                        movieId: `${movie.id}`,
                      }}
                      search={{ title, count }}
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
          {!movies.length && !loading &&
            <span>No results found</span>
          }
        </div>
      </div>
      <div className="flex flex-grow-1" style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
    </div >
  )
}

