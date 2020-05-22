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

// <select> to change languages
const [selectLanguages] = document.getElementsByClassName('select-languages');

selectLanguages.onchange = ({ target }) => {
  const { value } = target;

  console.log(target, value);
  i18n.changeLanguage(value);
};

// get page language from localStorage and set its elements to the previous locale
// async for the future possible functions/methods that will use requests
const restoreState = async () => {
  const currentLanguage = localStorage.getItem(i18n.localStorageKeyPageLanguage);

  if (currentLanguage) {
    selectLanguages.value = currentLanguage;
  }
};
const restoreStatePromise = restoreState();

// Wait until all of the classes/elements/map/search/etc. loaded & then remove loader
Promise
  .all([
    i18nInitializationPromise, restoreStatePromise,
  ])
  .then(() => {
    document.body.style.opacity = '1';
  });
