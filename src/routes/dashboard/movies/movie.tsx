import * as React from 'react';
import { router } from '../../../router'
import { useQuery } from '@tanstack/react-query';
import { moviesRoute } from './movies';
import { z } from 'zod';
import { fetchMovie } from '../../../api';
import { dashboardRoute } from '..';

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
    loaderData: { movie }, search: { movieId }
  } = router.useMatch(movieRoute.id);
  console.log({ movieId, movie });

  return <div className="flex-1 border p-1"> dupa {movieId}</div>;
}
