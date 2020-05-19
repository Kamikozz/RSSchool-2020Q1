import random from './random';

const createNewAudio = (url) => {
  const audio = new Audio(url);

  audio.preload = 'none';
  audio.volume = 0.35;

  return audio;
};

class GameMod {
  constructor() {
    this.classes = {
      HEADER_CONTAINER: 'header__container',
      SWITCH_BLOCK: 'button-switch-mode-block',
      SWITCH_BUTTON: 'button-switch-mode',
      START_GAME: 'button-start-game',

      CARDS_CONTAINER: 'cards-container',
      CARD_CONTAINER: 'card-container',
      CARD_CLASSNAME: 'card',
      CARD_TEXT: 'card__text-container',
      CARD_ROTATE_BLOCK: 'card__rotate-block',
      CARD_ICON: 'card-container__icon',

      ICON_SUCCESS: 'icon-success',
      ICON_ERROR: 'icon-error',

      HIDDEN: 'hidden',
    };

    this.elements = {};
    this.events = null;

    this.isDefaultPage = true;
    this.isTrain = true;
    this.isGameStart = false;
    this.currentAudioId = 0;
    this.cardsContainer = null;
    this.shuffledAudios = null;
  }

  initial() {
    this.initData();
    this.initElements();
    this.initHandlers();
  }

  initData() {
    this.data = null;
    this.errorAudio = createNewAudio('assets/audio/cards/error.mp3');
    this.correctAudio = createNewAudio('assets/audio/cards/correct.mp3');
  }

  initElements() {
    const [switchButton] = document.getElementsByClassName(this.classes.SWITCH_BUTTON);

    this.elements = {
      ...this.elements,
      switchButton,
    };
  }

  initHandlers() {
    this.events = [];

    this.elements.switchButton.addEventListener('click', this.handlerSwitchMode.bind(this));
    this.correctAudio.addEventListener('ended', this.handlerGameOver.bind(this));
    this.errorAudio.addEventListener('ended', this.handlerGameOver.bind(this));
  }

  setDefault(isDefaultPage = true) {
    this.isDefaultPage = isDefaultPage;
  }

  handlerSwitchMode() {
    const TRAIN = 'TRAIN';
    const PLAY = 'PLAY';

    this.isTrain = !this.isTrain;

    const { switchButton } = this.elements;
    const { START_GAME } = this.classes;

    // constants for event names, types & their handlers in the handlers array
    const startGameButtonOnClickHandlerStartGame = 'startGameButton-click-handlerStartGame';
    const cardOnClickHandlerCardCheckAnswer = 'card-click-handlerCardCheckAnswer';

    switchButton.textContent = this.isTrain ? TRAIN : PLAY;

    if (!this.isDefaultPage) {
      // find element on the page, store it into global property and addEventListener
      const [startGameButton] = document.getElementsByClassName(START_GAME);

      this.elements = {
        ...this.elements,
        startGameButton,
      };

      if (this.isTrain) {
        // if before click it was not Train (Play) -> then it was already displayed and initialized
        // then need to remove event listener
        const listener = this.events.find(
          ({ name }) => name === startGameButtonOnClickHandlerStartGame,
        );

        if (listener) {
          startGameButton.removeEventListener('click', listener.handler);
        }
      } else {
        const listener = this.events.find(
          ({ name }) => name === startGameButtonOnClickHandlerStartGame,
        );

        if (!listener) {
          const handlerStartGame = this.handlerStartGame.bind(this);

          this.events.push({
            name: startGameButtonOnClickHandlerStartGame,
            el: startGameButton,
            type: 'click',
            handler: handlerStartGame,
          });
          // first entering
          startGameButton.addEventListener('click', handlerStartGame);
        } else {
          // second, third etc. encountering
          startGameButton.addEventListener('click', listener.handler);
        }
      }

      // then hide or unhide item
      const START_GAME_HIDDEN = `${this.classes.START_GAME}_${this.classes.HIDDEN}`;

      this.elements.startGameButton.classList.toggle(START_GAME_HIDDEN);

      const [cardsContainer] = document.getElementsByClassName(this.classes.CARDS_CONTAINER);

      cardsContainer.children.forEach((card) => {
        const CARD_TEXT_HIDDEN = `${this.classes.CARD_TEXT}_${this.classes.HIDDEN}`;

        card.getElementsByClassName(this.classes.CARD_TEXT).forEach((cardText) => {
          cardText.classList.toggle(CARD_TEXT_HIDDEN);
        });

        const CARD_ROTATE_BLOCK_HIDDEN = `${this.classes.CARD_ROTATE_BLOCK}_${this.classes.HIDDEN}`;
        const [rotateBlock] = card.getElementsByClassName(this.classes.CARD_ROTATE_BLOCK);

        rotateBlock.classList.toggle(CARD_ROTATE_BLOCK_HIDDEN);
      });
    }

    const CARD_SIDE_HIDDEN = 'card__side_hidden';
    const hiddenCards = document.querySelectorAll(`.${CARD_SIDE_HIDDEN}`);

    if (hiddenCards.length) {
      hiddenCards.forEach((item) => {
        item.classList.remove(CARD_SIDE_HIDDEN);
      });
    }

    const { CARD_ICON, HIDDEN } = this.classes;
    const CARD_ICON_HIDDEN = `${CARD_ICON}_${HIDDEN}`;
    const icons = document.querySelectorAll(`.${CARD_ICON}`);

    if (icons.length) {
      icons.forEach((icon) => {
        icon.classList.add(CARD_ICON_HIDDEN);
      });
    }

    if (this.isTrain && this.isGameStart) {
      // remove handler game handlerCardCheckAnswer(e);
      const { CARD_CONTAINER, CARD_CLASSNAME } = this.classes;
      const QUERY_SELECTOR_CARD = `.${CARD_CONTAINER} .${CARD_CLASSNAME}`;
      const cardsList = document.querySelectorAll(QUERY_SELECTOR_CARD);

      if (cardsList.length) {
        const listener = this.events.find(
          ({ name }) => name === cardOnClickHandlerCardCheckAnswer,
        );

        if (listener) {
          const cards = [...cardsList];

          cards.forEach((currentCard) => {
            currentCard.removeEventListener('click', listener.handler);
          });
        }
      }
    }

    if (!this.isTrain && !this.isDefaultPage) {
      // if it was Play -> remove basic cards EventListener
      this.cardsContainer.detachChildrenEvents();

      const listener = this.events.find(
        ({ name }) => name === cardOnClickHandlerCardCheckAnswer,
      );

      let handlerCardCheckAnswer;

      if (!listener) {
        handlerCardCheckAnswer = this.handlerCardCheckAnswer.bind(this);
        this.events.push({
          name: cardOnClickHandlerCardCheckAnswer,
          el: null,
          type: 'click',
          handler: handlerCardCheckAnswer,
        });

        this.cardsContainer.children.forEach((card) => {
          card.elements.card.addEventListener('click', handlerCardCheckAnswer);
        });
      } else {
        this.cardsContainer.children.forEach((card) => {
          card.elements.card.addEventListener('click', listener.handler);
        });
      }
    } else {
      // if it was Play -> remove basic cards EventListener
      const listener = this.events.find(
        ({ name }) => name === cardOnClickHandlerCardCheckAnswer,
      );

      if (listener) {
        this.cardsContainer.children.forEach((card) => {
          card.elements.card.removeEventListener('click', listener.handler);
          card.initHandlers();
        });
      }
    }

    if (this.isGameStart) {
      this.currentAudioId = 0;

      const { startGameButton } = this.elements;

      startGameButton.textContent = 'START GAME';
      this.isGameStart = !this.isGameStart;
    }
  }

  handlerStartGame() {
    if (!this.isGameStart) {
      this.isGameStart = true;

      const { startGameButton } = this.elements;

      startGameButton.textContent = 'REPEAT';
      this.shuffledAudios = this.getSoundArray();
    }

    this.playSound();
  }

  handlerCardCheckAnswer(e) {
    if (this.isGameStart) {
      const { CARD_CONTAINER, CARD_CLASSNAME } = this.classes;
      const QUERY_SELECTOR_CARD = `.${CARD_CONTAINER} .${CARD_CLASSNAME}`;
      const items = [...document.querySelectorAll(QUERY_SELECTOR_CARD)];

      const currentIdx = items.findIndex((el) => {
        const innerItem = el.querySelector(
          e.target.className
            .split(' ')
            .map((item) => `.${item}`)
            .join(''),
        );

        return e.target === innerItem;
      });

      const currentItemAnswer = items[currentIdx];
      const isItemFound = currentIdx !== -1;

      if (isItemFound) {
        const currentItemQuestion = this.shuffledAudios[this.currentAudioId].elements.card;

        const isRightCard = currentItemAnswer === currentItemQuestion;

        this.currentAudioId += Number(isRightCard);

        const {
          CARD_ICON, ICON_SUCCESS, ICON_ERROR, HIDDEN,
        } = this.classes;
        const querySelectorCardIcon = `.${CARD_ICON}.${isRightCard ? ICON_SUCCESS : ICON_ERROR}`;
        const iconToHide = currentItemAnswer.querySelector(querySelectorCardIcon);

        iconToHide.classList.toggle(`${CARD_ICON}_${HIDDEN}`);

        (isRightCard ? this.correctAudio : this.errorAudio).play();

        if (isRightCard) {
          const iconsFalse = document.querySelectorAll(`.${CARD_ICON}.${ICON_ERROR}`);

          iconsFalse.forEach((item) => {
            item.classList.add(`${CARD_ICON}_${HIDDEN}`);
          });

          const cardOnClickHandlerCardCheckAnswer = 'card-click-handlerCardCheckAnswer';
          const listener = this.events.find(
            ({ name }) => name === cardOnClickHandlerCardCheckAnswer,
          );

          if (listener) {
            currentItemAnswer.removeEventListener('click', listener.handler);
          }
        }
      }
    }
  }

  handlerGameOver() {
    const isEnd = this.shuffledAudios.length === this.currentAudioId;

    if (isEnd) {
      window.location.href = '/';
    } else {
      this.playSound();
    }
  }

  getSoundArray() {
    return random.shuffleFisherYates(this.cardsContainer.children);
  }

  playSound() {
    const isEnd = this.shuffledAudios.length === this.currentAudioId;

    if (!isEnd) {
      const currentItem = this.shuffledAudios[this.currentAudioId];

      currentItem.audio.play();
    }
  }
}

export default GameMod;
