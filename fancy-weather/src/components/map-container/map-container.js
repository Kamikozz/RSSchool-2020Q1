import yandexMapsLoad from '../../js/api/yandex-maps-service';
import { converterDMS } from '../../js/utils/utils';
import getOpenCageData from '../../js/api/open-cage-data-service';
import errorHandler from '../../js/error-handler';

class MyMap {
  constructor(props = {}) {
    this.props = props;
    this.classes = {
      ROOT: 'map-container',
      MAP_CONTAINER_MAP: 'map-container__map',
      MAP_CONTAINER_LATITUDE: 'map-container__latitude-value',
      MAP_CONTAINER_LONGITUDE: 'map-container__longitude-value',
    };
    this.elements = {};
    this.isInit = props.isInit;
    this.ymaps = null; // глобальный объект ymaps (Yandex Maps API)
    this.map = null; // экземпляр класса MyMap
    this.zoom = 10;
    this.searchQuery = null;
    this.latitude = null;
    this.longitude = null;
    this.city = null;
  }

  async init() {
    this.initElements();

    if (this.isInit) {
      await yandexMapsLoad(); // load Yandex Maps & append <script>
    }
    // Прокинуть глобальный объект ymaps внутрь экземпляра класса
    // eslint-disable-next-line no-undef
    this.ymaps = ymaps;

    // Функция ymaps.ready() будет вызвана, когда загрузятся все компоненты API,
    // а также когда будет готово DOM-дерево
    await this.ymaps.ready();
    await this.yandexMapsInit();
  }

  initElements() {
    const {
      ROOT,
      MAP_CONTAINER_MAP,
      MAP_CONTAINER_LATITUDE,
      MAP_CONTAINER_LONGITUDE,
    } = this.classes;
    const [root] = document.getElementsByClassName(ROOT);
    const [map] = root.getElementsByClassName(MAP_CONTAINER_MAP);
    const [latitude] = root.getElementsByClassName(MAP_CONTAINER_LATITUDE);
    const [longitude] = root.getElementsByClassName(MAP_CONTAINER_LONGITUDE);

    this.elements = {
      ...this.elements,
      root,
      map,
      latitude,
      longitude,
    };
  }

  async yandexMapsInit() {
    const userCoordinates = await this.getLocation({ isInit: true });

    const coordsString = userCoordinates.join(','); // создать строку вида '56.23232,12.2244'
    const pageLanguage = localStorage.getItem('pageLanguage');
    const openCageData = await getOpenCageData(coordsString, pageLanguage);

    this.searchQuery = coordsString;

    const { results } = openCageData;
    const [{ formatted }] = results;

    this.city = formatted;

    const { map } = this.elements;

    // Создание карты
    this.map = new this.ymaps.Map(map, {
      // Координаты центра карты.
      // Порядок по умолчанию: «широта (latitude), долгота (longitude)».
      // Чтобы не определять координаты центра карты вручную,
      // воспользуйтесь инструментом Определение координат.
      center: userCoordinates,
      // Уровень масштабирования. Допустимые значения:
      // от 0 (весь мир) до 19.
      zoom: this.zoom,
      controls: [],
    }, {
      // Нужно ли скрывать предложение открыть текущую карту в Яндекс.Картах,
      // максимально сохранив всю имеющуюся информацию о ней. True - скрывать, false - не скрывать.
      // Ссылка на Яндекс.Карты отображается в левом нижнем углу карты.
      suppressMapOpenBlock: true,
      // Запретим всем объектам на карте открывать балуны по щелчку мыши.
      openBalloonOnClick: false,
    });

    // При первом запуске:
    // 1. Создаём объект с нужными координатами нашего местоположения
    const myGeoLocationObject = this.createMarker(userCoordinates);

    // 2. Добавляем наш маркер на карту и перемещаем область видимости к нашему маркеру
    this.addMarker(myGeoLocationObject, userCoordinates);
  }

  /**
   * Получение местоположения и автоматическое отображение его на карте.
   * @param {Object} options поле isInit, обозначающее первый запуск определения гео-локации
   */
  async getLocation({ isInit }) {
    const onSuccess = (result) => {
      // Выбираем первый результат гео-кодирования
      const firstGeoObject = result.geoObjects.get(0);

      // Получаем координаты в массиве [широта, долгота]
      const userCoordinates = firstGeoObject.geometry.getCoordinates();

      // Преобразовать широту и долготу в DMS-формат и выставить координаты в HTML-элементы
      this.setLatitudeLongitude(userCoordinates);

      if (!isInit) {
        // Добавляем его на карту
        this.addMarker(firstGeoObject, userCoordinates);
      }

      return userCoordinates;
    };

    // Получение местоположения пользователя
    let coordinates;

    try {
      const result = await this.ymaps.geolocation.get({ mapStateAutoApply: false });

      coordinates = await onSuccess(result);
    } catch (err) {
      errorHandler.handle(err.message);
    }

    return coordinates;
  }

  /**
   * Преобразовать широту и долготу в DMS-формат и выставить их в HTML-элементы.
   * @param {Number[]} coordinates «широта (latitude), долгота (longitude)»
   */
  setLatitudeLongitude(coordinates) {
    [this.latitude, this.longitude] = coordinates;

    const latitudeDMS = converterDMS(this.latitude);
    const longitudeDMS = converterDMS(this.longitude);

    const { latitude, longitude } = this.elements;

    latitude.textContent = `: ${latitudeDMS}`;
    longitude.textContent = `: ${longitudeDMS}`;
  }

  createMarker(coordinates) {
    const newGeoObject = new this.ymaps.GeoObject({
      // Определение геометрии 'Point'
      geometry: {
        type: 'Point',
        coordinates,
      },
    }, {
      // Устанавливаем визуальное оформление метки
      preset: 'islands#geolocationIcon',
      // Запрещаем нажатие на маркер на карте
      openBalloonOnClick: false,
    });

    return newGeoObject;
  }

  /**
   * Задаёт визуальное оформление гео-объекту и добавляет его на данную карту.
   * Если coordinates отлично от undefined, тогда карта перемещается на заданные координаты.
   * @param {*} geoObject гео-объект Яндекс.Карт (например, маркер)
   * @param {Number[]} coordinates координаты широта, долгота, для установки центра
   */
  addMarker(geoObject, coordinates) {
    // Устанавливаем визуальное оформление метки
    geoObject.options.set('preset', 'islands#geolocationIcon');
    // Запрещаем нажатие на маркер на карте
    geoObject.options.set('openBalloonOnClick', false);
    this.map.geoObjects.add(geoObject);

    if (coordinates) {
      const zoomLevel = this.zoom;
      // Устанавливаем область просмотра карты в центр координат найденной метки
      this.map.setCenter(coordinates, zoomLevel, {
        checkZoomRange: true,
        duration: 1500,
        timingFunction: 'ease-out',
      });
    }
  }

  /**
   * Поиск города по его названию/ZIP/координатам и отображение на карте.
   * Поиск осуществляется засчёт Open Cage Data API.
   * @param {String} name название города || ZIP || координаты (широта/долгота)
   * @param {String} lang язык, на котором API будет пытаться выдать результаты (название города)
   */
  async searchCity(query, lang = 'en') {
    // Прямое/обратное гео-кодирование (поиск по названию/координатам/ZIP-коду)
    const geocodingOnSuccess = (result) => {
      const { status } = result;

      const isSuccessRequest = status.code === 200;

      if (!isSuccessRequest) {
        throw new Error(status.message);
      }

      const { total_results: totalResults } = result;

      if (!totalResults) {
        throw new Error('Ничего не найдено');
      }

      const { results } = result;
      const [{ formatted, geometry: { lat: latitude, lng: longitude } }] = results;

      return [formatted, [latitude, longitude]];
    };

    let error;
    let openCageData;

    try {
      if (!query.length) {
        throw new Error(errorHandler.ERROR_STATUSES.EMPTY_QUERY);
      }

      if (!navigator.onLine) {
        throw new Error(errorHandler.ERROR_STATUSES.NO_CONNECTION);
      }

      const result = await getOpenCageData(query, lang);

      openCageData = geocodingOnSuccess(result);
    } catch (err) {
      error = err;

      errorHandler.handle(err.message);
    }

    if (!error) {
      const [cityName, coordinates] = openCageData;

      this.searchQuery = query;
      this.city = cityName;
      // 1. Удалить все метки с карты (предыдущие результаты)
      this.map.geoObjects.removeAll();
      // 2. Преобразовать широту и долготу в DMS-формат и выставить координаты в HTML-элементы
      this.setLatitudeLongitude(coordinates);
      // 3. Создаём объект с нужными координатами нашего местоположения
      const myGeoLocationObject = this.createMarker(coordinates);
      // 4. Добавляем наш маркер на карту и перемещаем область видимости к нашему маркеру
      this.addMarker(myGeoLocationObject, coordinates);
    }
  }
}

export default MyMap;
