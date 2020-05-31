// Write code here, this is the entry point
// where you can define your components and initialize them
//
// import MainComponent from './main-component/main-component';
//
// const main = new MainComponent();
//
// main.init();

// Delete this:
//
// Lazy Loading
// let print;

// setTimeout(() => {
//   import(/* webpackChunkName: 'trash' */ './trash').then(module => {
//     print = module.default;
//     // console.log(module);
//     // module();
//     print();
//   });

//   setTimeout(() => {
//       print();
//   }, 5000);
// }, 5000);

import I18N from '../js/i18n';
import MainContent from './main-content/main-content';
import YandexMaps from './map-container/map-container';

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
    document.body.style.opacity = '1';
  });

console.log(YandexMaps);
