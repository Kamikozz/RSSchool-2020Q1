import yandexMapsLoad from '../../js/api/yandex-maps-service';
import { converterDMS } from '../../js/utils/utils';
import getOpenCageData from '../../js/api/open-cage-data-service';
import errorHandler from '../../js/error-handler';

const setVisualAppearance = (geoObject) => {
  // to prevent mutations
  const newGeoObject = geoObject;

  // Set visual appearance of the marker
  newGeoObject.options.set('preset', 'islands#geolocationIcon');
  // Prohibit clicking on the map's marker
  newGeoObject.options.set('openBalloonOnClick', false);

  return newGeoObject;
};

class MyMap {
  constructor(props = {}) {
    this.props = props;
    this.parent = props.parent;
    this.classes = {
      ROOT: 'map-container',
      MAP_CONTAINER_MAP: 'map-container__map',
      MAP_CONTAINER_LATITUDE: 'map-container__latitude-value',
      MAP_CONTAINER_LONGITUDE: 'map-container__longitude-value',
    };
    this.elements = {};
    this.isInit = props.isInit;
    this.map = null; // instance of ymaps.Map
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

    // Functions ymaps.ready() will be called when all of the API components loaded
    // & when DOM-tree will be ready/loaded
    await ymaps.ready();
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

  initHandlers() {
    // Listen to the click on the map
    this.map.events.add('click', async (e) => {
      const coords = e.get('coords');
      const coordsString = coords.join(','); // create the string (e.g. '56.23232,12.2244')

      await this.parent.map.searchCity(coordsString, this.parent.i18n.currentLanguage);
      this.parent.forecast.updateCity(this.parent.map.city);
      await this.parent.forecast.getForecast();
      await this.parent.changeBackgroundImage();
    });
  }

  async yandexMapsInit() {
    const userCoordinates = await this.getLocation({ isInit: true });

    const coordsString = userCoordinates.join(','); // create the string (e.g. '56.23232,12.2244')
    const pageLanguage = localStorage.getItem('pageLanguage');
    const openCageData = await getOpenCageData(coordsString, pageLanguage);

    this.searchQuery = coordsString;

    const { results } = openCageData;
    const [{ formatted }] = results;

    this.city = formatted;

    const { map } = this.elements;

    // Creating instance of the map
    this.map = new ymaps.Map(map, {
      // Map center coordinates.
      // Default order: latitude, longitude.

      // Use "Coordinates Determiner" by Yandex to determine
      // center of the map automatically, not manually.
      center: userCoordinates,
      // Zoom level. Available values: [0..19] (0 - the whole world).
      zoom: this.zoom,
      controls: ['fullscreenControl'],
    }, {
      // Is it necessary to hide the offer about opening the current card in Yandex.Maps,
      // keeping all available information about it as much as possible.
      // True to hide. False to keep.
      // Link to the Yandex.Maps display in the left bottom map's corner.
      suppressMapOpenBlock: true,
      // Prohibit all of the objects to open any balloons on the map by clicking on them.
      openBalloonOnClick: false,
    });

    // On initialization:
    // 1. Create the object with the given coordinates of our geolocation.
    const myGeoLocationObject = this.createMarker(userCoordinates);

    // 2. Add our maker to the map & move map's viewport to our marker.
    this.addMarker(myGeoLocationObject, userCoordinates);

    this.initHandlers();
  }

  /**
   * Get location and automatically display it on the map.
   * @param {Object} options field isInit, meaning the first initialization
   * of the determining the geo-location
   */
  async getLocation({ isInit }) {
    const onSuccess = (result) => {
      // 1. Get the first result of geo-coding
      const firstGeoObject = result.geoObjects.get(0);

      // 2. Get coordinates in the array [latitude, longitude]
      const userCoordinates = firstGeoObject.geometry.getCoordinates();

      // 3. Convert latitude & longitude into DMS-format and set them into DOM-elements
      this.setLatitudeLongitude(userCoordinates);

      if (!isInit) {
        // Add it to the map
        this.addMarker(firstGeoObject, userCoordinates);
      }

      return userCoordinates;
    };

    // Get user's geolocation
    let coordinates;

    try {
      const result = await ymaps.geolocation.get({ mapStateAutoApply: false });

      coordinates = await onSuccess(result);
    } catch (err) {
      errorHandler.handle(err.message);
    }

    return coordinates;
  }

  /**
   * Convert latitude & longitude into DMS-format and set them into DOM-elements.
   * @param {Number[]} coordinates an array with latitude, longitude
   */
  setLatitudeLongitude(coordinates) {
    [this.latitude, this.longitude] = coordinates;

    const latitudeDMS = converterDMS(this.latitude);
    const longitudeDMS = converterDMS(this.longitude);

    const { latitude, longitude } = this.elements;

    latitude.textContent = `: ${latitudeDMS}`;
    longitude.textContent = `: ${longitudeDMS}`;
  }

  createMarker(coordinates = [this.latitude, this.longitude]) {
    let newGeoObject = new ymaps.GeoObject({
      // Defining the geometry of 'Point'
      geometry: {
        type: 'Point',
        coordinates,
      },
    });

    newGeoObject = setVisualAppearance(newGeoObject);

    return newGeoObject;
  }

  /**
   * Sets the visual appearance to the geo-object and adds it to the map.
   * If coordinates are different from 'undefined', map will move to the given coordinates.
   * @param {Object} geoObject Yandex Maps geo-object (e.g. marker)
   * @param {Number[]} coordinates an array with latitude, longitude to set the marker
   */
  addMarker(geoObject, coordinates) {
    const newGeoObject = setVisualAppearance(geoObject);

    this.map.geoObjects.add(newGeoObject);

    if (coordinates) {
      const zoomLevel = this.zoom;
      // Set the map's viewport center to the coordinates of the found marker
      this.map.setCenter(coordinates, zoomLevel, {
        checkZoomRange: true,
        duration: 1500,
        timingFunction: 'ease-out',
      });
    }
  }

  /**
   * Search the city by its name/ZIP/coordinates & display it on the map.
   * Search provider is Open Cage Data API.
   * @param {String} name city name || ZIP || coordinates "latitude,longitude"
   * @param {String} lang language on which API will try to give results (city name)
   */
  async searchCity(query, lang = 'en') {
    // Direct/reverse geo-coding (search by the name/ZIP/coordinates)
    const geocodingOnSuccess = (result) => {
      const { status } = result;

      const isSuccessRequest = status.code === 200;

      if (!isSuccessRequest) {
        throw new Error(status.message);
      }

      const { total_results: totalResults } = result;

      if (!totalResults) {
        throw new Error(errorHandler.ERROR_STATUSES.NOT_FOUND);
      }

      const { results } = result;
      const [{
        formatted,
        geometry: {
          lat: latitude,
          lng: longitude,
        },
      }] = results;

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
      // 1. Remove all of the markers from the map (remove previous results)
      this.map.geoObjects.removeAll();
      // 2. Convert latitude & longitude into DMS-format & set their coordinates into HTML-elements
      this.setLatitudeLongitude(coordinates);
      // 3. Create the object with the given our coordinates
      const myGeoLocationObject = this.createMarker(coordinates);
      // 4. Add created marker on the map and move map's viewport to our new marker
      this.addMarker(myGeoLocationObject, coordinates);
    }
  }
}

export default MyMap;
