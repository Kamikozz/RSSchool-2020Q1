const CATEGORIES = 'categories-container';
const CATEGORY = 'category';
const [categoriesContainer] = document.getElementsByClassName(CATEGORIES);

const handlerCategoriesOpenCards = (e) => {
  if (e.target.parentElement.classList.contains(CATEGORY)) {
    const currentCategory = e.target.parentElement.parentElement;
    const categories = [...currentCategory.parentElement.children];
    const idx = categories.findIndex((categoryItem) => categoryItem === currentCategory);

    window.location.href = `#/categories/${idx + 1}`;
  }
};

const initHandlers = () => {
  categoriesContainer.addEventListener('click', handlerCategoriesOpenCards);
};

const initial = () => {
  initHandlers();
};

export default {
  initial,
};
