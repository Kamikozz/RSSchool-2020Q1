import utils from '../src/js/utils/utils';

describe('Utils module', () => {
  describe('getDayTime', () => {
    const NIGHT = 'nighttime';
    const DAY = 'daytime';
    const formatter = (isDayTime) => {
      const ret = isDayTime ? DAY : NIGHT;

      return ret;
    };
    const timeZone = 10800 * 1000;

    it('should return `nighttime`', () => {
      const UTCDate1 = new Date('06.09.2020 5:59:59').getTime();
      const UTCDate2 = new Date('06.09.2020 21:00:00').getTime();
      const UTCDate3 = new Date('05.02.2050 3:00:00').getTime();

      expect(utils.getDayTime(new Date(UTCDate1 + timeZone), formatter)).toBe(NIGHT);
      expect(utils.getDayTime(new Date(UTCDate2 + timeZone), formatter)).toBe(NIGHT);
      expect(utils.getDayTime(new Date(UTCDate3 + timeZone), formatter)).toBe(NIGHT);
    });

    it('should return `daytime`', () => {
      const UTCDate1 = new Date('06.09.2020 6:00:00').getTime();
      const UTCDate2 = new Date('06.09.2020 20:59:59').getTime();

      expect(utils.getDayTime(new Date(UTCDate1 + timeZone), formatter)).toBe(DAY);
      expect(utils.getDayTime(new Date(UTCDate2 + timeZone), formatter)).toBe(DAY);
    });
  });

  describe('getSeasonOfYear', () => {
    const WINTER = 'winter';
    const SUMMER = 'summer';
    const winterDate = new Date('01.01.2020 10:00');
    const summerDate = new Date('07.01.2020 10:00');
    const northHemisphereLatitude = 10;
    const southernHemisphereLatitude = -10;

    it('should return summer in southern hemisphere', () => {
      expect(utils.getSeasonOfYear(winterDate, southernHemisphereLatitude)).toBe(SUMMER);
    });

    it('should return winter in north hemisphere', () => {
      expect(utils.getSeasonOfYear(winterDate, northHemisphereLatitude)).toBe(WINTER);
    });

    it('should return summer in north hemisphere', () => {
      expect(utils.getSeasonOfYear(summerDate, northHemisphereLatitude)).toBe(SUMMER);
    });

    it('should return winter in southern hemisphere', () => {
      expect(utils.getSeasonOfYear(summerDate, southernHemisphereLatitude)).toBe(WINTER);
    });
  });

  describe('converterDMS', () => {
    it('should return valid string with correct data', () => {
      expect(utils.converterDMS(50.123112, 0)).toBe('50° 7\' 23"');
    });

    it('should return valid string with correct negative data', () => {
      expect(utils.converterDMS(-50.123112, 0)).toBe('-51° 53\' -23"');
    });

    it('should return valid string with precision of 4 without precision arg', () => {
      expect(utils.converterDMS(-50.123112)).toBe('-51° 53\' -23.2032"');
    });
  });

  describe('dateTimeFormatter', () => {
    describe('getWeekDayByIndex', () => {
      it('should return valid string with correct data', () => {
        expect(utils.converterDMS(50.123112, 0)).toBe('50° 7\' 23"');
      });

      it('should return valid string with correct negative data', () => {
        expect(utils.converterDMS(-50.123112, 0)).toBe('-51° 53\' -23"');
      });
    });
  });

  describe('temperatureUnitsConverter', () => {
    const temperature = 40.50;

    it('should return valid temperature in fahrenheit', () => {
      const toFahrenheit = true;

      expect(utils.temperatureUnitsConverter(temperature, toFahrenheit)).toEqual('104.9');
    });

    it('should return valid temperature in celsius', () => {
      const toFahrenheit = false;

      expect(utils.temperatureUnitsConverter(temperature, toFahrenheit)).toEqual('4.7');
    });
  });

  describe('milesPerHourToMetersPerSecond', () => {
    const mph = 70.5;

    it('should return valid meters per second', () => {
      expect(utils.milesPerHourToMetersPerSecond(mph)).toEqual('32');
    });
  });
});
