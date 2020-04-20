import data from '../../js/cards.data';

const HEADER_NAV = 'header__nav'; // <nav>
const HEADER_MENU = 'nav__list'; // <ul>
const headerMenu = document.querySelector(`.${HEADER_NAV} .${HEADER_MENU}`);

// const handlerCategoriesOpenCards = (e) => {
// };

const createTemplate = (str) => {
  const template = document.createElement('template');
  template.innerHTML = str;
  return template.content;
};

const initData = () => data[0];

const renderLinks = (categories) => {
  const fragment = new DocumentFragment();

  categories.forEach((category, id) => {
    const template = createTemplate(`
      <li class="nav__list-item">
        <a class="nav__list-item-link"
          href="#/categories/${id + 1}"
          title="Open words from ${category}">${category}</a>
      </li>
    `);
    fragment.append(template);
  });

  headerMenu.append(fragment);
};

// const initHandlers = () => {
//   categoriesContainer.addEventListener('click', handlerCategoriesOpenCards);
// };

const initial = () => {
  headerMenu.innerHTML = `
    <li class="nav__list-item nav__list-item_active">
      <a class="nav__list-item-link nav__list-item-link_active"
         href="/"
         title="Go to main page">Main Page</a>
    </li>
  `;
  const categories = initData();
  renderLinks(categories);

  // initHandlers();
};

export default {
  initial,
};
