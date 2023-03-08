import * as React from 'react';
import { router } from '../../../router'
import { useQuery } from '@tanstack/react-query';
import { articlesRoute } from '.';
import { z } from 'zod';
import { queryClient } from '../../../main';
import { Article, fetchMovie } from '../../../utils';
import { dashboardRoute } from '..';

export const movieRoute = articlesRoute.createRoute({
  path: ':movieId',
  // parseParams: (params) => ({
  //   movieId: z.string().parse(params.movieId),
  // }),
  // stringifyParams: ({ movieId }) => ({ movieId: `${movieId}` }),
  // validateSearch: (search) => movieSearchSchema.parse(search),
  element: <ArticleView />,
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

function ArticleView() {
  const {
    loaderData: { movie }, search: { movieId }
  } = router.useMatch(movieRoute.id);
  console.log({ movieId, movie });

  return <span> dupa {movieId}</span>;
}
