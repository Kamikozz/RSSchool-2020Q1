import data from '../../js/cards.data';
import random from '../../js/random';
import Card from '../card/card';

class CardsContainer {
  constructor() {
    this.classes = {
      CARDS: 'cards-container',
    };

    this.elements = {
      mainElem: document.querySelector('.main-content .wrapper'),
    };

    this.children = [];
  }

  initial() {
    this.elements.mainElem.innerHTML = `
      <div class="progress-container progress-container_hidden">
        <div class="progress-container__star icon-star-outline progress-container__star_success"></div>
        <div class="progress-container__star icon-star progress-container__star_error"></div>
      </div>
      <div class="game-controllers-container main-content__game-controllers-container">
        <button class="button button-start-game button-start-game_hidden button_theme_train">START GAME</button>
      </div>

      <div class="cards-container"></div>
    `;

    this.initElements();
    this.initData();
    this.render();
  }

  initElements() {
    const [cardsContainer] = document.getElementsByClassName(this.classes.CARDS);

    Object.assign(this.elements, {
      cardsContainer,
    });
  }

  initData() {
    const path = window.location.hash.substring(1).split('/');
    let id = path[path.length - 1];

    const categories = data.slice(1);

    if (id <= 0 || id > categories.length) {
      id = random.getRandomId(categories.length);
    }

    const cards = categories[id - 1];
    this.data = cards;

    cards.forEach((card) => {
      const newCard = new Card(card);
      this.children.push(newCard);
    });
  }

  render() {
    const fragment = new DocumentFragment();

    this.children.forEach((card) => {
      fragment.append(card.rootEl);
    });

    this.elements.cardsContainer.append(fragment);
  }

  detachChildrenEvents() {
    this.children.forEach((card) => {
      card.detachEvents();
    });
  }
}

export default CardsContainer;
