import { yandexMapsLoad } from '../../js/api/yandex-maps-service';
import { converterDMS } from '../../js/utils/utils';

class MyMap {
  constructor(props = {}) {
    this.props = props;
    this.isInit = props.isInit;
    this.ymaps = null;
    this.mapElement = null;
    this.map = null;
    this.latitude = null;
    this.longitude = null;
    this.center = null;
    this.zoom = 10;
  }

  async init() {
    if (this.isInit) {
      await yandexMapsLoad(); // load Yandex Maps & append <script>
    }
    // Прокинуть глобальный объект ymaps внутрь экземпляра класса
    // eslint-disable-next-line no-undef
    this.ymaps = ymaps;

    const [mapElement] = document.getElementsByClassName('map-container__map');

    this.mapElement = mapElement;

    // Не теряем контекст класса
    const boundYandexMapsInit = this.yandexMapsInit.bind(this);
    // Функция ymaps.ready() будет вызвана, когда загрузятся все компоненты API,
    // а также когда будет готово DOM-дерево
    this.ymaps.ready(boundYandexMapsInit);
  }

  async yandexMapsInit() {
    const myCoordinates = await this.getLocation({ isInit: true });

    // Создание карты
    this.map = new this.ymaps.Map(this.mapElement, {
      // Координаты центра карты.
      // Порядок по умолчанию: «широта (latitude), долгота (longitude)».
      // Чтобы не определять координаты центра карты вручную,
      // воспользуйтесь инструментом Определение координат.
      center: myCoordinates,
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
    const myGeoLocationObject = this.createMarker(myCoordinates);

    // 2. Добавляем наш маркер на карту и перемещаем область видимости к нашему маркеру
    this.addMarker(myGeoLocationObject, myCoordinates);
  }

  /**
   * Преобразовать широту и долготу в DMS-формат и выставить их в HTML-элементы.
   * @param {Number[]} coordinates «широта (latitude), долгота (longitude)»
   */
  setLatitudeLongitude(coordinates) {
    [this.latitude, this.longitude] = coordinates;

    const latitudeDMS = converterDMS(this.latitude);
    const longitudeDMS = converterDMS(this.longitude);

    const [latitudeElement] = document.getElementsByClassName('map-container__latitude-value');
    const [longitudeElement] = document.getElementsByClassName('map-container__longitude-value');

    latitudeElement.textContent = `: ${latitudeDMS}`;
    longitudeElement.textContent = `: ${longitudeDMS}`;
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
   * @param {*} geoObject гео-объект Яндекс.Карт (например, маркер)
   * @param {Boolean} setCenter переместить область видимости карты на созданный маркер
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
   * Поиск города по его названию и отображение на карте.
   * @param {String} name название города
   */
  async searchCityByName(name) {
    if (!name.length) {
      return;
    }

    let error;

    const onError = (err) => {
      console.error('Ошибка', err);
    };

    // Прямое гео-кодирование (поиск по названию для получения координат)
    const directGeocodingOnSuccess = (result) => {
      console.log(result);

      const foundResults = result.metaData.geocoder.found;

      let coords;

      if (foundResults) {
        // Выбираем первый результат гео-кодирования
        const firstGeoObject = result.geoObjects.get(0);
        console.log(firstGeoObject, foundResults);
        // Получаем координаты геообъекта [широта, долгота]
        coords = firstGeoObject.geometry.getCoordinates();
      } else {
        error = new Error('Ничего не найдено');
      }

      return coords;
    };

    let coordinates;

    try {
      const result = await this.ymaps.geocode(name, { results: 1 });

      coordinates = directGeocodingOnSuccess(result);
    } catch (err) {
      onError(err);
      error = new Error(err.message);
    }

    // Если прямое гео-кодирование прошло успешно, тогда выполнить обратное гео-кодирование
    // (поиск по координатам и выдача ближайшего города)
    if (!error) {
      const reverseGeocodingOnSuccess = (result) => {
        // Удалить все метки с карты (предыдущие результаты)
        this.map.geoObjects.removeAll();

        // Выбираем первый результат гео-кодирования
        const firstGeoObject = result.geoObjects.get(0);

        // Получаем координаты геообъекта [широта, долгота]
        const coords = firstGeoObject.geometry.getCoordinates();
        // Преобразовать широту и долготу в DMS-формат и выставить координаты в HTML-элементы
        this.setLatitudeLongitude(coords);

        // Добавляем его на карту
        this.addMarker(firstGeoObject, coords);
      };

      try {
        const result = await this.ymaps.geocode(coordinates, { results: 1 });

        reverseGeocodingOnSuccess(result);
      } catch (err) {
        onError(err);
        error = new Error(err.message);
      }
    }

    if (error) {
      console.error(error.message);
    }
  }

  /**
   * Получение местоположения и автоматическое отображение его на карте.
   * @param {Object} options поле isInit, обозначающее первый запуск определения гео-локации
   */
  async getLocation({ isInit }) {
    const onSuccess = (result) => {
      // Выбираем первый результат гео-кодирования
      const firstGeoObject = result.geoObjects.get(0);

      const userAddress = firstGeoObject.properties.get('text');
      const userCoordinates = firstGeoObject.geometry.getCoordinates();
      console.log(`Адрес: ${userAddress}<br/>Координаты: ${userCoordinates}`);
      // Преобразовать широту и долготу в DMS-формат и выставить координаты в HTML-элементы
      this.setLatitudeLongitude(userCoordinates);

      if (!isInit) {
        // Добавляем его на карту
        this.addMarker(firstGeoObject, userCoordinates);
      }

      return userCoordinates;
    };
    const onError = (err) => {
      console.log('Ошибка', err);
      this.searchCityByName('Moscow');
    };

    // Получение местоположения пользователя
    let coordinates;

    try {
      const result = await this.ymaps.geolocation.get({ mapStateAutoApply: false });

      coordinates = await onSuccess(result);
    } catch (err) {
      onError(err);
    }

    return coordinates;
  }
}

// Initialization
// Создание экземпляра примера ради
const myMapContainer = new MyMap({
  isInit: true,
});

myMapContainer.init();

console.log(myMapContainer);

const [searchButton] = document
  .getElementsByClassName('search-box__button speech-recognition-button');
const [searchField] = document
  .getElementsByClassName('search-box__search-field');

searchButton.addEventListener('click', (e) => {
  e.preventDefault();

  const { value: text } = searchField;

  myMapContainer.searchCityByName(text);
});
