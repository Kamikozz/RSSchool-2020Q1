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
    // TODO: remove
    // this.audios = [{
    //   cardName: 'front',
    //   audioSrc: 'https://sound-pack.net/download/Sound_17211.mp3',
    // }, {
    //   cardName: 'windows',
    //   audioSrc: 'https://sound-pack.net/download/Sound_04669.mp3',
    // }];
    // this.soundArray = [];

    // this.errorAudio = createNewAudio('assets/audio/cards/error.mp3');
    // this.correctAudio = createNewAudio('assets/audio/cards/correct.mp3');
  }

  render() {
    const c = this.classes;
    const fragment = new DocumentFragment();
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="${c.CARD_CONTAINER} cards-container__card-container" tabindex="0">
        <div class="${c.CARD_CLASSNAME} ${c.CARD_SIDE_FRONT}">
          <div class="${c.CARD_SIDE} ${c.CARD_SIDE}_side_front">
            <div class="card__img-container">
              <div class="card__img" style="background-image: url(${this.data.image})"></div>
            </div>
            <p class="${c.CARD_TEXT} rainbow_color_color1">
              <span class="card__text">${this.data.word}</span>
            </p>
          </div>

          <div class="${c.CARD_SIDE} ${c.CARD_SIDE}_side_back">
            <div class="card__img-container">
              <div class="card__img" style="background-image: url(${this.data.image})"></div>
            </div>
            <p class="${c.CARD_TEXT} rainbow rainbow_color_color1">
              <span class="card__text">${this.data.translation}</span>
            </p>
          </div>

          <div class="${c.CARD_ROTATE_BLOCK} rainbow rainbow_color_color1" tabindex="0">
            <button class="${c.CARD_ROTATE_BUTTON}"></button>
          </div>

          <div class="${c.CARD_ICON} ${c.ICON_SUCCESS} ${c.CARD_ICON}_${c.HIDDEN}"></div>
          <div class="${c.CARD_ICON} ${c.ICON_ERROR} ${c.CARD_ICON}_${c.HIDDEN}"></div>
        </div>
      </div>
    `;
    fragment.append(template.content);

    this.rootEl = fragment.firstElementChild;
    this.markup = fragment.firstElementChild.outerHTML;

    // this.elements.categoriesContainer.append(fragment);

    // const fragment = new DocumentFragment();
    // const div = document.createElement('div');
    // div.classList.add('lol');
    // div.style.width = '500px';
    // div.style.height = '500px';
    // div.style.backgroundColor = '#123123';
    // fragment.append(div);
    // const handler = () => { console.log('CHE'); };
    // fragment.querySelector('.lol').addEventListener('click', handler);
    // document.body.append(fragment);
    // document.querySelector('.lol').removeEventListener('click', handler);
  }

  initElements() {
    const cardContainer = this.rootEl;
    const [card] = this.rootEl.getElementsByClassName(this.classes.CARD_CLASSNAME);
    const [cardRotateButton] = this.rootEl.getElementsByClassName(this.classes.CARD_ROTATE_BLOCK);

    Object.assign(this.elements, {
      cardContainer,
      card,
      cardRotateButton,
    });
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
    // -----------------------
    // this.elements.startGameButton.addEventListener('click', handlerStartGame);

    // this.elements.correctAudio.addEventListener('ended', handlerGameOver);
    // this.elements.errorAudio.addEventListener('ended', handlerGameOver);
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
    this.elements.card.classList.toggle(this.classes.CARD_SIDE_FRONT);
    this.elements.card.classList.toggle(this.classes.CARD_SIDE_BACK);
  }

  handlerCardRotate() {
    const el = this.elements;

    this.handlerCardSwitchSide();
    el.cardContainer.addEventListener('mouseleave', this.handlerCardMouseLeave);
  }

  handlerCardMouseLeave() {
    const el = this.elements;
    const c = this.classes;

    if (el.card.classList.contains(c.CARD_SIDE_BACK)) {
      this.handlerCardSwitchSide();
      el.cardContainer.removeEventListener('mouseleave', this.handlerCardMouseLeave);
    }
  }

  // const handlerGameOver = () => {
  //   const isEnd = shuffledAudios.length === currentAudioId;
  //   if (isEnd) {
  //     console.log('WINNER');
  //     switchMode();
  //     // TODO: window.location.href = '#/';
  //   } else {
  //     playSound();
  //   }
  // };

  handlerCardMouseClick() {
    this.audio.play();
  }

  // const handlerCardCheckAnswer = (e) => {
  //   // TODO: ПОМЕНЯТЬ ФЛОУ, ДЛЯ ПРИМЕРА СМОТРИ https://vigorous-mcclintock-800815.netlify.app/
  //   // 1. НЕ БЛОКИРОВАТЬ КНОПКИ ДЛЯ НАЖАТИЯ, А БЛОКИРОВАТЬ УЖЕ НАЖАТЫЕ ПРАВИЛЬНО
  //   // 2. КРАСИТЬ НЕПРАВИЛЬНУЮ КНОПКУ, НО СБРАСЫВАТЬ ВСЕ КРАСНЫЕ ВЫДЕЛЕНИЯ ПОСЛЕ
  // ПРАВИЛЬНОГО ОТВЕТА
  //   // 3. ПРИ РЕЖИМЕ ИГРА МОЖНО ПЕРЕКЛЮЧИТЬСЯ НА ДРУГОЕ И ... ХЗ
  //   // Cards List
  //   const items = [...document.body
  //     .querySelectorAll(`.${classes.CARD_CONTAINER} .${classes.CARD_CLASSNAME}`)];
  //   console.log(items);
  //   // console.log(document.body
  //   //  .querySelectorAll(e.target.className.split(' ').map((item) => `.${item}`).join('')));

  //   const currentIdx = items.findIndex((el) => {
  //     const innerItem = el.querySelector(
  //       e.target.className
  //         .split(' ')
  //         .map((item) => `.${item}`)
  //         .join(''),
  //     );
  //     // console.log('Hey: ', innerItem, el, idx);
  //     return e.target === innerItem;
  //   });

  //   const currentItemAnswer = items[currentIdx];
  //   console.log(currentItemAnswer, currentIdx);

  //   if (currentIdx !== -1) {
  //     const currentItemQuestion = shuffledAudios[currentAudioId];
  //     console.log('Hey', currentItemQuestion);

  //     console.log(currentItemAnswer);

  //     currentAudioId += 1;
  //     console.log(currentAudioId);

  //     const clickedCardText = currentItemAnswer
  // .querySelector('.card__side_side_front .card__text');
  //     const isRightCard = currentItemQuestion.cardName === clickedCardText.textContent;

  //     const iconToHide = currentItemAnswer.querySelector(
  //       `.${classes.CARD_ICON}.${isRightCard ? classes.ICON_SUCCESS : classes.ICON_ERROR}`,
  //     );
  //     iconToHide.classList.toggle(`${classes.CARD_ICON}_${classes.HIDDEN}`);
  //     console.log(isRightCard ? 'YES' : 'NO');

  //     (isRightCard ? correctAudio : errorAudio).play();

  //     currentItemAnswer
  // .querySelector('.card__side_side_front').classList.add('card__side_hidden');
  //     currentItemAnswer.removeEventListener('click', handlerCardMouseClick);
  //   }
  // };

  // const shuffleArray = (arr) => {
  //   // TODO: shuffle algorithm from Singolo
  //   // for (let i = 0; i < )
  //   const newArr = [];
  //   arr.forEach((item) => {
  //     newArr.push(item);
  //   });
  //   return newArr.reverse();
  // };

  // const getSoundArray = () => {
  //   const arr = [];
  //   audios.forEach((item) => {
  //     const url = item.audioSrc;
  //     arr.push({
  //       cardName: item.cardName,
  //       audio: createNewAudio(url),
  //     });
  //   });

  //   return shuffleArray(arr);
  // };

  // const handlerStartGame = () => {
  //   console.log('START GAME');
  //   isGameStart = true;
  //   // currentAudioId = 0;

  //   startGameButton.textContent = 'REPEAT WORD';

  //   shuffledAudios = getSoundArray();

  //   playSound();
  // };
}

// let isTrain;
// let isGameStart;
// let shuffledAudios;
// let currentAudioId;

export default Card;

// const classes = {
//   CARD_CLASSNAME: 'card',
//   CARD_ROTATE_BUTTON: 'card__rotate-button',
//   CARD_CONTAINER: 'card-container',
//   CARD_TEXT: 'card__text-container',
//   CARD_ROTATE_BLOCK: 'card__rotate-block',
//   CARD_SIDES: ['card_side_front', 'card_side_back'],
//   CARD_ICON: 'card-container__icon',

//   SWITCH_BUTTON: 'button-switch-mode',
//   START_GAME: 'button-start-game',

//   ICON_SUCCESS: 'icon-success',
//   ICON_ERROR: 'icon-error',

//   HIDDEN: 'hidden',
// };

// const [cardContainer] = document.getElementsByClassName(classes.CARD_CONTAINER);
// const [card] = document.getElementsByClassName(classes.CARD_CLASSNAME);
// const [cardRotateButton] = document.getElementsByClassName(classes.CARD_ROTATE_BLOCK);
// const [switchButton] = document.getElementsByClassName(classes.SWITCH_BUTTON);
// const [startGameButton] = document.getElementsByClassName(classes.START_GAME);

// // const elements = Object.assign({}, {
// //   cardContainer,
// //   card,
// //   cardRotateButton,
// //   switchButton,
// //   startGameButton,
// // });

// // const eventListeners = {};

// const audios = [{
//   cardName: 'front',
//   audioSrc: 'https://sound-pack.net/download/Sound_17211.mp3',
// }, {
//   cardName: 'windows',
//   audioSrc: 'https://sound-pack.net/download/Sound_04669.mp3',
// }];
// const soundArray = [];

// let isTrain;
// let isGameStart;
// let shuffledAudios;
// let currentAudioId;

// const createNewAudio = (url) => {
//   const audio = new Audio(url);
//   audio.volume = 0.1;
//   return audio;
// };

// const errorAudio = createNewAudio('assets/audio/cards/error.mp3');
// const correctAudio = createNewAudio('assets/audio/cards/correct.mp3');

// const handlerCardSwitchSide = () => {
//   classes.CARD_SIDES.forEach((className) => card.classList.toggle(className));
// };

// const handlerCardMouseLeave = () => {
//   console.log('mouseleave');
//   if (card.classList.contains(classes.CARD_SIDES[1])) {
//     handlerCardSwitchSide();
//     cardContainer.removeEventListener('mouseleave', handlerCardMouseLeave);
//   }
// };

// const handlerCardRotate = () => {
//   handlerCardSwitchSide();
//   cardContainer.addEventListener('mouseleave', handlerCardMouseLeave);
// };

// const addNewSound = (cardName) => {
//   const url = audios.find((item) => item.cardName === cardName).audioSrc;
//   const audio = createNewAudio(url);
//   soundArray.push({ cardName, audio });
//   return audio;
// };

// const handlerCardPlaySound = (cardName) => {
//   const searchResult = soundArray.find((item) => item.cardName === cardName);
//   const audio = searchResult ? searchResult.audio : addNewSound(cardName);
//   audio.play();
// };

// const playSound = () => {
//   // TODO: near the implementation of the header burger menu
//   // there was an error of getting element of undefined
//   const isEnd = shuffledAudios.length === currentAudioId;
//   if (!isEnd) {
//     const currentItem = shuffledAudios[currentAudioId];
//     console.log(currentItem);
//     currentItem.audio.play();
//   }
// };

// const handlerGameOver = () => {
//   const isEnd = shuffledAudios.length === currentAudioId;
//   if (isEnd) {
//     console.log('WINNER');
//     switchMode();
//     // TODO: window.location.href = '#/';
//   } else {
//     playSound();
//   }
// };

// const handlerCardMouseClick = (e) => {
//   console.log(e);
//   if (isTrain) {
//     handlerCardPlaySound('front');
//     console.log(soundArray);
//   } else if (isGameStart) {
//     handlerCardCheckAnswer(e);
//   }
// };

// // button modes switcher: TRAIN / TEST
// const switchMode = () => {
//   isTrain = !isTrain;
//   switchButton.textContent = isTrain ? 'TRAIN' : 'PLAY';
//   startGameButton.classList.toggle(`${classes.START_GAME}_${classes.HIDDEN}`);

//   const cardTexts = card.querySelectorAll(`.${classes.CARD_TEXT}`);
//   cardTexts.forEach((cardText) => {
//     cardText.classList.toggle(`${classes.CARD_TEXT}_${classes.HIDDEN}`);
//   });

//   const rotateBlock = card.querySelector(`.${classes.CARD_ROTATE_BLOCK}`);
//   rotateBlock.classList.toggle(`${classes.CARD_ROTATE_BLOCK}_${classes.HIDDEN}`);

//   document.querySelectorAll('.card__side_hidden').forEach((item) => {
//     item.classList.remove('card__side_hidden');
//   });

//   document.querySelectorAll(`.${classes.CARD_ICON}`).forEach((item) => {
//     item.classList.add(`${classes.CARD_ICON}_${classes.HIDDEN}`);
//   });

//   if (isGameStart) {
//     const cardsList = [...document.body
//       .querySelectorAll(`.${classes.CARD_CONTAINER} .${classes.CARD_CLASSNAME}`)];
//     cardsList.forEach((currentCard) => {
//       currentCard.addEventListener('click', handlerCardMouseClick);
//     });
//     // console.log(cardsList);
//     currentAudioId = 0;

//     startGameButton.textContent = 'START GAME';

//     isGameStart = !isGameStart;
//   }
// };

// const handlerCardCheckAnswer = (e) => {
//   // TODO: ПОМЕНЯТЬ ФЛОУ, ДЛЯ ПРИМЕРА СМОТРИ https://vigorous-mcclintock-800815.netlify.app/
//   // 1. НЕ БЛОКИРОВАТЬ КНОПКИ ДЛЯ НАЖАТИЯ, А БЛОКИРОВАТЬ УЖЕ НАЖАТЫЕ ПРАВИЛЬНО
//   // 2. КРАСИТЬ НЕПРАВИЛЬНУЮ КНОПКУ, НО СБРАСЫВАТЬ ВСЕ КРАСНЫЕ ВЫДЕЛЕНИЯ ПОСЛЕ ПРАВИЛЬНОГО ОТВЕТА
//   // 3. ПРИ РЕЖИМЕ ИГРА МОЖНО ПЕРЕКЛЮЧИТЬСЯ НА ДРУГОЕ И ... ХЗ
//   // Cards List
//   const items = [...document.body
//     .querySelectorAll(`.${classes.CARD_CONTAINER} .${classes.CARD_CLASSNAME}`)];
//   console.log(items);
//   // console.log(document.body
//   //  .querySelectorAll(e.target.className.split(' ').map((item) => `.${item}`).join('')));

//   const currentIdx = items.findIndex((el) => {
//     const innerItem = el.querySelector(
//       e.target.className
//         .split(' ')
//         .map((item) => `.${item}`)
//         .join(''),
//     );
//     // console.log('Hey: ', innerItem, el, idx);
//     return e.target === innerItem;
//   });

//   const currentItemAnswer = items[currentIdx];
//   console.log(currentItemAnswer, currentIdx);

//   if (currentIdx !== -1) {
//     const currentItemQuestion = shuffledAudios[currentAudioId];
//     console.log('Hey', currentItemQuestion);

//     console.log(currentItemAnswer);

//     currentAudioId += 1;
//     console.log(currentAudioId);

//     const clickedCardText = currentItemAnswer
//  .querySelector('.card__side_side_front .card__text');
//     const isRightCard = currentItemQuestion.cardName === clickedCardText.textContent;

//     const iconToHide = currentItemAnswer.querySelector(
//       `.${classes.CARD_ICON}.${isRightCard ? classes.ICON_SUCCESS : classes.ICON_ERROR}`,
//     );
//     iconToHide.classList.toggle(`${classes.CARD_ICON}_${classes.HIDDEN}`);
//     console.log(isRightCard ? 'YES' : 'NO');

//     (isRightCard ? correctAudio : errorAudio).play();

//     currentItemAnswer.querySelector('.card__side_side_front').classList.add('card__side_hidden');
//     currentItemAnswer.removeEventListener('click', handlerCardMouseClick);
//   }
// };

// const shuffleArray = (arr) => {
//   // TODO: shuffle algorithm from Singolo
//   // for (let i = 0; i < )
//   const newArr = [];
//   arr.forEach((item) => {
//     newArr.push(item);
//   });
//   return newArr.reverse();
// };

// const getSoundArray = () => {
//   const arr = [];
//   audios.forEach((item) => {
//     const url = item.audioSrc;
//     arr.push({
//       cardName: item.cardName,
//       audio: createNewAudio(url),
//     });
//   });

//   return shuffleArray(arr);
// };

// const handlerStartGame = () => {
//   console.log('START GAME');
//   isGameStart = true;
//   // currentAudioId = 0;

//   startGameButton.textContent = 'REPEAT WORD';

//   shuffledAudios = getSoundArray();

//   playSound();
// };

// const initHandlers = () => {
//   card.addEventListener('click', handlerCardMouseClick);
//   cardRotateButton.addEventListener('click', handlerCardRotate);
//   switchButton.addEventListener('click', switchMode);
//   startGameButton.addEventListener('click', handlerStartGame);

//   correctAudio.addEventListener('ended', handlerGameOver);
//   errorAudio.addEventListener('ended', handlerGameOver);
// };

// const initial = () => {
//   isTrain = true;
//   isGameStart = false;
//   currentAudioId = 0;

//   switchButton.textContent = 'TRAIN';
//   startGameButton.textContent = 'START GAME';

//   card.classList.add(classes.CARD_SIDES[0]);
//   startGameButton.classList.add(`${classes.START_GAME}_${classes.HIDDEN}`);

//   initHandlers();
// };

// // initial();

// // const card1 = document.getElementsByClassName(CARD_CLASSNAME)[1];
// // card1.addEventListener('click', () => {
// //   handlerCardPlaySound('windows');
// //   handlerCardCheckAnswer();
// // });

// // это должно быть в компоненте switchModeButton

// export default {
//   initial,
// };
