import { openCageDataApi } from '../credentials';

// https://api.opencagedata.com/geocode/v1/json?q=LAT+LNG&key=&language=be&limit=1
const getOpenCageData = async (search, lang) => {
  const { baseUrl, apiKey } = openCageDataApi;
  const params = `key=${apiKey}&q=${encodeURIComponent(search)}&language=${lang}&limit=1`;
  const url = `${baseUrl}?${params}`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export default getOpenCageData;
