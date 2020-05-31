import { yandexMapsApi } from '../credentials';

// https://api-maps.yandex.ru/2.1/?apikey=c16d1bbd-0a20-45e9-af12-558237d8bdb6&lang=en_US
export const yandexMapsLoad = async (lang = 'en_US') => {
  const { baseUrl, apiKey } = yandexMapsApi;
  const params = `apikey=${apiKey}&lang=${lang}`;
  const url = `${baseUrl}?${params}`;
  const scriptElement = document.createElement('script');

  scriptElement.src = url;
  document.body.append(scriptElement);

  const promise = new Promise((resolve) => {
    scriptElement.onload = () => {
      resolve();
    };
  });

  return promise;
};

// TODO: DELETE THIS
export const getMovie = async ({ movieId }, plot = 'short') => {
  const { baseUrl, apiKey } = yandexMapsApi;
  const params = `apikey=${apiKey}&i=${movieId}&plot=${plot}`;
  const url = `${baseUrl}?${params}`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};
