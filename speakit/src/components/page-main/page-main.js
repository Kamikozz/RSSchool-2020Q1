import loader from '../../js/loader';

const getWords = async (page, group) => {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
  const res = await fetch(url);
  const json = await res.json();

  return json.slice(0, 10);
};

const getTranslation = async (word) => {
  const baseUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=';
  const key = 'trnsl.1.1.20200427T065631Z.0c10983194239a87.e571e7bd7d82365b43142a166f902ab5f37ea1dd';
  const params = `&text=${word}&lang=en-ru`;
  const url = `${baseUrl}${key}${params}`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

class PageMain {
  constructor(props) {
    this.props = props;
    this.classes = {
      ROOT: 'page-main',
      SPEAK_BUTTON: 'controls__speak-button',
      WORDS_CONTAINER: 'words-container',
      WORD_CARD: 'words-container__card',
      WORD_CARD_ACTIVE: 'words-container__card_active',
      AUDIO_PLAYER: 'audio-player',
      IMAGE: 'current-word-container__image',
      TRANSLATION: 'current-word-container__translation',
      WORD: 'words-container__word',
      PAGINATION: 'pagination__list',
      PAGE: 'pagination__item',
      ACTIVE_PAGE: 'pagination__item_active',
      RESTART_BUTTON: 'controls__restart-button',
      BUTTON_DISABLED: 'controls__button_disabled',
    };
    this.elements = {};
    this.data = null;
    this.baseUrl = 'https://raw.githubusercontent.com/kamikozz/rslang-data/master/data/';
    this.speechRecognition = null;
  }

  async init() {
    this.props.page = this.props.page > 5 || this.props.page < 0 ? 0 : this.props.page;

    await this.initData();
    this.render();
    this.initElements();
    this.initHandlers();
  }

  async initData() {
    this.data = await getWords(0, this.props.page);

    loader.toggleLoader();
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
                <li class="pagination__item">1</li>
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
              <button class="controls__button controls__restart-button controls__button_disabled">Restart</button>
              <button class="controls__button controls__speak-button">Speak it</button>
              <button class="controls__button controls__results-button controls__button_disabled">Results</button>
            </div>
            <audio class="audio-player" preload="none" src=""></audio>
          </div>
        </main>
      </div>
    `;

    this.elements.root = template.content.firstElementChild;

    [this.elements.pagination] = this.elements.root.getElementsByClassName(this.classes.PAGINATION);
    this.elements.pagination.children[this.props.page].classList.add(this.classes.ACTIVE_PAGE);

    [this.elements.wordsContainer] = this.elements.root
      .getElementsByClassName(this.classes.WORDS_CONTAINER);

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
    const [restartButton] = document.getElementsByClassName(this.classes.RESTART_BUTTON);
    const [speakButton] = document.getElementsByClassName(this.classes.SPEAK_BUTTON);
    const [audioPlayer] = document.getElementsByClassName(this.classes.AUDIO_PLAYER);
    const [gallery] = document.getElementsByClassName(this.classes.IMAGE);
    const [translation] = document.getElementsByClassName(this.classes.TRANSLATION);

    audioPlayer.volume = 0.2;

    Object.assign(this.elements, {
      restartButton,
      speakButton,
      audioPlayer,
      gallery,
      translation,
    });
  }

  initHandlers() {
    this.elements.restartButton.addEventListener('click', this.handlerRestartButton.bind(this));
    this.elements.speakButton.addEventListener('click', this.handlerSpeakButton.bind(this));
    this.elements.wordsContainer.children.forEach((card) => {
      card.addEventListener('click', this.handlerCardClick.bind(this));
    });
    this.elements.pagination.addEventListener('click', this.handlerSwitchDifficulty.bind(this));
  }

  handlerSwitchDifficulty(event) {
    const isPage = event.target.classList.contains(this.classes.PAGE);
    const isActivePage = event.target.classList.contains(this.classes.ACTIVE_PAGE);

    if (event.target && isPage && !isActivePage) {
      const currentPage = Array.prototype.findIndex.call(this.elements.pagination.children,
        (item) => event.target === item);

      this.elements.root.remove();

      loader.toggleLoader();

      const mainPage = new PageMain({
        page: currentPage,
      });

      mainPage.init();
    }
  }

  handlerRestartButton() {
    this.speechRecognition.abort();
    this.speechRecognition.removeEventListener('end', this.speechRecognition.start);

    [...this.elements.wordsContainer.children].forEach((card) => {
      card.removeAttribute('style');
    });

    this.elements.restartButton.classList.add(this.classes.BUTTON_DISABLED);
    this.elements.speakButton.classList.remove(this.classes.BUTTON_DISABLED);
  }

  handlerSpeakButton() {
    const SpeechRecognition = window.webkitSpeechRecognition;

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.lang = 'en-US';
    this.speechRecognition.maxAlternatives = 10;
    this.speechRecognition.addEventListener('result', this.recognize.bind(this));
    this.speechRecognition.addEventListener('end', this.speechRecognition.start);
    this.speechRecognition.start();

    this.elements.restartButton.classList.remove(this.classes.BUTTON_DISABLED);
    this.elements.speakButton.classList.add(this.classes.BUTTON_DISABLED);
  }

  recognize(event) {
    const [translationAlternatives] = [...event.results];
    const translations = [...translationAlternatives].map((item) => item.transcript.toLowerCase());

    console.log('SOURCE', translations);

    this.checkRecognizedWord(translations);
  }

  checkRecognizedWord(translations) {
    const searchCard = [...this.elements.wordsContainer.children].find((card) => {
      let [cardWordText] = card.getElementsByClassName(this.classes.WORD);

      cardWordText = cardWordText.textContent.toLowerCase();

      return translations.find((translation) => cardWordText === translation);
    });

    if (searchCard) {
      const [word] = searchCard.getElementsByClassName(this.classes.WORD);
      const wordText = word.textContent;

      this.elements.translation.textContent = wordText;
      this.changeImage(searchCard);
      searchCard.style.pointerEvents = 'none';
      searchCard.style.backgroundColor = '#90ee90';
    } else {
      [this.elements.translation.textContent] = translations;
    }
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
    this.translateWord(target);
  }

  playSound(card) {
    const { audioPlayer } = this.elements;
    const audioSrc = card.dataset.audio.replace('files/', '');
    audioPlayer.src = `${this.baseUrl}${audioSrc}`;
    audioPlayer.play();
  }

  changeImage(card) {
    const { gallery } = this.elements;
    const imageSrc = card.dataset.image.replace('files/', '');
    gallery.src = `${this.baseUrl}${imageSrc}`;
  }

  async translateWord(card) {
    const [word] = card.getElementsByClassName(this.classes.WORD);

    const response = await getTranslation(word.textContent);
    let translation = '';

    if (response.code === 200) {
      [translation] = response.text;
    }

    this.elements.translation.textContent = translation;
  }
}

export default PageMain;
