/* eslint-disable no-unused-vars */
import Route from '../js/route';
import Router from '../js/router';

// import cards-data from '../js/cards-data';
import headerComponent from './header/header';
import BurgerMenu from './burger-menu/burger-menu';
import cardComponent from './card/card';
import categoryComponent from './category/category';
// import cardsComponent from './cards-container/cards-container';
import categoriesComponent from './categories-container/categories-container';

const router = new Router([
  new Route('/', 'home.html', true),
  new Route('/categories/{id}', 'swag.html'),
  new Route('/categories', 'categories.html'),
]);

headerComponent.initial(); // fills the menu with list items & links
const burgerMenu = new BurgerMenu();
burgerMenu.initial();
categoriesComponent.initial();
cardComponent.initial();


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
