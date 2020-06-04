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
      FORECAST_CONTAINER_TEMPERATURE_VALUE: 'forecast-container__temperature-value',
    };
    this.elements = {};
    this.data = {};
    this.i18n = props.i18n;
    this.map = null;
  }

  async init() {
    this.initElements();
    this.initHandlers();
    await this.restoreState();

    // Initialization
    // Создание экземпляра примера ради
    const myMapContainer = new MapContainer({
      isInit: true,
    });

    await myMapContainer.init();

    this.map = myMapContainer;

    const [searchButton] = document
      .getElementsByClassName('search-box__button speech-recognition-button');
    const [searchField] = document
      .getElementsByClassName('search-box__search-field');

    searchButton.addEventListener('click', async (e) => {
      e.preventDefault();

      const { value: text } = searchField;

      await myMapContainer.searchCityByName(text);
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
      FORECAST_CONTAINER_TEMPERATURE_VALUE,
    } = this.classes;

    // Refresh Button Component
    refreshButton.addEventListener('click', () => {
      const svgIconElement = refreshButton.firstElementChild;

      svgIconElement.classList.toggle(REFRESH_BUTTON_ICON_ACTIVE);
      // TODO: add logic for refreshing
      setTimeout(() => svgIconElement.classList.toggle(REFRESH_BUTTON_ICON_ACTIVE), 2000);
    });

    // Select Box Component
    selectBoxActivator.addEventListener('click', () => {
      selectBoxActivator.classList.toggle(SELECT_BOX_DROP_MENU_ACTIVATOR_ACTIVE);
      selectBoxOptions.classList.toggle(SELECT_BOX_OPTIONS_ACTIVE);
    });
    selectBoxOptions.addEventListener('click', (e) => {
      let { target } = e;
      const { tagName } = target;
      const isListItem = tagName === 'LI';

      if (!isListItem) {
        target = target.parentElement;
      }

      this.changeSelectedOption(target);
    });

    // Units Switcher Component
    unitsSwitcher.addEventListener('click', ({ target }) => {
      const isActive = target.classList.contains(UNITS_SWITCHER_UNIT_ACTIVE);

      if (!isActive) {
        const { children: units } = unitsSwitcher;

        units.forEach((el) => el.classList.toggle(UNITS_SWITCHER_UNIT_ACTIVE));

        const isFahrenheit = target.classList.contains(UNITS_SWITCHER_UNIT_TEMP_FAHRENHEIT);
        const temperatureElements = document
          .getElementsByClassName(FORECAST_CONTAINER_TEMPERATURE_VALUE);

        temperatureElements.forEach((el) => {
          const element = el;
          const { textContent: temperature } = element;

          element.textContent = temperatureUnitsConverter(temperature, isFahrenheit);
        });
      }
    });
  }

  changeSelectedOption(option) {
    const { selectBoxSelected, selectBoxSelectedIcon } = this.elements;
    const { innerText: text, dataset: { lang } } = option;

    selectBoxSelected.value = text;
    selectBoxSelected.dataset.lang = lang;

    const LANG_TRANSFORMATION = {
      en: 'gb',
      ru: 'ru',
      be: 'by',
    };
    const { [lang]: transformedLang } = LANG_TRANSFORMATION;
    const newIconClasses = `select-box__flag-icon flag-icon flag-icon-${transformedLang}`;

    selectBoxSelectedIcon.classList.value = newIconClasses;

    this.i18n.changeLanguage(lang);
  }

  /**
   * get page language from localStorage and set its elements to the previous locale
   * async for the future possible functions/methods that will use requests
   */
  async restoreState() {
    const currentLanguage = localStorage.getItem(this.i18n.localStorageKeyPageLanguage);

    if (currentLanguage) {
      const [{ children: [...languages] }] = document.getElementsByClassName('select-box__options');
      const currentLanguageElement = languages.find((item) => {
        const { dataset: { lang } } = item;
        const isLanguageEqual = lang === currentLanguage;

        return isLanguageEqual;
      });

      this.changeSelectedOption(currentLanguageElement);
    }
  }
}

export default MainContent;
