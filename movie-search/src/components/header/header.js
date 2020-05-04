class Header {
  constructor(props) {
    this.props = props;
    this.classes = {
      ROOT: 'header',
    };
  }

  init() {
    this.render();
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');
    const c = this.classes;

    template.innerHTML = `
      <header class="${c.ROOT}">
        <div class="wrapper">
          <div class="${c.ROOT}__container">
            <div class="${c.ROOT}__text-container">
              <h1 class="${c.ROOT}__title">Movie Search</h1>
              <p class="${c.ROOT}__description">приложение для поиска фильмов</p>
            </div>
          </div>
        </div>
      </header>
    `;

    this.elements.root = template.content.firstElementChild;

    fragment.append(template.content);
    document.body.append(fragment);
  }
}

export default Header;
