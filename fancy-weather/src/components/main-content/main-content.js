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
    };
    this.elements = {};
    this.data = {};
    this.i18n = props.i18n;
  }

  async init() {
    this.initElements();
    this.initHandlers();
    await this.restoreState();
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

    this.elements = {
      ...this.elements,
      root,
      refreshButton,
      selectBox,
      selectBoxActivator,
      selectBoxOptions,
      selectBoxSelected,
      selectBoxSelectedIcon,
    };
  }

  initHandlers() {
    const {
      selectBoxActivator,
      selectBoxOptions,
      refreshButton,
    } = this.elements;
    const {
      SELECT_BOX_DROP_MENU_ACTIVATOR_ACTIVE,
      SELECT_BOX_OPTIONS_ACTIVE,
      REFRESH_BUTTON_ICON_ACTIVE,
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
