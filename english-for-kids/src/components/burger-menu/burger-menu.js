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

    this.elements = {};

    this.lastHeaderMenuActiveTab = null;
    this.lastHeaderMenuClickedTab = null;
  }

  initial() {
    this.initElements();

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

    Object.assign(this.elements, {
      headerMenu,
      burgerMenuButton,
      burgerMenuButtonOpen,
      burgerMenuOpen,
      burgerMenuModalWindow,
    });
  }

  initHandlers() {
    this.elements.headerMenu.addEventListener('click', this.handlerHeaderMenu.bind(this));
    this.elements.burgerMenuButton.addEventListener('click', this.handlerHeaderBurgerMenuButton.bind(this));
    this.elements.burgerMenuOpen.addEventListener(
      'animationend', this.handlerHeaderBurgerMenuButtonEndAnimation.bind(this),
    );
    this.elements.burgerMenuModalWindow.addEventListener(
      'click', this.handlerHeaderBurgerMenuButton.bind(this),
    );
  }

  /**
   * Deletes active className and sets to new activated tab
   * @param {HTMLElement} previousTab last tab
   * @param {HTMLElement} nextTab event.target or other new activated tab
   */
  toggleActiveTab(previousTab, nextTab) {
    const c = this.classes;
    const HEADER_MENU_ITEM_LINK_ACTIVE = `${c.HEADER_MENU_ITEM_LINK}_${c.ACTIVE}`;
    previousTab.classList.remove(HEADER_MENU_ITEM_LINK_ACTIVE);
    nextTab.classList.add(HEADER_MENU_ITEM_LINK_ACTIVE);
  }

  handlerHeaderBurgerMenuButton() {
    const c = this.classes;

    this.elements.burgerMenuButton.classList.add(c.DISABLED);

    const BURGER_BUTTON_ACTIVE = `${c.BURGER_BUTTON_BLOCK}__button_${c.ACTIVE}`;
    this.elements.burgerMenuButtonOpen.classList.toggle(BURGER_BUTTON_ACTIVE);

    const BURGER_DASH_ACTIVE = `${c.BURGER_BUTTON_BLOCK}__dash_${c.ACTIVE}`;
    this.elements.burgerMenuButtonOpen.firstElementChild.classList.toggle(BURGER_DASH_ACTIVE);

    const HEADER_NAV_ACTIVE = `${c.HEADER_NAV}_${c.ACTIVE}`;
    if (this.elements.burgerMenuOpen.classList.contains(HEADER_NAV_ACTIVE)) {
      this.elements.burgerMenuOpen.style.animationName = c.ANIMATION_HIDE_BURGER;
    } else {
      this.elements.burgerMenuOpen.classList.toggle(HEADER_NAV_ACTIVE);
    }

    this.elements.burgerMenuModalWindow.classList.toggle(c.HIDDEN);
  }

  handlerHeaderBurgerMenuButtonEndAnimation(e) {
    this.elements.burgerMenuButton.classList.remove(this.classes.DISABLED);

    if (e.target.style.animationName === this.classes.ANIMATION_HIDE_BURGER) {
      e.target.removeAttribute('style');
      this.elements.burgerMenuOpen.classList.toggle(
        `${this.classes.HEADER_NAV}_${this.classes.ACTIVE}`,
      );
    }
  }

  handlerHeaderMenu(e) {
    const target = e.target.tagName === 'LI' ? e.target.firstElementChild : e.target;

    if (this.lastHeaderMenuActiveTab === target) return;

    this.toggleActiveTab(this.lastHeaderMenuActiveTab, target);

    this.lastHeaderMenuActiveTab = target;
    this.lastHeaderMenuClickedTab = this.lastHeaderMenuActiveTab;

    target.click(); // click on the item, to cause default event on the anchor
    this.handlerHeaderBurgerMenuButton(); // close burger menu
  }
}

export default BurgerMenu;
