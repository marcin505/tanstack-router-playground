import * as React from 'react';
import { dashboardRoute } from '..';
import { router } from '../../../router';
import { z } from 'zod';
import { parseSearchWith, stringifySearchWith } from '@tanstack/react-router'
import { Router } from '@tanstack/react-router'
import { Movie, MovieObject } from '../../../types';

const moviesStateSearchSchema = z.object({
  movies: z.array(MovieObject).optional(),
  // movies: z.string().optional(),
})

// const router = new Router({
//   parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
//   stringifySearch: stringifySearchWith((value) =>
//     encodeToBinary(JSON.stringify(value)),
//   ),
// })

// export function decodeFromBinary(str: string): string {
//   return decodeURIComponent(
//     Array.prototype.map
//       .call(atob(str), function (c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
//       })
//       .join(''),
//   )
// }

// export function encodeToBinary(str: string): string {
//   return btoa(
//     encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
//       return String.fromCharCode(parseInt(p1, 16))
//     }),
//   )
// }

export const moviesStateRoute = dashboardRoute.createRoute({
  path: 'moviesState',
  element: <MoviesState />,
  validateSearch: (search) => moviesStateSearchSchema.parse(search),
  // validateSearch: moviesStateSearchSchema,
  // validateSearch: (search) => moviesStateSearchSchema.parse(search),
  // parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  // str
  // parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  // stringifySearch: stringifySearchWith((value) =>
  //   encodeToBinary(JSON.stringify(value)),
  // ),
  // parseSearch: parseSearchWith((value) => JSON.parse(decodeFromBinary(value))),
  // stringifySearch: stringifySearchWith((value) =>
  //   encodeToBinary(JSON.stringify(value)),
  // ),
  // loader: ({ search }) => {
  //   search
  //   console.log(search)
  // }
})

function MoviesState() {
  const { search: { movies } } = router.useMatch(moviesStateRoute.id);
  console.log(movies);
  // console.log('movies parsed', JSON.parse(atob(`${movies}` || '')));

  return (
    <div className="flex flex-col p-4">
      {movies?.length ?
        <>
          <div className="flex" style={{ background: 'white', height: 30 }}>
            <span className="w-24" style={{ minWidth: 100 }}>#id</span>
            <span className="pl-3" style={{ width: 330 }}>keyword</span>
            <span className="pl-3">release year</span>
          </div>
          <div className="divide-y" style={{ maxHeight: 'calc(100vh - 310px)', minHeight: 200, overflowY: 'auto' }}>
            {(movies as Movie[]).map(movie => (
              <div key={movie.id} className="flex py-2">
                <span className="w-24" style={{ minWidth: 100 }}>#{movie.id}</span>
                <span className="pl-3" style={{ width: 330, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {movie.titleText.text}
                </span>
                <span className="w-24">{movie.releaseDate?.year}</span>
              </div>
            ))}
          </div>
        </>
        : <span>No movies in the search query</span>
      }
    </div>
  )
}