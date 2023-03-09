import * as React from 'react';
import { router } from '../../../router'
import { useQuery } from '@tanstack/react-query';
import { moviesRoute } from './movies';
import { z } from 'zod';
import { fetchMovie } from '../../../api';
import { dashboardRoute } from '..';

const width = 55;

export const movieRoute = moviesRoute.createRoute({
  path: ':movieId',
  // parseParams: (params) => ({
  //   movieId: z.string().parse(params.movieId),
  // }),
  // stringifyParams: ({ movieId }) => ({ movieId: `${movieId}` }),
  // validateSearch: (search) => movieSearchSchema.parse(search),
  element: <MovieView />,
  loader: async ({ params: { movieId } }) => {
    const movie = await fetchMovie({ id: movieId }).then(({ results }) => results);

    if (!movie) {
      throw new Error('movie not found')
    }

    return {
      movie,
    }
  }
})

function MovieView() {
  const {
    loaderData: { movie }
  } = router.useMatch(movieRoute.id);

  return (
    <div className="flex-1 flex-col" style={{ paddingTop: 62 }}>
      <span className='text-lg' style={{ marginBottom: 30 }}>Movie Descrption</span>
      <div className="flex">
        <span style={{ minWidth: width, fontWeight: 'bold' }}>title:</span>
        <span>{movie.titleText.text}</span>
      </div>
      {movie?.releaseYear?.year && <div className="flex">
        <span style={{ minWidth: width, fontWeight: 'bold' }}>year:</span>
        <span>{movie.releaseYear.year}</span>
      </div>
      }
    </div >
  )
}
