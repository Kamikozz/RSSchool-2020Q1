/* eslint-disable no-unused-vars */
import Route from '../js/route';
import Router from '../js/router';

import BurgerMenu from './burger-menu/burger-menu';
import CategoriesContainer from './categories-container/categories-container';
import CardsContainer from './cards-container/cards-container';

const burgerMenu = new BurgerMenu();
burgerMenu.initial();

const router = new Router([
  new Route('/', () => {
    const categories = new CategoriesContainer();
    categories.initial();
  }, true),
  new Route('/categories/{id}', () => {
    burgerMenu.toggleActiveTab();
    const cards = new CardsContainer();
    cards.initial();
  }),
  // new Route('/categories', () => {

  // }),
]);

// import trash from './trash';

// trash();

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
