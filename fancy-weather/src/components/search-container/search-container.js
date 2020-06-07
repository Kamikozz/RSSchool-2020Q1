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
      DISABLED_BUTTON_ICON: 'search-box__icon_disabled',
      ACTIVE_BUTTON: 'search-box__button_active',
      HIDDEN_BUTTON: 'search-box__button_hidden',
    };
    this.elements = {};
    this.data = {
      searchQuery: '',
    };
    this.speechRecognition = null;
  }

  async init() {
    // SpeechRecognition initialization
    const SpeechRecognition = window.webkitSpeechRecognition;

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.lang = 'ru-RU'; // en-US
    this.speechRecognition.maxAlternatives = 1;

    this.initElements();
    this.initHandlers();
  }

  initElements() {
    const {
      ROOT,
      SEARCH_FIELD, SEARCH_BOX,
      SEARCH_BUTTON, CLEAR_BUTTON, SPEECH_RECOGNITION_BUTTON,
    } = this.classes;
    const [root] = document.getElementsByClassName(ROOT);
    const [searchField] = root.getElementsByClassName(SEARCH_FIELD);
    const [searchBox] = root.getElementsByClassName(SEARCH_BOX);
    const [searchButton] = root.getElementsByClassName(SEARCH_BUTTON);
    const [clearButton] = root.getElementsByClassName(CLEAR_BUTTON);
    const [speechRecognitionButton] = root.getElementsByClassName(SPEECH_RECOGNITION_BUTTON);

    this.elements = {
      ...this.elements,
      root,
      searchField,
      searchBox,
      searchButton,
      clearButton,
      speechRecognitionButton,
    };
  }

  initHandlers() {
    const {
      searchField,
      searchButton, clearButton, speechRecognitionButton,
    } = this.elements;

    searchField.focus(); // trigger focus on component load

    searchField.addEventListener('input', this.handlerSearchInputChange.bind(this));
    searchButton.addEventListener('click', this.handlerSearchButton.bind(this));
    clearButton.addEventListener('click', this.handlerClearInputButton.bind(this));
    searchField.addEventListener('keydown', (event) => {
      const isEnter = event.key === 'Enter';

      if (isEnter) {
        event.preventDefault();
      }
    });
    searchField.addEventListener('keyup', (event) => {
      const isEnter = event.key === 'Enter';

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
      const { DISABLED_BUTTON_ICON } = this.classes;

      speechRecognitionButton.removeAttribute('disabled');
      speechRecognitionButton.firstElementChild.classList.remove(DISABLED_BUTTON_ICON);
    });
  }

  getSearchQuery() {
    return this.data.searchQuery;
  }

  handlerSearchInputChange() {
    const { searchField, searchButton, clearButton } = this.elements;
    const { DISABLED_BUTTON, ACTIVE_BUTTON, HIDDEN_BUTTON } = this.classes;
    const isEmptyField = searchField && !searchField.value.length;

    const disableButton = (button) => {
      button.setAttribute('disabled', '');
      button.classList.remove(ACTIVE_BUTTON);
      button.classList.add(DISABLED_BUTTON);
    };
    const activateButton = (button) => {
      button.removeAttribute('disabled');
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
      const searchValue = searchField.value;

      this.data.searchQuery = searchValue;

      await this.parent.map.searchCity(searchValue, this.parent.i18n.currentLanguage);
      this.parent.forecast.updateCity(this.parent.map.city);
      await this.parent.forecast.getForecast();
      await this.parent.changeBackgroundImage();
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

  handlerSpeechRecognitionButton(event) {
    if (event) {
      event.preventDefault();
    }

    this.speechRecognition.start();

    const { speechRecognitionButton } = this.elements;
    const { DISABLED_BUTTON_ICON } = this.classes;

    speechRecognitionButton.setAttribute('disabled', '');
    speechRecognitionButton.firstElementChild.classList.add(DISABLED_BUTTON_ICON);
  }

  speechRecognize(event) {
    console.log(event);
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
