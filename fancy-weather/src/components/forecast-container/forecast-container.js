import getWeatherData from '../../js/api/open-weather-map-service';
import {
  dateTimeFormatter,
  getWeatherIconPathById,
  getWeatherDescriptionById,
  milesPerHourToMetersPerSecond,
} from '../../js/utils/utils';

class ForecastContainer {
  constructor(props) {
    this.props = props;
    this.classes = {
      ROOT: 'forecast-container',
      FORECAST_CITY: 'forecast-container__city',
      FORECAST_DATE_WEEK_DAY: 'forecast-container__date-week-day',
      FORECAST_DATE_DAY: 'forecast-container__date-day',
      FORECAST_DATE_MONTH: 'forecast-container__date-month',
      FORECAST_TIME: 'forecast-container__time',
      FORECAST_TODAY: 'forecast-container__today',
      FORECAST_WEEK: 'forecast-container__week',
      FORECAST_TEMPERATURE_VALUE: 'forecast-container__temperature-value',
      FORECAST_STATUS_ICON: 'forecast-container__weather-status-icon',
      FORECAST_STATUS_SMALL_ICON: 'forecast-container__weather-status-small-icon',
      FORECAST_STATUS_DESCRIPTION: 'forecast-container__weather-status-description',
      FORECAST_FEELS_LIKE_VALUE: 'forecast-container__feels-like-value',
      FORECAST_WIND_VALUE: 'forecast-container__wind-value',
      FORECAST_HUMIDITY_VALUE: 'forecast-container__humidity-value',
      FORECAST_WEEK_DAY_TITLE: 'forecast-container__week-day-title',
      UNITS_SWITCHER_UNIT_ACTIVE: 'units-switcher__unit_active',
      UNITS_SWITCHER_UNIT_TEMP_FAHRENHEIT: 'units-switcher__unit_temp_fahrenheit',
    };
    this.elements = {};
    this.i18n = props.i18n;
    this.map = props.map;
    this.localStorageKeyPageUnits = props.localStorageKeyPageUnits;
    this.dateTime = {
      date: null, // Date object which will store current time: Date
      timeZoneOffset: null, // number of milliseconds (eg. 10800000): Number
      timestamp: null, // time in UNIX-format: Number
    };
    this.timerId = null;
    this.isFahrenheit = null;
  }

  async init() {
    this.initElements();

    const pageUnits = localStorage.getItem(this.localStorageKeyPageUnits);
    const isUndefined = pageUnits === undefined;

    if (isUndefined) {
      this.isFahrenheit = false;
    } else {
      const isFahrenheit = pageUnits === 'fahrenheit';

      this.isFahrenheit = isFahrenheit;
    }

    await this.getForecast();
  }

  initElements() {
    const {
      ROOT,
      FORECAST_CITY,
      FORECAST_DATE_WEEK_DAY,
      FORECAST_DATE_DAY,
      FORECAST_DATE_MONTH,
      FORECAST_TIME,
      FORECAST_TODAY,
      FORECAST_WEEK,
    } = this.classes;
    const [root] = document.getElementsByClassName(ROOT);
    const [city] = root.getElementsByClassName(FORECAST_CITY);
    const [weekDay] = root.getElementsByClassName(FORECAST_DATE_WEEK_DAY);
    const [day] = root.getElementsByClassName(FORECAST_DATE_DAY);
    const [month] = root.getElementsByClassName(FORECAST_DATE_MONTH);
    const [time] = root.getElementsByClassName(FORECAST_TIME);
    const [today] = root.getElementsByClassName(FORECAST_TODAY);
    const [week] = root.getElementsByClassName(FORECAST_WEEK);

    this.elements = {
      ...this.elements,
      root,
      city,
      weekDay,
      day,
      month,
      time,
      today,
      week,
    };
  }

  async getForecast() {
    const data = await this.getForecastData();

    if (data) {
      const [timeZone, weatherDataList] = data;

      this.updateForecast(weatherDataList);

      this.dateTime.timeZoneOffset = timeZone * 1000;

      this.startTimer();
    }
  }

  async getForecastData() {
    const onError = (err) => console.error('Ошибка: ', err);
    const onSuccess = async (result) => {
      console.log(result);

      const { cod } = result;
      const isSuccessRequest = Number(cod) === 200;

      if (!isSuccessRequest) {
        throw new Error(result.message);
      }

      const { city: { timezone }, list } = result;

      return [timezone, list];
    };

    // Options for request
    const { latitude, longitude } = this.map;
    console.log(this.map, this.map.latitude, this.map.longitude);
    const { currentLanguage: language } = this.i18n;
    const units = this.isFahrenheit ? 'imperial' : 'metric';

    let error;
    let weatherData;

    try {
      if (!navigator.onLine) {
        throw new Error('Отсутствует подключение к интернету!');
      }

      const result = await getWeatherData(latitude, longitude, language, units);

      weatherData = await onSuccess(result);
    } catch (err) {
      onError(err);
      error = new Error(err.message);
    }

    let ret;

    if (!error) {
      const [timeZone, weatherDataList] = weatherData;

      const DAY_HOURS = 24; // number of hours in a day
      const HOURS_BETWEEN_MEASURES = 3; // number of hours between measures
      // Each 8th index is a new day (eg. 8 measures each 3hours * 5 days = 40 elements)
      const MEASURES_NUMBER = Math.floor(DAY_HOURS / HOURS_BETWEEN_MEASURES);
      // Make weather measures exact for 5 days
      const weatherDataListPerDays = weatherDataList.filter((item, index) => {
        const isDayPassed = index % MEASURES_NUMBER === 0;

        return isDayPassed;
      });

      const formatWeatherData = (dirtyData, precision = 0) => {
        const {
          dt,
          main: {
            feels_like: feelsLike,
            humidity,
            temp,
          },
          wind: {
            speed: windSpeed,
          },
          weather: {
            0: {
              id: weatherDescriptionId,
              icon: weatherIcon,
            },
          },
        } = dirtyData;

        return {
          feelsLike: Number(feelsLike).toFixed(precision),
          humidity,
          temperature: Number(temp).toFixed(precision),
          windSpeed: this.isFahrenheit ? milesPerHourToMetersPerSecond(windSpeed, 2) : windSpeed,
          weekDayI18nAttr: dateTimeFormatter.getWeekDayByIndex({
            index: new Date(dt * 1000).getUTCDay(),
            isShortFormat: false,
          }),
          weatherIconPath: getWeatherIconPathById({
            iconId: weatherIcon,
          }),
          weatherDescriptionI18nAttr: getWeatherDescriptionById({
            descriptionId: weatherDescriptionId,
          }),
        };
      };
      const formattedData = weatherDataListPerDays.map((item) => formatWeatherData(item));

      ret = [timeZone, formattedData];
    }

    return ret;
  }

  startTimer() {
    if (this.timerId) {
      this.stopTimer(); // this function must set 'this.timerId = null'
    }

    const delay = 1000;
    const incrementTime = () => {
      this.timerId = setTimeout(incrementTime, delay);
      this.update(false);
    };

    this.update(true);
    this.timerId = setTimeout(incrementTime, delay);
  }

  stopTimer() {
    clearInterval(this.timerId);
    this.timerId = null;
  }

  /**
   * Gets current date & time (updates them). Makes visible changes to the DOM.
   * @param {Boolean} isInit this value is to pass to the inner `this.getTime()` function
   */
  async update(isInit) {
    await this.getTime(isInit);

    const [weekDayI18nAttr, dayData, monthI18nAttr, timeData] = this.formatDateTime();
    const {
      weekDay, day, month, time,
    } = this.elements;

    weekDay.dataset.i18n = weekDayI18nAttr;
    day.textContent = dayData;
    month.dataset.i18n = monthI18nAttr;
    time.textContent = timeData;

    this.i18n.update();
  }

  /**
   * Creates current Date & Time object, sets `timestamp` to UTC + `timeZoneOffset`.
   * Or just increases `timestamp` property by 1000 milliseconds if `isInit` property is `false`.
   * @param {Boolean} isInit if **true** creates new `Date` object as a property for
   * this.dateTime.date; **false** - then just increase **timestamp** property by 1 second
   */
  async getTime(isInit) {
    if (isInit) {
      this.dateTime.date = new Date();

      this.dateTime.timestamp = this.dateTime.date.getTime() + this.dateTime.timeZoneOffset;
    } else {
      this.dateTime.timestamp += 1000;
    }

    this.dateTime.date.setTime(this.dateTime.timestamp);
  }

  formatDateTime() {
    const { date } = this.dateTime;

    const weekDayI18n = dateTimeFormatter.getWeekDayByIndex({ index: date.getUTCDay() });
    const day = date.getUTCDate();
    const monthI18n = dateTimeFormatter.getMonthByIndex({ index: date.getUTCMonth() });
    const hours = dateTimeFormatter.addLeadNull(date.getUTCHours());
    const minutes = dateTimeFormatter.addLeadNull(date.getUTCMinutes());
    const seconds = dateTimeFormatter.addLeadNull(date.getUTCSeconds());

    const time = `${hours}:${minutes}:${seconds}`;

    return [weekDayI18n, day, monthI18n, time];
  }

  updateCity(cityName) {
    const { city } = this.elements;

    city.textContent = cityName;
    city.title = cityName;
  }

  updateForecast(weatherDataList) {
    const { today: todayEl, week: weekEl } = this.elements;
    const {
      FORECAST_TEMPERATURE_VALUE,
      FORECAST_STATUS_ICON,
      FORECAST_STATUS_SMALL_ICON,
      FORECAST_STATUS_DESCRIPTION,
      FORECAST_FEELS_LIKE_VALUE,
      FORECAST_WIND_VALUE,
      FORECAST_HUMIDITY_VALUE,
      FORECAST_WEEK_DAY_TITLE,
    } = this.classes;

    // Process the today's block
    const [todayTemperatureEl] = todayEl.getElementsByClassName(FORECAST_TEMPERATURE_VALUE);
    const [todayStatusIconEl] = todayEl.getElementsByClassName(FORECAST_STATUS_ICON);
    const [todayStatusDescriptionEl] = todayEl.getElementsByClassName(FORECAST_STATUS_DESCRIPTION);
    const [todayFeelsLikeEl] = todayEl.getElementsByClassName(FORECAST_FEELS_LIKE_VALUE);
    const [todayWindEl] = todayEl.getElementsByClassName(FORECAST_WIND_VALUE);
    const [todayHumidityEl] = todayEl.getElementsByClassName(FORECAST_HUMIDITY_VALUE);

    const [today] = weatherDataList;
    const {
      feelsLike,
      humidity,
      temperature,
      windSpeed,
      weatherIconPath,
      weatherDescriptionI18nAttr,
    } = today;

    todayTemperatureEl.textContent = temperature;
    todayStatusIconEl.data = weatherIconPath;
    todayStatusDescriptionEl.dataset.i18n = weatherDescriptionI18nAttr;
    todayFeelsLikeEl.textContent = feelsLike;
    todayWindEl.textContent = windSpeed;
    todayHumidityEl.textContent = humidity;

    // Process the week's elements
    const weekDays = weekEl.children;

    weekDays.forEach((weekDay, index) => {
      const [weekDayTitleEl] = weekDay.getElementsByClassName(FORECAST_WEEK_DAY_TITLE);
      const [weekDayTemperatureEl] = weekDay.getElementsByClassName(FORECAST_TEMPERATURE_VALUE);
      const [weekDayStatusIconEl] = weekDay.getElementsByClassName(FORECAST_STATUS_SMALL_ICON);

      // index increased by 1 according to the weatherDataList contains 4 items: today & 3 days
      const indexNextDay = index + 1;
      const weekDayData = weatherDataList[indexNextDay];

      const {
        temperature: temperatureItem,
        weekDayI18nAttr: weekDayI18nAttrItem,
        weatherIconPath: weatherIconPathItem,
      } = weekDayData;

      weekDayTitleEl.dataset.i18n = weekDayI18nAttrItem;
      weekDayTemperatureEl.textContent = temperatureItem;
      weekDayStatusIconEl.data = weatherIconPathItem;
    });
  }

  changeUnits(targetUnitsElement, toFahrenheit) {
    const {
      UNITS_SWITCHER_UNIT_ACTIVE,
    } = this.classes;
    const isActiveUnit = targetUnitsElement.classList.contains(UNITS_SWITCHER_UNIT_ACTIVE);

    if (!isActiveUnit) {
      const unitsSwitcher = targetUnitsElement.parentElement;
      const { children: units } = unitsSwitcher;

      units.forEach((el) => el.classList.toggle(UNITS_SWITCHER_UNIT_ACTIVE));

      this.isFahrenheit = toFahrenheit;

      const pageUnitsToSet = toFahrenheit ? 'fahrenheit' : 'centigrade';

      localStorage.setItem('pageUnits', pageUnitsToSet);
    }
  }
}

export default ForecastContainer;
