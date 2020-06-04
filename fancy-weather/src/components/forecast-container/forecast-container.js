// import { } from '../../js/api/open-weather-map-service';
import { dateTimeFormatter } from '../../js/utils/utils';

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
    };
    this.elements = {};
    this.i18n = props.i18n;
    this.dateTime = {
      date: null, // Date object which will store current time: Date
      timeZoneOffset: null, // number of milliseconds (eg. 10800000): Number
      timestamp: null, // time in UNIX-format: Number
    };
    this.timerId = null;
    // TODO: DELETE THIS MOCK
    this.data = {
      timeZone: 10800,
    };
  }

  async init() {
    this.initElements();

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
    } = this.classes;
    const [root] = document.getElementsByClassName(ROOT);
    const [city] = root.getElementsByClassName(FORECAST_CITY);
    const [weekDay] = root.getElementsByClassName(FORECAST_DATE_WEEK_DAY);
    const [day] = root.getElementsByClassName(FORECAST_DATE_DAY);
    const [month] = root.getElementsByClassName(FORECAST_DATE_MONTH);
    const [time] = root.getElementsByClassName(FORECAST_TIME);

    this.elements = {
      ...this.elements,
      root,
      city,
      weekDay,
      day,
      month,
      time,
    };
  }

  async getForecast() {
    // const data = await getForecastData();
    const data = await this.time();
    const { timeZone } = data;

    this.dateTime.timeZoneOffset = timeZone * 1000;

    this.startTimer();
  }

  time() {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        console.log('DUMMY DELETE ME', this);
        resolve(this.data);
      }, 2000);
    });

    return promise;
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
}

export default ForecastContainer;
