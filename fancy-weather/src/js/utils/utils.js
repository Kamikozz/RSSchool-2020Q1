const getWeatherIconById = ({ iconId, iconPrefix = 'weather' }) => {
  const icons = {
    '01d': 'clear-sky',
    '01n': 'clear-sky',
    '02d': 'few-clouds',
    '02n': 'few-clouds',
    '03d': 'scattered-clouds',
    '03n': 'scattered-clouds',
    '04d': 'broken-clouds',
    '04n': 'broken-clouds',
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
  const chosenIcon = `${iconPrefix}_${icons[iconId]}`;

  return chosenIcon;
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

module.exports = {
  getWeatherIconById,
  getWeatherDescriptionById,
  dateTimeFormatter,
  temperatureUnitsConverter,
  milesPerHourToMetersPerSecond,
  converterDMS,
};
