import { openWeatherMapApi } from '../credentials';

// https://api.openweathermap.org/data/2.5/forecast?appid=&q=QUERY&lang=be&units=metric
const getWeatherData = async ({
  latitude,
  longitude,
  lang = 'en',
  units = 'metric',
}) => {
  const { baseUrl, apiKey } = openWeatherMapApi;
  const params = `appid=${apiKey}&lat=${latitude}&lon=${longitude}&lang=${lang}&units=${units}`;
  const url = `${baseUrl}?${params}`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

export default getWeatherData;
