const createNewAudio = (url) => {
  const audio = new Audio(url);
  audio.preload = 'none';
  audio.volume = 0.35;
  return audio;
};

class Card {
  constructor(data) {
    this.classes = {
      CARD_CLASSNAME: 'card',
      CARD_ROTATE_BUTTON: 'card__rotate-button',
      CARD_CONTAINER: 'card-container',
      CARD_TEXT: 'card__text-container',
      CARD_ROTATE_BLOCK: 'card__rotate-block',
      CARD_SIDE: 'card__side',
      CARD_SIDE_FRONT: 'card_side_front',
      CARD_SIDE_BACK: 'card_side_back',
      CARD_ICON: 'card-container__icon',

      ICON_SUCCESS: 'icon-success',
      ICON_ERROR: 'icon-error',

      HIDDEN: 'hidden',
    };

    this.elements = {};
    this.data = data;
    this.events = null;

    this.initial();
  }

  initial() {
    this.initData();

    this.render();
    this.initElements();

    this.initHandlers();
  }

  initData() {
    this.audio = createNewAudio(this.data.audioSrc);
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');
    const {
      CARD_CONTAINER, CARD_CLASSNAME, CARD_SIDE_FRONT, CARD_SIDE, CARD_TEXT,
      CARD_ROTATE_BLOCK, CARD_ROTATE_BUTTON,
      CARD_ICON, ICON_SUCCESS, ICON_ERROR, HIDDEN,
    } = this.classes;
    const { image, word, translation } = this.data;

    template.innerHTML = `
      <div class="${CARD_CONTAINER} cards-container__card-container" tabindex="0">
        <div class="${CARD_CLASSNAME} ${CARD_SIDE_FRONT}">
          <div class="${CARD_SIDE} ${CARD_SIDE}_side_front">
            <div class="card__img-container">
              <div class="card__img" style="background-image: url(${image})"></div>
            </div>
            <p class="${CARD_TEXT} rainbow_color_color1">
              <span class="card__text">${word}</span>
            </p>
          </div>

          <div class="${CARD_SIDE} ${CARD_SIDE}_side_back">
            <div class="card__img-container">
              <div class="card__img" style="background-image: url(${image})"></div>
            </div>
            <p class="${CARD_TEXT} rainbow rainbow_color_color1">
              <span class="card__text">${translation}</span>
            </p>
          </div>

          <div class="${CARD_ROTATE_BLOCK} rainbow rainbow_color_color1" tabindex="0">
            <button class="${CARD_ROTATE_BUTTON}"></button>
          </div>

          <div class="${CARD_ICON} ${ICON_SUCCESS} ${CARD_ICON}_${HIDDEN}"></div>
          <div class="${CARD_ICON} ${ICON_ERROR} ${CARD_ICON}_${HIDDEN}"></div>
        </div>
      </div>
    `;
    fragment.append(template.content);

    this.rootEl = fragment.firstElementChild;
    this.markup = fragment.firstElementChild.outerHTML;
  }

  initElements() {
    const cardContainer = this.rootEl;
    const [card] = this.rootEl.getElementsByClassName(this.classes.CARD_CLASSNAME);
    const [cardRotateButton] = this.rootEl.getElementsByClassName(this.classes.CARD_ROTATE_BLOCK);

    this.elements = {
      ...this.elements,
      cardContainer,
      card,
      cardRotateButton,
    };
  }

  initHandlers() {
    this.handlerCardMouseLeave = this.handlerCardMouseLeave.bind(this);

    const handlerCardMouseClick = this.handlerCardMouseClick.bind(this);
    const handlerCardRotate = this.handlerCardRotate.bind(this);

    const { card, cardRotateButton } = this.elements;

    this.events = [{
      el: card,
      type: 'click',
      handler: handlerCardMouseClick,
    }, {
      el: cardRotateButton,
      type: 'click',
      handler: handlerCardRotate,
    }];
    this.elements.card.addEventListener('click', handlerCardMouseClick);
    this.elements.cardRotateButton.addEventListener('click', handlerCardRotate);
  }

  getMarkup() {
    return this.markup;
  }

  detachEvents() {
    if (this.events) {
      this.events.forEach((event) => {
        const { el, type, handler } = event;

        el.removeEventListener(type, handler);
      });
    }
  }

  handlerCardSwitchSide() {
    const { card } = this.elements;

    card.classList.toggle(this.classes.CARD_SIDE_FRONT);
    card.classList.toggle(this.classes.CARD_SIDE_BACK);
  }

  handlerCardRotate() {
    const { cardContainer } = this.elements;

    this.handlerCardSwitchSide();
    cardContainer.addEventListener('mouseleave', this.handlerCardMouseLeave);
  }

  handlerCardMouseLeave() {
    const { card, cardContainer } = this.elements;
    const { CARD_SIDE_BACK } = this.classes;

    const isCardSideBackClassOnCard = card.classList.contains(CARD_SIDE_BACK);

    if (isCardSideBackClassOnCard) {
      this.handlerCardSwitchSide();
      cardContainer.removeEventListener('mouseleave', this.handlerCardMouseLeave);
    }
  }

  handlerCardMouseClick() {
    this.audio.play();
  }
}

export default Card;
