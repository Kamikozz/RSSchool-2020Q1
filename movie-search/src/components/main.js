import trash from './trash';
// import Header from './header/header';
import MainComponent from './main-component/main-component';
import Footer from './footer/footer';

// const header = new Header();
const main = new MainComponent();
const footer = new Footer();

// header.init();
main.init();
footer.init();


const add = (a, b) => a + b;

console.log(add(2, 3));
console.log('lol');

trash();

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
