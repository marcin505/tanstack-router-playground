import * as React from 'react';
import { dashboardRoute } from '..';
import { router } from '../../../router';
import { z } from 'zod';
import { parseSearchWith, stringifySearchWith } from '@tanstack/react-router'
import { Router } from '@tanstack/react-router'
import { Movie, MovieObject } from '../../../types';
import { Heading, MovieStateContainer, MovieRecord } from './styles';

const moviesStateSearchSchema = z.object({
  movies: z.array(MovieObject).optional(),
})


export const moviesStateRoute = dashboardRoute.createRoute({
  path: 'moviesState',
  element: <MoviesState />,
  validateSearch: (search) => moviesStateSearchSchema.parse(search),

})

function MoviesState() {
  const { search: { movies } } = router.useMatch(moviesStateRoute.id);
  console.log(movies);

  return (
    <MovieStateContainer>
      <Heading>Movies State</Heading>
      {movies?.length ?
        <>
          <div className="flex" style={{ fontWeight: 600, height: 30 }}>
            <span className="w-24" style={{ minWidth: 100 }}>#id</span>
            <span className="pl-3" style={{ width: 340 }}>keyword</span>
            <span className="pl-3">release year</span>
          </div>
          <div className="divide-y" style={{ maxHeight: 'calc(100vh - 500px)', minHeight: 200, overflowY: 'auto' }}>
            {(movies as Movie[]).map(movie => (
              <MovieRecord key={movie.id}>
                <span className="w-24" style={{ minWidth: 100 }}>#{movie.id}</span>
                <span className="pl-3" style={{ width: 340, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {movie.titleText.text}
                </span>
                <span className="pl-3">{movie.releaseDate?.year}</span>
              </MovieRecord>
            ))}
          </div>
        </>
        : <span>No movies in the search query</span>
      }
    </MovieStateContainer>
  )
}