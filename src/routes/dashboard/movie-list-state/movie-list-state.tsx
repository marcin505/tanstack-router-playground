import * as React from 'react';
import { dashboardRoute } from '..';
import { router } from '../../../router';
import { z } from 'zod';
import { Movie, MovieObject } from '../../../types';
import { Heading, MovieStateContainer, MovieRecord } from './styles';

const movieListStateSearchSchema = z.object({
  movieList: z.array(MovieObject).optional(),
});

export const movieListStateRoute = dashboardRoute.createRoute({
  path: 'movie-list-state',
  element: <MovieListState />,
  validateSearch: (search) => movieListStateSearchSchema.parse(search),
});

function MovieListState() {
  const {
    search: { movieList },
  } = router.useMatch(movieListStateRoute.id);
  // console.log(movieList);

  return (
    <MovieStateContainer>
      <Heading>MovieList State</Heading>
      {movieList?.length ? (
        <>
          <div className="flex" style={{ fontWeight: 600, height: 30 }}>
            <span className="w-24" style={{ minWidth: 100 }}>
              #id
            </span>
            <span className="pl-3" style={{ width: 340 }}>
              keyword
            </span>
            <span className="pl-3">release year</span>
          </div>
          <div
            className="divide-y"
            style={{ maxHeight: 'calc(100vh - 500px)', minHeight: 200, overflowY: 'auto' }}
          >
            {(movieList as Movie[]).map((movie) => (
              <MovieRecord key={movie.id}>
                <span className="w-24" style={{ minWidth: 100 }}>
                  #{movie.id}
                </span>
                <span
                  className="pl-3"
                  style={{
                    width: 340,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {movie.titleText.text}
                </span>
                <span className="pl-3">{movie.releaseDate?.year}</span>
              </MovieRecord>
            ))}
          </div>
        </>
      ) : (
        <span>No movieList in the search query</span>
      )}
    </MovieStateContainer>
  );
}
