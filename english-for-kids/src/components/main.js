/* eslint-disable no-unused-vars */
import cardsData from '../js/cards.data';
import cardComponent from './card/card';
import categoryComponent from './category/category';
// import cardsComponent from './cards-container/cards-container';
import categoriesComponent from './categories-container/categories-container';

// import trash from './trash';

const add = (a, b) => a + b;

console.log(add(2, 3));
console.log('lol');
console.log(cardsData);

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


categoriesComponent.initial();
cardComponent.initial();
