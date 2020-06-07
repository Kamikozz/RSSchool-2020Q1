import I18N from '../js/i18n';
import MainContent from './main-content/main-content';

// i18n initialization
const i18n = new I18N();
const i18nOptions = {
  search_text: {
    placeholder: true,
    ariaLabel: true,
    text: false,
  },
  monday: {
    placeholder: true,
    text: false,
  },
};
const i18nInitializationPromise = i18n.init({
  languages: [{
    name: 'english',
    code: 'en',
  }, {
    name: 'russian',
    code: 'ru',
  }, {
    name: 'belorussian',
    code: 'be',
  }],
  options: i18nOptions,
});

const mainContent = new MainContent({ i18n });
const mainContentInitializationPromise = mainContent.init();

// Wait until all of the classes/elements/map/search/etc. loaded & then remove loader
Promise
  .all([
    i18nInitializationPromise, mainContentInitializationPromise,
  ])
  .then(() => {
    document.body.style.removeProperty('pointer-events');
    document.body.style.removeProperty('overflow');
    document.body.style.opacity = '1';
  });
