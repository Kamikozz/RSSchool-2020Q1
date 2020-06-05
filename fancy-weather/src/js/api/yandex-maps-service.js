import { yandexMapsApi } from '../credentials';

// https://api-maps.yandex.ru/2.1/?apikey=&lang=en_US
const yandexMapsLoad = async (lang = 'en_US') => {
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

export default yandexMapsLoad;
