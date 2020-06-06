import { unsplashApi } from '../credentials';
import errorHandler from '../error-handler';

// https://api.unsplash.com/photos/random?client_id=&query=nature&orientation=landscape&per_page=1
const getBackgroundData = async (query, orientation = 'landscape', perPage = 1) => {
  const { baseUrl, apiKey } = unsplashApi;
  const params = `client_id=${apiKey}&query=${query}&orientation=${orientation}&per_page=${perPage}`;
  // regular - it's better due of it returns 1080px width of the picture
  const url = `${baseUrl}photos/random?${params}`;
  const response = await fetch(url); // Response object

  const { ok } = response;

  if (!ok) {
    const { status } = response;

    switch (status) {
      case 403:
        throw new Error(errorHandler.ERROR_STATUSES.UNSPLASH_IMAGES_EXCEEDED_LIMIT);
      default: {
        const text = await response.text();

        throw new Error(text);
      }
    }
  }

  const json = await response.json();

  return json;
};

export default getBackgroundData;
