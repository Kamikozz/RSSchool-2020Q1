const getWeatherIconPathById = ({
  iconId,
  iconPrefix = 'amcharts-weather-icons',
  extension = 'svg',
}) => {
  const icons = {
    '01d': 'clear-sky-day',
    '01n': 'clear-sky-night',
    '02d': 'few-clouds-day',
    '02n': 'few-clouds-night',
    '03d': 'cloudy',
    '03n': 'cloudy',
    '04d': 'cloudy',
    '04n': 'cloudy',
    '09d': 'shower-rain',
    '09n': 'shower-rain',
    '10d': 'rain',
    '10n': 'rain',
    '11d': 'thunderstorm',
    '11n': 'thunderstorm',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'mist',
    '50n': 'mist',
  };
  const iconPath = `/assets/icons/${iconPrefix}/${icons[iconId]}.${extension}`;

  return iconPath;
};

const getWeatherDescriptionById = ({
  descriptionId,
  weatherI18nPrefix = 'weather_description',
}) => {
  const weatherDescription = `${weatherI18nPrefix}_${descriptionId}`;

  return weatherDescription;
};

/**
 * Converts the given temperature in Fahrenheit/Celsius into Celsius/Fahrenheit units.
 * @param {String|Number} temperature given temperature in Fahrenheit/Celsius units
 * @param {Boolean} toFahrenheit indicates if needed to convert into Fahrenheit or Celsius units
 * @param {Number} precision number of signs after comma which will remain after .toFixed()
 * @returns converted temperature into units given by toFahrenheit option
 */
const temperatureUnitsConverter = (temperature, toFahrenheit, precision = 1) => {
  let ret;

  if (toFahrenheit) {
    ret = (9 / 5) * temperature + 32;
  } else {
    ret = (5 / 9) * (temperature - 32);
  }

  return ret.toFixed(precision);
};

/**
 * Converts the given miles per hour (mph) to meters per second (ms).
 * @param {Number} milesPerHour miles per hour (1 mile = 1609.34 meters)
 * @param {Number} precision number of signs after comma which will remain after .toFixed()
 * @returns {Number} rounded number of meters per second
 */
const milesPerHourToMetersPerSecond = (milesPerHour, precision = 0) => {
  const METERS_IN_MILE = 1609.34;
  const SECONDS_IN_HOUR = 60 * 60;
  const metersPerSecond = milesPerHour * (METERS_IN_MILE / SECONDS_IN_HOUR);

  return metersPerSecond.toFixed(precision);
};

/**
 * Converts given number of decimal degrees into DMS format (degrees, minutes, seconds).
 * @param {Number|String} decimalDegrees number of decimal degrees
 * @param {Number} precision seconds rounding precision
 * @returns {String} string formatted like '59° 30' 11.1231"
 */
const converterDMS = (decimalDegrees, precision = 4) => {
  const degrees = Math.floor(decimalDegrees);
  const minutes = Math.round((decimalDegrees - degrees) * 60);
  const seconds = (decimalDegrees - degrees - (minutes / 60)) * 3600;

  const roundSeconds = precision ? Number(seconds).toFixed(precision) : seconds;

  return `${degrees}° ${minutes}' ${roundSeconds}"`;
};

const dateTimeFormatter = {
  getWeekDayByIndex({ index, dataI18nPrefix = 'week_day', isShortFormat = true }) {
    const weekDays = [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
    ];

    let weekDay;

    if (isShortFormat) {
      weekDay = `${dataI18nPrefix}_${weekDays[index]}_short`;
    } else {
      weekDay = `${dataI18nPrefix}_${weekDays[index]}`;
    }

    return weekDay;
  },

  getMonthByIndex({ index, dataI18nPrefix = 'month' }) {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
    ];

    const month = `${dataI18nPrefix}_${months[index]}`;

    return month;
  },

  addLeadNull(number) {
    const isDigit = number < 10;
    const ret = isDigit ? `0${number}` : number;

    return ret;
  },
};

const isSouthernHemisphere = (latitude) => latitude < 0;
const getDayTime = (date, formatter) => {
  const hours = date.getUTCHours();

  const START_DAYTIME = 6;
  const END_DAYTIME = 21;
  const isDayTime = hours >= START_DAYTIME && hours < END_DAYTIME;

  return formatter(isDayTime);
};

const getSeasonOfYear = (date, latitude = 0) => {
  const SEASONS = ['winter', 'spring', 'summer', 'fall'];
  const MONTHS_IN_SEASON = 3;
  const month = date.getUTCMonth() + 1; // get month index and normalize him into human readable idx
  // normalize number into seasons' order and normalize this data into SEASONS' array index
  let seasonIndex = Math.floor(month / MONTHS_IN_SEASON) % SEASONS.length;

  if (isSouthernHemisphere(latitude)) {
    // fall = spring, summer = winter
    const MONTHS_SOUTHERN_SHIFT = 2;

    // shift months & get normalized SEASONS' array index
    seasonIndex = (seasonIndex + MONTHS_SOUTHERN_SHIFT) % SEASONS.length;
  }

  const season = SEASONS[seasonIndex];

  return season;
};

module.exports = {
  getWeatherIconPathById,
  getWeatherDescriptionById,
  dateTimeFormatter,
  temperatureUnitsConverter,
  milesPerHourToMetersPerSecond,
  converterDMS,
  isSouthernHemisphere,
  getDayTime,
  getSeasonOfYear,
};
