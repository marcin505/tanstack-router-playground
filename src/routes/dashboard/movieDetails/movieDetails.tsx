import * as React from 'react'
import { Outlet, SearchSchemaValidator, SearchSchemaValidatorObj } from '@tanstack/react-router';
import { router } from '../../../router'
import { z } from 'zod';
import { MovieObject } from '../../../types';
import { dashboardRoute } from '..';
import { MovieDetailsContainer, Heading } from './styles';

const movieDetaisSearchSchema = z.object({
  movie: MovieObject.optional(),
})

export const movieDetailsRoute = dashboardRoute.createRoute({
  path: 'movieDetails',
  element: <MovieDetails />,
  validateSearch: search => movieDetaisSearchSchema.parse(search)
})

function MovieDetails() {
  const {
    search: { movie }
  } = router.useMatch(movieDetailsRoute.id);

  console.log(movie);

  return (
    <MovieDetailsContainer>
      <Heading>Movie Details</Heading>
      { movie ?
        <>
          <div className="flex">
            <span style={{ minWidth: 55, fontWeight: 'bold' }}>title:</span>
            <span>{movie?.titleText.text}</span>
          </div>
          <div className="flex">
            <span style={{ minWidth: 55, fontWeight: 'bold' }}>type:</span>
            <span>{movie?.titleType?.text}</span>
          </div>
        </>
        : <span>No movie was selected </span>
      }
    </MovieDetailsContainer>
  )
}
