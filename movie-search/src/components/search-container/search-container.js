import Keyboard from '../../libs/keyboard/script';
import Draggable from '../../js/draggable';
import getTranslation from '../../js/api/yandex-translate-service';

class SearchContainer {
  constructor(props) {
    this.props = props;
    this.parent = props.parent;
    this.classes = {
      ROOT: 'search-container',
      SEARCH_BOX: 'search-box',
      SEARCH_FIELD: 'search-box__search-field',
      SEARCH_BUTTON: 'search-button',
      CLEAR_BUTTON: 'clear-button',
      SPEECH_RECOGNITION_BUTTON: 'speech-recognition-button',
      DISABLED_BUTTON: 'search-box__button_disabled',
      ACTIVE_BUTTON: 'search-box__button_active',
      HIDDEN_BUTTON: 'search-box__button_hidden',
      KEYBOARD_BUTTON: 'keyboard-button',
      SEARCH_INFO_MESSAGE: 'search-container__info-message',
      KEYBOARD: 'section-keyboard',
    };
    this.elements = {
      parentEl: props.parentEl,
    };
    this.data = {
      searchQuery: 'Bad Boys',
    };
    this.speechRecognition = null;
  }

  async init() {
    // SpeechRecognition initialization
    const SpeechRecognition = window.webkitSpeechRecognition;

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.lang = 'ru-RU'; // en-US
    this.speechRecognition.maxAlternatives = 1;

    this.render();
    this.initElements();
    // this.initData();
    this.initHandlers();
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    template.innerHTML = `
      <div class="search-container">
        <form class="search-box search-container__search-box" role="search" aria-label="Search the movie in the internet">
          <fieldset class="search-box__fieldset">
            <input class="search-box__search-field" type="text" placeholder="Type your movie here (eg. 'Scarface')" name="search-field" autocomplete="off" maxlength="150">
          </fieldset>

          <button class="search-box__button clear-button search-box__button_hidden" aria-label="To clear the search input">
            <svg class="icon search-box__icon" height="16" width="16" viewBox="0 0 14 14"><polygon points="14,0.7 13.3,0 7,6.3 0.7,0 0,0.7 6.3,7 0,13.3 0.7,14 7,7.7 13.3,14 14,13.3 7.7,7"/></svg>
          </button>

          <button class="search-box__button speech-recognition-button" aria-label="To search the movie by your recognized speech">
            <svg class="icon search-box__icon" xmlns="http://www.w3.org/2000/svg"
              width="24" height="24" viewBox="0 0 18 18">
              <path d="M9 11.25c1.242 0 2.25-1.008 2.25-2.25v-3.938c0-1.242-1.008-2.25-2.25-2.25s-2.25 1.008-2.25 2.25v3.938c0 1.242 1.008 2.25 2.25 2.25zm4.5-2.25h-1.125c0 .848-.32 1.668-.898 2.289-.637.691-1.535 1.086-2.477 1.086-.941 0-1.84-.395-2.477-1.082-.578-.625-.898-1.441-.898-2.293h-1.125c0 1.137.426 2.223 1.195 3.055.723.777 1.691 1.273 2.742 1.406v1.727h1.125v-1.727c1.051-.133 2.02-.629 2.742-1.406.77-.832 1.195-1.922 1.195-3.055zm0 0" fill-rule="evenodd"/>
            </svg>

          </button>

          <button class="search-box__button keyboard-button" aria-label="To open/close virtual keyboard">
            <svg class="icon search-box__icon" width="27" height="12" viewBox="0 0 27 12"><path fill-rule='evenodd' clip-rule='evenodd' d='M25.693 0h-24.153c-1.104 0-1.527.422-1.527 1.527v8.961c0 1.105.423 1.527 1.527 1.527h24.153c1.104 0 1.307-.422 1.307-1.527v-8.961c0-1.105-.202-1.527-1.307-1.527zm-2.672 2.061h1.935v1.934h-1.935v-1.934zm-6 0h1.935v1.934h-1.935v-1.934zm2.935 3v1.934h-1.935v-1.934h1.935zm-5.935-3h1.935v1.934h-1.935v-1.934zm2.935 3v1.934h-1.935v-1.934h1.935zm-5.935-3h1.935v1.934h-1.935v-1.934zm2.935 3v1.934h-1.935v-1.934h1.935zm-5.935-3h1.935v1.934h-1.935v-1.934zm2.935 3v1.934h-1.935v-1.934h1.935zm-5.935-3h1.935v1.934h-1.935v-1.934zm-3 0h1.935v1.934h-1.935v-1.934zm0 3h2.994v1.934h-2.994v-1.934zm3.95 4.933h-3.978v-1.933h3.978v1.933zm.05-4.933h1.935v1.934h-1.935v-1.934zm13.95 4.933h-12.963v-1.933h12.963v1.933zm.05-7.933h1.935v1.934h-1.935v-1.934zm4.95 7.933h-3.978v-1.933h3.978v1.933zm.029-2.999h-3.979v-1.934h3.979v1.934z'/></svg>
          </button>

          <button class="search-box__button search-button search-box__button_disabled" type="submit" aria-label="To search the movie in the internet">
            <svg class="icon search-box__icon" height="16" width="16" viewBox="0 0 16 16" version="1.1"><path fill-rule="evenodd" d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0013 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 000-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"></path></svg>
          </button>

        </form>
        <p class="search-container__info-message"></p>
      </div>
    `;

    this.elements.root = template.content.firstElementChild;

    fragment.append(template.content);
    this.elements.parentEl.append(fragment);
  }

  initElements() {
    const { root } = this.elements;
    const {
      SEARCH_FIELD, SEARCH_BOX, SEARCH_INFO_MESSAGE,
      SEARCH_BUTTON, CLEAR_BUTTON, KEYBOARD_BUTTON, SPEECH_RECOGNITION_BUTTON,
    } = this.classes;
    const [searchField] = root.getElementsByClassName(SEARCH_FIELD);
    const [searchBox] = root.getElementsByClassName(SEARCH_BOX);
    const [searchButton] = root.getElementsByClassName(SEARCH_BUTTON);
    const [clearButton] = root.getElementsByClassName(CLEAR_BUTTON);
    const [keyboardButton] = root.getElementsByClassName(KEYBOARD_BUTTON);
    const [speechRecognitionButton] = root.getElementsByClassName(SPEECH_RECOGNITION_BUTTON);
    const [searchInfoMessage] = root.getElementsByClassName(SEARCH_INFO_MESSAGE);

    Object.assign(this.elements, {
      searchField,
      searchBox,
      searchButton,
      searchInfoMessage,
      clearButton,
      keyboardButton,
      speechRecognitionButton,
    });
  }

  // async initData(defaultMovie = 'Bad Boys') {
  //   this.data.searchQuery = defaultMovie;

  //   const { slider } = this.parent;

  //   await slider.renderMoviesCards();
  // }

  initHandlers() {
    const {
      searchField,
      // searchBox,
      searchButton, clearButton, keyboardButton, speechRecognitionButton,
    } = this.elements;

    searchField.focus(); // trigger focus on component load

    searchField.addEventListener('input', this.handlerSearchInputChange.bind(this));
    searchButton.addEventListener('click', this.handlerSearchButton.bind(this));
    clearButton.addEventListener('click', this.handlerClearInputButton.bind(this));
    keyboardButton.addEventListener('click', this.handlerKeyboardButton.bind(this));
    searchField.addEventListener('keydown', (event) => {
      const isEnter = event.code === 'Enter';

      if (isEnter) {
        event.preventDefault();
      }
    });
    searchField.addEventListener('keyup', (event) => {
      const isEnter = event.code === 'Enter';

      if (isEnter) {
        this.handlerSearchButton();
      }
    });
    // Speech Recognition Listeners
    speechRecognitionButton.addEventListener(
      'click', this.handlerSpeechRecognitionButton.bind(this),
    );
    this.speechRecognition.addEventListener('result', this.speechRecognize.bind(this));
    this.speechRecognition.addEventListener('end', () => {
      const { DISABLED_BUTTON } = this.classes;

      speechRecognitionButton.classList.remove(DISABLED_BUTTON);
    });
  }

  showMessage(message) {
    const { searchInfoMessage } = this.elements;

    searchInfoMessage.textContent = message;
  }

  getSearchQuery() {
    return this.data.searchQuery;
  }

  handlerSearchInputChange() {
    const { searchField, searchButton, clearButton } = this.elements;
    const { DISABLED_BUTTON, ACTIVE_BUTTON, HIDDEN_BUTTON } = this.classes;
    const isEmptyField = searchField && !searchField.value.length;

    const disableButton = (button) => {
      button.classList.remove(ACTIVE_BUTTON);
      button.classList.add(DISABLED_BUTTON);
    };
    const activateButton = (button) => {
      button.classList.add(ACTIVE_BUTTON);
      button.classList.remove(DISABLED_BUTTON);
    };

    if (isEmptyField) {
      disableButton(searchButton);
      clearButton.classList.add(HIDDEN_BUTTON);
    } else {
      activateButton(searchButton);
      clearButton.classList.remove(HIDDEN_BUTTON);
    }
  }

  async handlerSearchButton(event) {
    if (event) {
      event.preventDefault();
    }

    const { searchField } = this.elements;
    const isEmptyField = searchField && !searchField.value.length;

    if (!isEmptyField) {
      const { text: [translatedSentence] } = await getTranslation(searchField.value);
      this.data.searchQuery = translatedSentence;

      const { slider } = this.parent;

      await slider.renderMoviesCards({
        page: 1,
        removeSlides: true,
      });
    }
  }

  handlerClearInputButton(event) {
    if (event) {
      event.preventDefault();
    }

    const { searchField } = this.elements;
    const isExistOrNotEmpty = searchField && searchField.value;

    if (isExistOrNotEmpty) {
      searchField.value = '';

      this.handlerSearchInputChange();
    }
  }

  handlerKeyboardButton(event) {
    if (event) {
      event.preventDefault();
    }

    const { KEYBOARD } = this.classes;
    const { keyboard } = this.elements;

    if (keyboard) {
      const isHidden = keyboard.style.display === 'none';

      keyboard.style.display = isHidden ? 'block' : 'none';
    } else {
      Keyboard({
        inputClassName: 'search-box__search-field',
      });

      const key = document.querySelector('.key[data-keycode="Enter"]');

      key.addEventListener('mouseup', () => {
        this.handlerSearchButton();
      });

      [this.elements.keyboard] = document.getElementsByClassName(KEYBOARD);

      const draggableKeyboard = new Draggable(this.elements.keyboard);

      draggableKeyboard.init();
    }
  }

  handlerSpeechRecognitionButton(event) {
    if (event) {
      event.preventDefault();
    }

    this.speechRecognition.start();

    const { speechRecognitionButton } = this.elements;
    const { DISABLED_BUTTON } = this.classes;

    speechRecognitionButton.classList.add(DISABLED_BUTTON);
  }

  speechRecognize(event) {
    const [translationAlternatives] = [...event.results];
    const [translations] = [...translationAlternatives]
      .map(({ transcript }) => transcript.toLowerCase());
    const { searchField } = this.elements;

    searchField.value = translations;

    this.handlerSearchButton();
    this.handlerSearchInputChange();
  }
}

export default SearchContainer;
