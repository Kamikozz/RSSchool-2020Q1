// import data from '../../js/cards.data';

// class Header {
//   constructor() {
//     this.classes = {
//       HEADER_NAV: 'header__nav', // <nav>
//       HEADER_MENU: 'nav__list', // <ul>
//     };

//     this.elements = {};

//     this.initial();
//   }

//   initial() {
//     this.initElements();
//     this.initData();
//   }

//   initElements() {
//     const headerMenu = document
//       .querySelector(`.${this.classes.HEADER_NAV} .${this.classes.HEADER_MENU}`);

//     Object.assign(this.elements, {
//       headerMenu,
//     });
//   }

//   initData() {
//     [this.data] = data;
//   }

//   renderLinks(categories) {
//     const fragment = new DocumentFragment();

//     categories.forEach((category, id) => {
//       const template = document.createElement('template');
//       template.innerHTML = `
//         <li class="nav__list-item">
//           <a class="nav__list-item-link"
//             href="#/categories/${id + 1}"
//             title="Open words from ${category}">${category}</a>
//         </li>
//       `;
//       fragment.append(template.content);
//     });

//     this.elements.headerMenu.append(fragment);
//   }

//   render() {
//     this.elements.headerMenu.innerHTML = `
//       <li class="nav__list-item">
//         <a class="nav__list-item-link nav__list-item-link_active"
//           href="/"
//           title="Go to main page">Main Page</a>
//       </li>
//     `;
//     this.renderLinks(this.data);
//   }
// }

// export default Header;
