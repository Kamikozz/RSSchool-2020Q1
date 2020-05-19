import data from '../../js/cards.data';

class BurgerMenu {
  constructor() {
    this.classes = {
      ACTIVE: 'active',
      DISABLED: 'disabled', // cursor-events: none;
      HIDDEN: 'hidden', // display: none;

      HEADER_NAV: 'header__nav', // <nav>
      HEADER_MENU: 'nav__list', // <ul>
      HEADER_MENU_ITEM_LINK: 'nav__list-item-link', // <a>

      BURGER_BUTTON_BLOCK: 'burger-button-block',
      ANIMATION_HIDE_BURGER: 'hide-menu',
      MODAL_WINDOW: 'burger-modal-window',
    };

    this.elements = {
      headerNav: document.getElementsByClassName(this.classes.HEADER_NAV)[0],
    };

    this.lastHeaderMenuActiveTab = null;
    this.lastHeaderMenuClickedTab = null;
  }

  initial() {
    const { headerNav } = this.elements;

    headerNav.innerHTML = '<ul class="nav__list"></ul>';
    this.initElements();
    this.initData();
    this.render();

    // set default active class to ul > li > a:first-child
    this.lastHeaderMenuActiveTab = this.elements.headerMenu.firstElementChild.firstElementChild;
    this.lastHeaderMenuClickedTab = this.lastHeaderMenuActiveTab;

    this.initHandlers();
  }

  initElements() {
    const headerMenu = document
      .querySelector(`.${this.classes.HEADER_NAV} .${this.classes.HEADER_MENU}`);
    const [burgerMenuButton] = document.getElementsByClassName(this.classes.BURGER_BUTTON_BLOCK);
    const burgerMenuButtonOpen = burgerMenuButton.firstElementChild;
    const [burgerMenuOpen] = document.getElementsByClassName(this.classes.HEADER_NAV);
    const [burgerMenuModalWindow] = document.getElementsByClassName(this.classes.MODAL_WINDOW);

    this.elements = {
      ...this.elements,
      headerMenu,
      burgerMenuButton,
      burgerMenuButtonOpen,
      burgerMenuOpen,
      burgerMenuModalWindow,
    };
  }

  initData() {
    [this.data] = data;
  }

  initHandlers() {
    const {
      headerMenu, burgerMenuButton, burgerMenuOpen, burgerMenuModalWindow,
    } = this.elements;

    headerMenu.addEventListener('click', this.handlerHeaderMenu.bind(this));
    burgerMenuButton.addEventListener('click', this.handlerHeaderBurgerMenuButton.bind(this));
    burgerMenuOpen.addEventListener(
      'animationend', this.handlerHeaderBurgerMenuButtonEndAnimation.bind(this),
    );
    burgerMenuModalWindow.addEventListener('click', this.handlerHeaderBurgerMenuButton.bind(this));
  }

  render() {
    const { headerMenu } = this.elements;

    headerMenu.innerHTML = `
      <li class="nav__list-item">
        <a class="nav__list-item-link nav__list-item-link_active"
          href="/"
          title="Go to main page">Main Page</a>
      </li>
    `;

    const renderLinks = () => {
      const fragment = new DocumentFragment();

      this.data.forEach((category, id) => {
        const template = document.createElement('template');

        template.innerHTML = `
          <li class="nav__list-item">
            <a class="nav__list-item-link"
              href="#/categories/${id + 1}"
              title="Open words from ${category}">${category}</a>
          </li>
        `;
        fragment.append(template.content);
      });
      this.elements.headerMenu.append(fragment);
    };
    renderLinks();
  }

  /**
   * Deletes active className and sets to new activated tab
   * @param {HTMLElement} nextTab event.target or other new activated tab
   */
  toggleActiveTab(nextTab) {
    let nextTabTo;

    if (arguments.length) {
      nextTabTo = nextTab;
    } else {
      const path = window.location.hash.substring(1).split('/');
      const id = path[path.length - 1];
      const children = [...this.elements.headerMenu.children].slice(1);

      if (id > 0 && id <= children.length) {
        nextTabTo = children[id - 1].firstElementChild;
      } else {
        return;
      }
    }

    const { HEADER_MENU_ITEM_LINK, ACTIVE } = this.classes;
    const HEADER_MENU_ITEM_LINK_ACTIVE = `${HEADER_MENU_ITEM_LINK}_${ACTIVE}`;

    this.lastHeaderMenuActiveTab.classList.remove(HEADER_MENU_ITEM_LINK_ACTIVE);
    nextTabTo.classList.add(HEADER_MENU_ITEM_LINK_ACTIVE);

    this.lastHeaderMenuActiveTab = nextTabTo;
    this.lastHeaderMenuClickedTab = this.lastHeaderMenuActiveTab;
  }

  handlerHeaderBurgerMenuButton() {
    const {
      BURGER_BUTTON_BLOCK, ACTIVE, DISABLED,
      HEADER_NAV, ANIMATION_HIDE_BURGER, HIDDEN,
    } = this.classes;
    const {
      burgerMenuButton, burgerMenuButtonOpen, burgerMenuOpen, burgerMenuModalWindow,
    } = this.elements;

    burgerMenuButton.classList.add(DISABLED);

    const BURGER_BUTTON_ACTIVE = `${BURGER_BUTTON_BLOCK}__button_${ACTIVE}`;
    const BURGER_DASH_ACTIVE = `${BURGER_BUTTON_BLOCK}__dash_${ACTIVE}`;

    burgerMenuButtonOpen.classList.toggle(BURGER_BUTTON_ACTIVE);
    burgerMenuButtonOpen.firstElementChild.classList.toggle(BURGER_DASH_ACTIVE);

    const HEADER_NAV_ACTIVE = `${HEADER_NAV}_${ACTIVE}`;

    if (burgerMenuOpen.classList.contains(HEADER_NAV_ACTIVE)) {
      burgerMenuOpen.style.animationName = ANIMATION_HIDE_BURGER;
    } else {
      burgerMenuOpen.classList.toggle(HEADER_NAV_ACTIVE);
    }

    burgerMenuModalWindow.classList.toggle(HIDDEN);
  }

  handlerHeaderBurgerMenuButtonEndAnimation(event) {
    const {
      ACTIVE, DISABLED, HEADER_NAV, ANIMATION_HIDE_BURGER,
    } = this.classes;
    const { burgerMenuButton } = this.elements;

    burgerMenuButton.classList.remove(DISABLED);

    const { target } = event;
    const isAnimationHideBurger = target.style.animationName === ANIMATION_HIDE_BURGER;

    if (isAnimationHideBurger) {
      target.removeAttribute('style');
      this.elements.burgerMenuOpen.classList.toggle(`${HEADER_NAV}_${ACTIVE}`);
    }
  }

  handlerHeaderMenu(e) {
    const target = e.target.tagName === 'LI' ? e.target.firstElementChild : e.target;

    if (this.lastHeaderMenuActiveTab === target) return;

    this.toggleActiveTab(target);

    target.click(); // click on the item, to cause default event on the anchor
    this.handlerHeaderBurgerMenuButton(); // close burger menu
  }
}

export default BurgerMenu;
