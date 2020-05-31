// TODO: remove this
const hasData = (data, noData) => data !== noData;
const isUndefined = (item) => item === undefined;

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
  hasData,
  isUndefined,
  converterDMS,
};
