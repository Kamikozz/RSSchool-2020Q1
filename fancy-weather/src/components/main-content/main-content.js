import ForecastContainer from '../forecast-container/forecast-container';
import MapContainer from '../map-container/map-container';
import SearchContainer from '../search-container/search-container';
import utils from '../../js/utils/utils';
import background from '../../js/background';
import SpeechSynthesis from '../../js/synthesis-speech';

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
      SPEECH_SYNTHESIS: 'controls-container__speaker',
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
    // Create the instance (for example)
    const myMapContainer = new MapContainer({
      isInit: true,
      parent: this,
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

    // Get query for search background and change background
    await this.changeBackgroundImage();

    await this.restoreState(true);

    const searchContainer = new SearchContainer({
      parent: this,
    });

    searchContainer.init();
    this.search = searchContainer;

    // SpeechSynthesis
    const speechSynthesis = new SpeechSynthesis();

    this.speechSynthesis = speechSynthesis;
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
      SPEECH_SYNTHESIS,
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
    const [speechSynthesis] = root.getElementsByClassName(SPEECH_SYNTHESIS);

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
      speechSynthesis,
    };
  }

  initHandlers() {
    const {
      refreshButton,
      selectBoxActivator, selectBoxOptions,
      unitsSwitcher,
      speechSynthesis,
    } = this.elements;
    const {
      REFRESH_BUTTON_ICON_ACTIVE,
      SELECT_BOX_DROP_MENU_ACTIVATOR_ACTIVE, SELECT_BOX_OPTIONS_ACTIVE,
      UNITS_SWITCHER_UNIT_ACTIVE,
    } = this.classes;

    // Refresh Button Component
    refreshButton.addEventListener('click', async () => {
      const { dateTime, map: { latitude } } = this.forecast;
      const query = background.getBackgroundSearchQuery({
        dateTime,
        latitude,
      });

      const svgIconElement = refreshButton.firstElementChild;

      refreshButton.setAttribute('disable', '');
      svgIconElement.classList.toggle(REFRESH_BUTTON_ICON_ACTIVE);
      await background.changeBackground(query);
      svgIconElement.classList.toggle(REFRESH_BUTTON_ICON_ACTIVE);
      refreshButton.removeAttribute('disable');
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
        this.changeUnits(target);
      }
    });

    // Speech Synthesis Component
    speechSynthesis.addEventListener('click', () => {
      this.speechSynthesis.speakIt();
    });
  }

  /**
   * Get query for search background and change background.
   */
  async changeBackgroundImage() {
    const { dateTime, map: { latitude } } = this.forecast;
    const query = background.getBackgroundSearchQuery({
      dateTime,
      latitude,
    });

    await background.changeBackground(query);
  }

  async changeLanguage(language) {
    const { selectBoxOptions } = this.elements;
    const { children: [...optionsElements] } = selectBoxOptions;
    const currentLanguageElement = optionsElements.find((option) => {
      const { dataset: { lang } } = option; // get 'lang' data-attribute
      const isLanguageEqual = lang === language;

      return isLanguageEqual;
    });

    await this.changeSelectedOption(currentLanguageElement);
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

  changeUnits(target) {
    const {
      UNITS_SWITCHER_UNIT_ACTIVE,
    } = this.classes;

    let currentUnitElement = target;

    if (!currentUnitElement) {
      const { unitsSwitcher } = this.elements;
      const { children: [...unitsElements] } = unitsSwitcher;

      currentUnitElement = unitsElements.find((unit) => {
        const isNotActive = !unit.classList.contains(UNITS_SWITCHER_UNIT_ACTIVE);

        return isNotActive;
      });
    }

    const { UNITS_SWITCHER_UNIT_TEMP_FAHRENHEIT } = this.classes;
    const isFahrenheit = currentUnitElement.classList.contains(UNITS_SWITCHER_UNIT_TEMP_FAHRENHEIT);

    this.forecast.changeUnits(currentUnitElement, isFahrenheit);

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

      element.textContent = utils.temperatureUnitsConverter(temperature, isFahrenheit, 0);
    });
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
