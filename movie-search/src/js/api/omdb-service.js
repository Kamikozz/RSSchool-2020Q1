import { omdbApi } from '../credentials';

export const getMoviesList = async ({ search, page = 1, type = 'movie' }) => {
  const { baseUrl, apiKey } = omdbApi;
  const processSearch = encodeURIComponent(String(search).trim());
  const params = `apikey=${apiKey}&s=${processSearch}&type=${type}&page=${page}`;
  const url = `${baseUrl}?${params}`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export const getMovie = async ({ movieId }, plot = 'short') => {
  const { baseUrl, apiKey } = omdbApi;
  const params = `apikey=${apiKey}&i=${movieId}&plot=${plot}`;
  const url = `${baseUrl}?${params}`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};
