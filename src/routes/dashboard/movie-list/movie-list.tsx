import * as React from 'react';
import { router } from '../../../router';
import { dashboardRoute } from '..';
import { Spinner } from '../../../components/Spinner';
import { countOptions, getCurrenSearchCachedResult } from '../../../utils';
import { fetchMovieList } from '../../../api';
import { Outlet } from '@tanstack/react-router';
import _debounce from 'lodash/debounce';
import { z } from 'zod';
import { Movie } from '../../../types';
import { PacmanLoader } from 'react-spinners';
import { MovieRecord, Button } from './styles';
import { queryClient } from '../../../main';

const movieListSearchSchema = z.object({
  keyword: z.string().optional(),
  limit: z.number().optional(),
});

export const movieListRoute = dashboardRoute.createRoute({
  path: 'movie-list',
  element: <MovieList />,
  validateSearch: (search) => movieListSearchSchema.parse(search),
});

function MovieList() {
  const {
    Link,
    MatchRoute,
    useRoute,
    navigate,
    search: { keyword, limit },
  } = router.useMatch(movieListRoute.id);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [movieList, setMovieList] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (inputRef?.current === null) return;
    inputRef.current.focus();
  }, []);

  React.useEffect(() => {
    const currentSearchCached: Movie[] | undefined = getCurrenSearchCachedResult({
      keyword,
      limit,
    });
    // console.log(45, currentSearchCached);
    if (currentSearchCached) {
      setMovieList(currentSearchCached);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    debouncedSendRequest(signal);
    return () => controller.abort();
  }, [keyword, limit]);

  const sendRequest = React.useCallback(
    (signal?: AbortSignal) => {
      if (!keyword) {
        setMovieList([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      fetchMovieList({ keyword: `${keyword}` ?? '', limit: limit ?? 9, signal }).then(
        ({ results: movieList }) => {
          if (movieList.length) {
            queryClient.setQueryData([`${keyword}`, limit], movieList);
          }
          setMovieList(movieList);
          console.log(movieList);
          setLoading(false);
        }
      );
    },
    [keyword, limit]
  );

  const debouncedSendRequest = React.useMemo(() => {
    return _debounce(sendRequest, 900);
  }, [sendRequest]);

  const updateSearchParam = React.useCallback(
    ({ searchParam, value }: { searchParam: string; value: string | number }) => {
      navigate({
        search: (old) => {
          return {
            ...old,
            [searchParam]: value,
          };
        },
      });
    },
    []
  );

  const onChange = React.useCallback(
    (searchParam: 'limit' | 'keyword') =>
      ({ target: { value } }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateSearchParam({
          searchParam,
          value: searchParam === 'limit' ? parseInt(value) : value,
        });
      },
    []
  );

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
              {countOptions.map((option) => (
                <option key={option.value} children={option.label} />
              ))}
            </select>
          </div>
        </div>
        {loading && <PacmanLoader color="#159d96f3" size={40} speedMultiplier={2.1} />}
        {!!movieList?.length && !loading && (
          <>
            <div className="flex" style={{ height: 30, fontWeight: 600 }}>
              <span className="w-24">id</span>
              <span className="pl-3">keyword</span>
            </div>
            <div
              className="divide-y"
              style={{ maxHeight: 'calc(100vh - 310px)', minHeight: 200, overflowY: 'auto' }}
            >
              {(movieList as Movie[]).map((movie) => {
                return (
                  <MovieRecord key={movie.id}>
                    <pre className="text-sm flex">
                      <Link
                        to="/dashboard/movie-list/:movieId"
                        params={{
                          movieId: `${movie.id}`,
                        }}
                        search={{ keyword, limit }}
                        // preload="intent"
                        className="flex text-blue-700"
                        activeProps={{ className: `font-bold` }}
                      >
                        <span className="w-24">#{movie.id}</span>
                        <span
                          className="pl-3"
                          style={{ width: 330, textOverflow: 'ellipsis', overflow: 'hidden' }}
                        >
                          {movie.titleText.text}
                        </span>
                        <MatchRoute
                          to="/dashboard/movie-list/:movieId"
                          params={{
                            movieId: movie.id,
                          }}
                          pending
                        >
                          <Spinner />
                        </MatchRoute>
                      </Link>
                    </pre>
                  </MovieRecord>
                );
              })}
            </div>
          </>
        )}
        {!movieList.length && !loading && <span>No results found</span>}
        {!!movieList?.length && !loading && (
          <Link
            to="/dashboard/movie-list-state"
            search={{
              movieList,
            }}
          >
            <Button type="button">Go to movieList state</Button>
          </Link>
        )}
      </div>
      <div className="flex flex-grow-1" style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}
