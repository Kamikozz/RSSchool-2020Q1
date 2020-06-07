import I18N from '../js/i18n';
import MainContent from './main-content/main-content';
import { performRequests } from '../js/utils/perform-requests';

alert(`
  Привет! Работа всё ещё дорабатывается.

  Реализовано голосовое управление:
  1) 'change background' (сменить изображение);
  2) 'search Moscow' (или любой другой запрос с ключевым словом search);
  3) 'change units' (поменять единицы измерения F/C);
  4) 'change language english' (ключевое слово 'change language' и за ним название языка);
  5) 'stop' (выключить микрофон);

  Иконка микрофона подсвечивается (тускло, но подсвечивается).

  Сделано уведомление о погоде:
  1) Управление через 'weather', 'forecast', 'increase volume', 'decrease volume';
  2) Работает говорилка на разных языках;

  TODO: Добавить доп. функционал по клику на карте получать погоду из кликнутой точки (до 14:00)
  // После этого можно проверять
`);

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
