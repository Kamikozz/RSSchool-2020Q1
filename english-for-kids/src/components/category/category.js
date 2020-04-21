class Category {
  constructor(data) {
    this.data = data;

    this.init();
  }

  init() {
    this.markup = `
      <div class="category-container categories-container__category-container" tabindex="0">
        <div class="category">
          <div class="category__img" style="background-image: url(${this.data.imgUrl})"></div>
          <p class="category__text-container">${this.data.name}</p>
        </div>
      </div>
    `;
  }

  getMarkup() {
    return this.markup;
  }
}

export default Category;
