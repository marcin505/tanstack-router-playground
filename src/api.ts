import { Movie } from './types';

const baseURL = 'https://moviesdatabase.p.rapidapi.com/titles';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '18f3d531ddmsh23b545b8f03153dp1db305jsn5903b0518f86',
    'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
  },
};

export const fetchMovies = ({
  keyword,
  limit,
  signal,
}: {
  keyword: string;
  limit: number;
  signal?: AbortSignal;
}): Promise<{ results: Movie[] }> => {
  return fetch(
    `${baseURL}/search/keyword/${keyword.toLowerCase()}?limit=${limit}`,
    {
      ...options,
      signal,
    }
  )
    .then((response) => response.json())
    .catch((err) => {
      throw new Error(err);
    });
};

export const fetchMovie = ({
  id,
}: {
  id: string;
}): Promise<{ results: Movie }> => {
  return fetch(`${baseURL}/${id}`, options)
    .then((response) => response.json())
    .catch((err) => {
      throw new Error(err);
    });
};
