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

module.exports = {
  temperatureUnitsConverter,
  converterDMS,
};
