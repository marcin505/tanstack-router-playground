import * as React from 'react';
import { router } from '../../../router';
import { movieListRoute } from './movie-list';
import { fetchMovie } from '../../../api';
import { Button, MovieContainer } from './styles';
const width = 55;

export const movieRoute = movieListRoute.createRoute({
  path: ':movieId',
  element: <MovieView />,
  errorElement: <span>ooops, it's the error component!</span>,

  loader: async ({ params: { movieId } }) => {
    // await new Promise((r) => setTimeout(r, 1000));
    const movie = await fetchMovie({ movieId }).then(({ results }) => results);
    if (!movie) {
      throw new Error('movie not found');
    }

    return {
      movie,
    };
  },
});

function MovieView() {
  const {
    loaderData: { movie },

    Link,
  } = router.useMatch(movieRoute.id);

  React.useEffect(() => {
    console.log(movie);
  }, [movie]);

  return (
    <MovieContainer>
      <div className="flex">
        <span style={{ minWidth: width, fontWeight: 'bold' }}>title:</span>
        <span>{movie?.titleText.text}</span>
      </div>
      <div className="flex">
        <span style={{ minWidth: width, fontWeight: 'bold' }}>type:</span>
        <span>{movie?.titleType?.text}</span>
      </div>
      {!!movie && (
        <Link to="/dashboard/movie-details" search={{ movie }}>
          <Button type="button" style={{ marginTop: 20 }}>
            More Details
          </Button>
        </Link>
      )}
    </MovieContainer>
  );
}
