const getWords = async (page, group) => {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
  const res = await fetch(url);
  const json = await res.json();
  // console.log(json);

  return json;
  // console.log(json);
  // console.log(JSON.stringify(json, null, 1));
  // console.log(JSON.stringify(json, null, 1));
};

class PageMain {
  constructor() {
    this.classes = {
      ROOT: 'page-main',
      SPEAK_BUTTON: 'controls__speak-button',
      WORDS_CONTAINER: 'words-container',
      WORD_CARD: 'words-container__card',
      WORD_CARD_ACTIVE: 'words-container__card_active',
      AUDIO_PLAYER: 'audio-player',
    };
    this.elements = {};
    this.data = null;
  }

  async init() {
    await this.initData();
    this.render();
    this.initElements();
    this.initHandlers();
  }

  async initData() {
    console.log(this);
    this.data = await getWords(0, 0);
    // console.log(this.data);
  }

  render() {
    // const c = this.classes;
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    // <div class="words-container__card">
    //   <span class="words-container__icon"></span>
    //   <div class="words-container__word-container">
    //     <p class="words-container__word">view</p>
    //     <p class="words-container__transcription">[vjuː]</p>
    //   </div>
    // </div>
    // <div class="words-container__card">
    //   <span class="words-container__icon"></span>
    //   <div class="words-container__word-container">
    //     <p class="words-container__word">calm</p>
    //     <p class="words-container__transcription">[kɑːm]</p>
    //   </div>
    // </div>
    // <div class="words-container__card">
    //   <span class="words-container__icon"></span>
    //   <div class="words-container__word-container">
    //     <p class="words-container__word">cat</p>
    //     <p class="words-container__transcription">[kæt]</p>
    //   </div>
    // </div>
    // <div class="words-container__card">
    //   <span class="words-container__icon"></span>
    //   <div class="words-container__word-container">
    //     <p class="words-container__word">dog</p>
    //     <p class="words-container__transcription">[dɔːg]</p>
    //   </div>
    // </div>
    // <div class="words-container__card">
    //   <span class="words-container__icon"></span>
    //   <div class="words-container__word-container">
    //     <p class="words-container__word">friend</p>
    //     <p class="words-container__transcription">[frend]</p>
    //   </div>
    // </div>
    // <div class="words-container__card">
    //   <span class="words-container__icon"></span>
    //   <div class="words-container__word-container">
    //     <p class="words-container__word">horse</p>
    //     <p class="words-container__transcription">[hɔːrs]</p>
    //   </div>
    // </div>
    // <div class="words-container__card">
    //   <span class="words-container__icon"></span>
    //   <div class="words-container__word-container">
    //     <p class="words-container__word">hear</p>
    //     <p class="words-container__transcription">[hiər]</p>
    //   </div>
    // </div>

    template.innerHTML = `
      <div class="page-main">
        <main class="page-main__main">
          <div class="wrapper">
            <div class="page-main__pagination pagination">
              <ul class="pagination__list">
                <li class="pagination__item pagination__item_active">1</li>
                <li class="pagination__item">2</li>
                <li class="pagination__item">3</li>
                <li class="pagination__item">4</li>
                <li class="pagination__item">5</li>
                <li class="pagination__item">6</li>
              </ul>
            </div>
            <div class="page-main__current-word-container current-word-container">
              <div class="current-word-container__image-container">
                <img class="current-word-container__image" src="assets/img/bg-intro.jpg" alt="your word">
              </div>
              <p class="current-word-container__translation">Your pronunciation or translation will be here</p>
            </div>
            <div class="page-main__words-container words-container">
            </div>
            <div class="page-main__controls controls">
              <button class="controls__button controls__restart-button">Restart</button>
              <button class="controls__button controls__speak-button">Speak it</button>
              <button class="controls__button controls__results-button">Results</button>
            </div>
            <audio class="audio-player" preload="none" src=""></audio>
          </div>
        </main>
      </div>
    `;
    this.elements.root = template.content.firstElementChild;
    [this.elements.wordsContainer] = this.elements.root
      .getElementsByClassName(this.classes.WORDS_CONTAINER);

    // console.log('wtf', this.data);
    this.data.forEach((item) => {
      const {
        word, transcription, image, audio,
      } = item;
      const cardTemplate = document.createElement('template');
      cardTemplate.innerHTML = `
        <div class="words-container__card" data-audio="${audio}" data-image="${image}">
          <span class="words-container__icon"></span>
          <div class="words-container__word-container">
            <p class="words-container__word">${word}</p>
            <p class="words-container__transcription">${transcription}</p>
          </div>
        </div>
      `;
      this.elements.wordsContainer.append(cardTemplate.content);
    });

    fragment.append(template.content);
    document.body.append(fragment);
  }

  initElements() {
    const [speakButton] = document.getElementsByClassName(this.classes.SPEAK_BUTTON);
    const [audioPlayer] = document.getElementsByClassName(this.classes.AUDIO_PLAYER);

    Object.assign(this.elements, {
      speakButton,
      audioPlayer,
    });
  }

  initHandlers() {
    this.elements.speakButton.addEventListener('click', this.handlerSpeakButton.bind(this));

    this.elements.wordsContainer.children.forEach((card) => {
      card.addEventListener('click', this.handlerCardClick.bind(this));
    });
  }

  handlerSpeakButton() {
    console.log(this);

    const SpeechRecognition = window.webkitSpeechRecognition;
    const speechRecognition = new SpeechRecognition();
    speechRecognition.lang = 'en-US';
  }

  handlerCardClick(event) {
    let { target } = event;

    while (target && !target.classList.contains(this.classes.WORD_CARD)) {
      target = target.parentElement;
    }

    if (target) {
      this.elements.wordsContainer.children.forEach((wordCard) => {
        wordCard.classList.remove(this.classes.WORD_CARD_ACTIVE);
      });
      target.classList.add(this.classes.WORD_CARD_ACTIVE);
    }

    this.playSound(target);
    this.changeImage(target);
  }

  playSound(card) {
    const { audioPlayer } = this.elements;
    const baseUrl = 'https://raw.githubusercontent.com/kamikozz/rslang-data/master/data/';
    const audioSrc = card.dataset.audio.replace('files/', '');
    // const imageSrc =
    console.log(card);
    console.log(this.elements.audioPlayer);
    audioPlayer.src = `${baseUrl}${audioSrc}`;
    audioPlayer.play();
    console.log('WTF', this);
  }

  changeImage(target) {
    console.log(target, this);
  }
}

export default PageMain;
