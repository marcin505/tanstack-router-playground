import * as React from 'react';
import { router } from '../../../router'
import { useQuery } from '@tanstack/react-query';
import { moviesRoute } from './movies';
import { z } from 'zod';
import { fetchMovie } from '../../../api';
import { dashboardRoute } from '..';
import { Button, MovieContainer } from './styles';
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
    loaderData: { movie },
    Link
  } = router.useMatch(movieRoute.id);

  return (
    <MovieContainer>
      <div className="flex">
        <span style={{ minWidth: width, fontWeight: 'bold' }}>title:</span>
        <span>{movie.titleText.text}</span>
      </div>
      <div className="flex">
        <span style={{ minWidth: width, fontWeight: 'bold' }}>type:</span>
        <span>{movie?.titleType?.text}</span>
      </div>
      <Link to='/dashboard/movieDetails' search={{ movie }}>
        <Button type="button" style={{ marginTop: 20 }}>More Details</Button>
      </Link>
    </MovieContainer >
  )
}
