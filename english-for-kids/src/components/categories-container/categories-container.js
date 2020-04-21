import data from '../../js/cards.data';
import random from '../../js/random';
import Category from '../category/category';

class CategoriesContainer {
  constructor() {
    this.classes = {
      CATEGORIES: 'categories-container',
      CATEGORY: 'category',
    };

    this.elements = {
      mainElem: document.querySelector('.main-content .wrapper'),
    };

    // this.initial();
  }

  initial() {
    this.elements.mainElem.innerHTML = '<div class="categories-container"></div>';

    this.initElements();
    this.initHandlers();
    this.initData();
    this.render();
  }

  initElements() {
    const [categoriesContainer] = document.getElementsByClassName(this.classes.CATEGORIES);

    Object.assign(this.elements, {
      categoriesContainer,
    });
  }

  initHandlers() {
    this.elements.categoriesContainer
      .addEventListener('click', this.handlerCategoriesOpenCards.bind(this));
  }

  initData() {
    const categories = [];
    data[0].forEach((item) => {
      categories.push({
        name: item,
      });
    });

    data.slice(1).forEach((arr, i) => {
      const randomId = random.getRandomId(arr.length);
      categories[i].imgUrl = arr[randomId].image;
    });

    this.data = categories;
  }

  render() {
    const fragment = new DocumentFragment();

    this.data.forEach((category) => {
      const template = document.createElement('template');
      template.innerHTML = new Category(category).getMarkup();
      fragment.append(template.content);
    });

    this.elements.categoriesContainer.append(fragment);
  }

  handlerCategoriesOpenCards(e) {
    if (e.target.parentElement.classList.contains(this.classes.CATEGORY)) {
      const currentCategory = e.target.parentElement.parentElement;
      const categories = [...currentCategory.parentElement.children];
      const idx = categories.findIndex((categoryItem) => categoryItem === currentCategory);

      window.location.href = `#/categories/${idx + 1}`;
    }
  }
}

export default CategoriesContainer;
