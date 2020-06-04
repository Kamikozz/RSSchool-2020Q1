
const processValue = (value) => String(value).toLowerCase();

class I18N {
  constructor() {
    this.languages = null; // an array of possible languages
    this.cachedLanguages = {}; // each loaded language will store here
    this.currentLanguage = null;
    this.options = null; // to configure which tags and their attributes will use i18n
    // to use local storage for storing page language
    this.localStorageKeyPageLanguage = 'pageLanguage'; // to recover page language after refreshing
  }

  async init(props = {}) {
    const {
      languages = [{ name: 'english', code: 'en' }], options = {},
    } = props;
    const localStoragePageLanguage = localStorage.getItem(this.localStorageKeyPageLanguage);
    let { defaultLanguage } = props;

    defaultLanguage = localStoragePageLanguage || defaultLanguage || 'en';

    this.languages = languages;
    this.options = options;
    await this.changeLanguage(defaultLanguage); // to set the default markup on the default language
    this.currentLanguage = defaultLanguage;
  }

  hasLanguage(value) {
    const processedValue = processValue(value);
    const hasLanguage = this.languages.some(({ code }) => code === processedValue);

    return hasLanguage;
  }

  async cacheLanguage(language) {
    const cachedLanguage = this.cachedLanguages[language];

    if (!cachedLanguage) {
      const { name: languagePath } = this.languages.find(({ code }) => code === language);
      const response = await fetch(`/assets/localization/${languagePath}.json`);
      const languageData = await response.json();

      this.cachedLanguages = {
        ...this.cachedLanguages,
        [language]: languageData,
      };
    }
  }

  async changeLanguage(language) {
    console.log('Change Language');
    const processedLanguage = processValue(language);
    const hasLanguage = this.hasLanguage(processedLanguage);

    if (!hasLanguage) {
      throw new Error(`given language "${language}" doesn't match any of the i18n languages`);
    }

    const isDifferentLanguage = this.currentLanguage !== processedLanguage;

    if (isDifferentLanguage) {
      localStorage.setItem(this.localStorageKeyPageLanguage, processedLanguage);
      await this.cacheLanguage(processedLanguage);
      this.currentLanguage = processedLanguage; // change private property to the new language
      document.documentElement.lang = this.currentLanguage; // change <html>'s "lang" attribute

      this.update(); // update all of the elements with "i18n" data-attribute
    }

    return isDifferentLanguage;
  }

  /**
   * Finds all of the DOM-elements with data-attribute "i18n".
   * For each found element changes property/value/textContent according to the given options.
   */
  update() {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach((el) => {
      const element = el;
      const { i18n: name } = element.dataset;
      const value = this.getLocalization(name); // localization 'Example Text'
      const elementOptions = this.getOption(name); // { placeholder: false, text: true }
      const { placeholder = null, text = true, ariaLabel = null } = elementOptions;

      if (placeholder) {
        element.placeholder = value;
      }

      if (text) {
        element.textContent = value;
      }

      if (ariaLabel) {
        element.ariaLabel = value;
      }
    });
  }

  /**
   * Get localization of specific item
   * @param {String} key specific item by which can be found required localization (eg. 'title')
   * @returns {String|undefined} string represents translated item of the specific language
   */
  getLocalization(key) {
    const dataSet = this.cachedLanguages[this.currentLanguage];

    return dataSet[key];
  }

  setOptions(options) {
    this.options = options;
  }

  /**
   * Get configuration of specific item what indicates which tags and their attributes will use i18n
   * @param {String} key specific item by which can be found required configuration (eg. 'title')
   * @returns {Object|undefined} object { placeholder: true/false, text: true/false, etc.}
   */
  getOption(key) {
    const ret = this.options[key];

    return !ret ? {} : ret;
  }
}

export default I18N;
