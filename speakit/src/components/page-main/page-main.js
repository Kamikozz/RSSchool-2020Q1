class PageMain {
  constructor() {
    this.classes = {
      ROOT: 'page-main',
      SPEAK_BUTTON: 'controls__speak-button',
      WORDS_CONTAINER: 'words-container',
      WORD_CARD: 'words-container__card',
      WORD_CARD_ACTIVE: 'words-container__card_active',
    };
    this.elements = {};
  }

  init() {
    this.initData();
    this.render();
    this.initElements();
    this.initHandlers();
  }

  initData() {
    console.log(this);
  }

  render() {
    // const c = this.classes;
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

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
              <div class="words-container__card">
                <span class="words-container__icon"></span>
                <div class="words-container__word-container">
                  <p class="words-container__word">view</p>
                  <p class="words-container__transcription">[vjuː]</p>
                </div>
              </div>
              <div class="words-container__card">
                <span class="words-container__icon"></span>
                <div class="words-container__word-container">
                  <p class="words-container__word">calm</p>
                  <p class="words-container__transcription">[kɑːm]</p>
                </div>
              </div>
              <div class="words-container__card">
                <span class="words-container__icon"></span>
                <div class="words-container__word-container">
                  <p class="words-container__word">cat</p>
                  <p class="words-container__transcription">[kæt]</p>
                </div>
              </div>
              <div class="words-container__card">
                <span class="words-container__icon"></span>
                <div class="words-container__word-container">
                  <p class="words-container__word">dog</p>
                  <p class="words-container__transcription">[dɔːg]</p>
                </div>
              </div>
              <div class="words-container__card">
                <span class="words-container__icon"></span>
                <div class="words-container__word-container">
                  <p class="words-container__word">friend</p>
                  <p class="words-container__transcription">[frend]</p>
                </div>
              </div>
              <div class="words-container__card">
                <span class="words-container__icon"></span>
                <div class="words-container__word-container">
                  <p class="words-container__word">horse</p>
                  <p class="words-container__transcription">[hɔːrs]</p>
                </div>
              </div>
              <div class="words-container__card">
                <span class="words-container__icon"></span>
                <div class="words-container__word-container">
                  <p class="words-container__word">hear</p>
                  <p class="words-container__transcription">[hiər]</p>
                </div>
              </div>
              <div class="words-container__card">
                <span class="words-container__icon"></span>
                <div class="words-container__word-container">
                  <p class="words-container__word">help</p>
                  <p class="words-container__transcription">[help]</p>
                </div>
              </div>
            </div>
            <div class="page-main__controls controls">
              <button class="controls__button controls__restart-button">Restart</button>
              <button class="controls__button controls__speak-button">Speak it</button>
              <button class="controls__button controls__results-button">Results</button>
            </div>
            <audio preload="none" src=""></audio>
          </div>
        </main>
      </div>
    `;
    fragment.append(template.content);
    this.elements.root = fragment.firstElementChild;
    document.body.append(fragment);
  }

  initElements() {
    const [speakButton] = document.getElementsByClassName(this.classes.SPEAK_BUTTON);
    const [wordsContainer] = document.getElementsByClassName(this.classes.WORDS_CONTAINER);

    Object.assign(this.elements, {
      speakButton,
      wordsContainer,
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
    this.playSound();
  }

  playSound() {
    console.log('WTF', this);
  }
}

export default PageMain;
