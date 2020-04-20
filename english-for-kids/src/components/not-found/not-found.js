class NotFound {
  constructor() {
    this.markup = `
      <div class="not-found main-content__not-found">
        <p class="not-found__text">Something happened wrong. Please redirect to the
          <a class="not-found__link" href="/">HOME PAGE</a>. Thanks!
        </p>
      </div>
    `;
  }

  getMarkup() {
    return this.markup;
  }
}

export default NotFound;
