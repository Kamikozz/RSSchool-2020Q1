import ForecastContainer from '../forecast-container/forecast-container';
import MapContainer from '../map-container/map-container';
import { temperatureUnitsConverter } from '../../js/utils/utils';

class MainContent {
  constructor(props) {
    this.props = props;
    this.classes = {
      ROOT: 'main-content',
      REFRESH_BUTTON: 'controls-container__refresh-button',
      REFRESH_BUTTON_ICON_ACTIVE: 'refresh-button-icon_active',
      SELECT_BOX: 'select-box',
      SELECT_BOX_DROP_MENU_ACTIVATOR: 'select-box__drop-menu-activator',
      SELECT_BOX_DROP_MENU_ACTIVATOR_ACTIVE: 'select-box__drop-menu-activator_active',
      SELECT_BOX_OPTIONS: 'select-box__options',
      SELECT_BOX_OPTIONS_ACTIVE: 'select-box__options_active',
      SELECT_BOX_SELECTED_VALUE: 'select-box__selected-value',
      SELECT_BOX_SELECTED_ICON: 'select-box__flag-icon',
      UNITS_SWITCHER: 'units-switcher',
      UNITS_SWITCHER_UNIT_ACTIVE: 'units-switcher__unit_active',
      UNITS_SWITCHER_UNIT_TEMP_FAHRENHEIT: 'units-switcher__unit_temp_fahrenheit',
      UNITS_SWITCHER_UNIT_TEMP_CENTIGRADE: 'units-switcher__unit_temp_centigrade',
      FORECAST_CONTAINER_TEMPERATURE_VALUE: 'forecast-container__temperature-value',
      FORECAST_CONTAINER_FEELS_LIKE_VALUE: 'forecast-container__feels-like-value',
    };
    this.elements = {};
    this.data = {};
    this.i18n = props.i18n;
    this.forecast = null;
    this.map = null;
  }

  async init() {
    this.initElements();
    this.initHandlers();

    // Initialization
    // Создание экземпляра примера ради
    const myMapContainer = new MapContainer({
      isInit: true,
    });

    await myMapContainer.init();

    this.map = myMapContainer;

    // Forecast Component
    this.forecast = new ForecastContainer({
      localStorageKeyPageUnits: 'pageUnits', // to recover page units after refreshing
      i18n: this.i18n,
      map: this.map,
    });

    await this.forecast.init();
    this.forecast.updateCity(this.map.city);

    await this.restoreState(true);

    const [searchButton] = document
      .getElementsByClassName('search-box__button speech-recognition-button');
    const [searchField] = document
      .getElementsByClassName('search-box__search-field');

    searchButton.addEventListener('click', async (e) => {
      e.preventDefault();

      const { value: text } = searchField;

      this.forecast.data = {
        timeZone: text,
      };

      await myMapContainer.searchCity(text, this.i18n.currentLanguage);
      this.forecast.updateCity(this.map.city);
      await this.forecast.getForecast();
    });
  }

  initElements() {
    const {
      ROOT,
      REFRESH_BUTTON,
      SELECT_BOX,
      SELECT_BOX_DROP_MENU_ACTIVATOR,
      SELECT_BOX_OPTIONS,
      SELECT_BOX_SELECTED_VALUE,
      SELECT_BOX_SELECTED_ICON,
      UNITS_SWITCHER,
    } = this.classes;
    const [root] = document.getElementsByClassName(ROOT);
    const [refreshButton] = root.getElementsByClassName(REFRESH_BUTTON);
    const [selectBox] = root.getElementsByClassName(SELECT_BOX);
    const [selectBoxActivator] = root.getElementsByClassName(SELECT_BOX_DROP_MENU_ACTIVATOR);
    const [selectBoxOptions] = root.getElementsByClassName(SELECT_BOX_OPTIONS);
    const [selectBoxSelected] = root.getElementsByClassName(SELECT_BOX_SELECTED_VALUE);
    const [
      selectBoxSelectedIcon,
    ] = selectBoxActivator.getElementsByClassName(SELECT_BOX_SELECTED_ICON);
    const [unitsSwitcher] = root.getElementsByClassName(UNITS_SWITCHER);

    this.elements = {
      ...this.elements,
      root,
      refreshButton,
      selectBox,
      selectBoxActivator,
      selectBoxOptions,
      selectBoxSelected,
      selectBoxSelectedIcon,
      unitsSwitcher,
    };
  }

  initHandlers() {
    const {
      refreshButton,
      selectBoxActivator, selectBoxOptions,
      unitsSwitcher,
    } = this.elements;
    const {
      REFRESH_BUTTON_ICON_ACTIVE,
      SELECT_BOX_DROP_MENU_ACTIVATOR_ACTIVE, SELECT_BOX_OPTIONS_ACTIVE,
      UNITS_SWITCHER_UNIT_ACTIVE, UNITS_SWITCHER_UNIT_TEMP_FAHRENHEIT,
    } = this.classes;

    // Refresh Button Component
    refreshButton.addEventListener('click', async () => {
      const svgIconElement = refreshButton.firstElementChild;

      svgIconElement.classList.toggle(REFRESH_BUTTON_ICON_ACTIVE);
      await this.forecast.getForecast();
      svgIconElement.classList.toggle(REFRESH_BUTTON_ICON_ACTIVE);
    });

    // Select Box Component
    selectBoxActivator.addEventListener('click', () => {
      selectBoxActivator.classList.toggle(SELECT_BOX_DROP_MENU_ACTIVATOR_ACTIVE);
      selectBoxOptions.classList.toggle(SELECT_BOX_OPTIONS_ACTIVE);
    });
    selectBoxOptions.addEventListener('click', async (e) => {
      let { target } = e;
      const { tagName } = target;
      const isListItem = tagName === 'LI';

      if (!isListItem) {
        target = target.parentElement;
      }

      const isChangedLanguage = await this.changeSelectedOption(target);

      if (isChangedLanguage) {
        await this.map.searchCity(this.map.searchQuery, this.i18n.currentLanguage);
        this.forecast.updateCity(this.map.city);
      }
    });

    // Units Switcher Component
    unitsSwitcher.addEventListener('click', ({ target }) => {
      const isActive = target.classList.contains(UNITS_SWITCHER_UNIT_ACTIVE);

      if (!isActive) {
        const isFahrenheit = target.classList.contains(UNITS_SWITCHER_UNIT_TEMP_FAHRENHEIT);

        this.forecast.changeUnits(target, isFahrenheit);

        const {
          FORECAST_CONTAINER_TEMPERATURE_VALUE, FORECAST_CONTAINER_FEELS_LIKE_VALUE,
        } = this.classes;
        const temperatureElementsArray = [
          ...document.getElementsByClassName(FORECAST_CONTAINER_TEMPERATURE_VALUE),
          ...document.getElementsByClassName(FORECAST_CONTAINER_FEELS_LIKE_VALUE),
        ];

        temperatureElementsArray.forEach((el) => {
          const element = el;
          const { textContent: temperature } = element;

          element.textContent = temperatureUnitsConverter(temperature, isFahrenheit, 0);
        });
      }
    });
  }

  async changeSelectedOption(selectedOption, isInit = false) {
    const { selectBoxSelected } = this.elements;
    const { dataset: { lang: currentLanguage } } = selectBoxSelected;
    const { dataset: { lang: targetLanguage } } = selectedOption;

    const isDifferentLanguage = currentLanguage !== targetLanguage;

    const makeVisualChanges = () => {
      const { innerText: text } = selectedOption;

      selectBoxSelected.value = text;
      selectBoxSelected.dataset.lang = targetLanguage;

      const LANG_TRANSFORMATION = {
        en: 'gb',
        ru: 'ru',
        be: 'by',
      };
      const { [targetLanguage]: transformedLanguage } = LANG_TRANSFORMATION;
      const newIconClasses = `select-box__flag-icon flag-icon flag-icon-${transformedLanguage}`;

      const { selectBoxSelectedIcon } = this.elements;

      selectBoxSelectedIcon.classList.value = newIconClasses;
    };

    if (!isInit) {
      const isValidToChangeLanguage = await this.i18n.changeLanguage(targetLanguage);

      if (isValidToChangeLanguage) {
        makeVisualChanges();
      }

      return isValidToChangeLanguage;
    }

    if (isDifferentLanguage || isInit) {
      makeVisualChanges();
    }

    return isDifferentLanguage;
  }

  /**
   * get page language from localStorage and set its elements to the previous locale
   * async for the future possible functions/methods that will use requests
   */
  async restoreState(isInit) {
    const currentLanguage = localStorage.getItem(this.i18n.localStorageKeyPageLanguage);

    if (currentLanguage) {
      // Restore Select Box State
      const { selectBoxOptions } = this.elements;
      const { children: [...optionsElements] } = selectBoxOptions;
      const currentLanguageElement = optionsElements.find((option) => {
        const { dataset: { lang } } = option; // get 'lang' data-attribute
        const isLanguageEqual = lang === currentLanguage;

        return isLanguageEqual;
      });

      await this.changeSelectedOption(currentLanguageElement, isInit);
    }

    const currentUnits = localStorage.getItem('pageUnits');

    if (currentUnits) {
      // Restore Units State
      const {
        UNITS_SWITCHER_UNIT_TEMP_FAHRENHEIT,
        UNITS_SWITCHER_UNIT_TEMP_CENTIGRADE,
      } = this.classes;
      const { unitsSwitcher } = this.elements;
      const { children: [...unitsElements] } = unitsSwitcher;
      const isFahrenheit = currentUnits === 'fahrenheit';
      const classNameToFind = isFahrenheit
        ? UNITS_SWITCHER_UNIT_TEMP_FAHRENHEIT
        : UNITS_SWITCHER_UNIT_TEMP_CENTIGRADE;
      const currentUnitElement = unitsElements.find((unit) => {
        const isTargetUnit = unit.classList.contains(classNameToFind);

        return isTargetUnit;
      });

      this.forecast.changeUnits(currentUnitElement, isFahrenheit);
    }
  }
}

export default MainContent;
