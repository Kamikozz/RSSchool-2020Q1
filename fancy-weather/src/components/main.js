import I18N from '../js/i18n';
import MainContent from './main-content/main-content';
import { performRequests } from '../js/utils/perform-requests';

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
performRequests({
  promises: [i18nInitializationPromise, mainContentInitializationPromise],
  preloaderEl: document.getElementsByClassName('preloader')[0],
  callback: () => {
    document.body.style.removeProperty('overflow');
    mainContent.elements.root.classList.remove('main-content_loading');
  },
});
