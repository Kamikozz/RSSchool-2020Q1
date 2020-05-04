class Footer {
  constructor(props) {
    this.props = props;
    this.classes = {
      ROOT: 'footer',
      RSS_LOGO_CONTAINER: 'footer__rss-logo-container',
      GITHUB_LOGO_CONTAINER: 'footer__github-logo-container',
      IMAGE_ACTIVE: 'footer__image_active',
      IMAGE_ANIMATION_PAUSE: 'footer__image_animation-paused',
      IMAGE_HOVER: 'footer__image_hover',
    };
    this.elements = {};
  }

  init() {
    this.render();
    this.initElements();
    this.initHandlers();
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');
    const c = this.classes;

    template.innerHTML = `
      <footer class="${c.ROOT}">
        <div class="wrapper">
          <div class="${c.ROOT}__container">
            <div class="${c.ROOT}__content">
              <a class="${c.ROOT}__link" href="https://rs.school/" target="_blank">
                <div class="${c.RSS_LOGO_CONTAINER}">
                  <img  class="${c.ROOT}__image"
                        src="/assets/icons/logo-rss.bg.svg"
                        alt="background-logo-rolling-scopes-school">
                  <img  class="${c.ROOT}__image ${c.IMAGE_ACTIVE}"
                        src="/assets/icons/logo-rss.text.svg"
                        alt="text-logo-rolling-scopes-school">
                  <img  class="${c.ROOT}__image"
                        src="/assets/icons/logo-rss.front.svg"
                        alt="front-logo-rolling-scopes-school">
                </div>
              </a>
            </div>

            <p class="${c.ROOT}__copyright">&copy; 2020</p>

            <div class="${c.ROOT}__content">
              <a class="${c.ROOT}__link" href="https://github.com/Kamikozz/" target="_blank">
                <div class="${c.GITHUB_LOGO_CONTAINER}">
                  <svg class="${c.ROOT}__image" xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    `;

    this.elements.root = template.content.firstElementChild;

    fragment.append(template.content);
    document.body.append(fragment);
  }

  initElements() {
    const el = this.elements;
    const [logoRss] = el.root.getElementsByClassName(this.classes.RSS_LOGO_CONTAINER);
    const [logoRotatingText] = logoRss.getElementsByClassName(this.classes.IMAGE_ACTIVE);
    const [logoGithub] = el.root.getElementsByClassName(this.classes.GITHUB_LOGO_CONTAINER);

    Object.assign(this.elements, {
      logoRss,
      logoRotatingText,
      logoGithub,
    });
  }

  initHandlers() {
    const { logoRss, logoGithub, logoRotatingText } = this.elements;

    // hover effect for rss-logo
    logoRss.onmouseover = () => {
      logoRotatingText.classList.add(this.classes.IMAGE_ANIMATION_PAUSE);
      logoRss.children.forEach((el) => el.classList.add(this.classes.IMAGE_HOVER));
    };
    logoRss.onmouseout = () => {
      logoRotatingText.classList.remove(this.classes.IMAGE_ANIMATION_PAUSE);
      logoRss.children.forEach((el) => el.classList.remove(this.classes.IMAGE_HOVER));
    };

    // hover effect for github-logo
    logoGithub.onmouseover = () => {
      logoGithub.firstElementChild.classList.add(this.classes.IMAGE_HOVER);
    };
    logoGithub.onmouseout = () => {
      logoGithub.firstElementChild.classList.remove(this.classes.IMAGE_HOVER);
    };
  }
}

export default Footer;
