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
    this.isSpeechRecognitionStarted = null;
  }

  async init() {
    // SpeechRecognition initialization
    const SpeechRecognition = window.webkitSpeechRecognition;

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.lang = 'en-US'; // en-US
    this.speechRecognition.maxAlternatives = 1;
    this.speechRecognition.continuous = true;
    this.isSpeechRecognitionStarted = false;

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
      console.log('END RECOGNITION', this);
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

  startSpeechRecognition() {
    const { DISABLED_BUTTON_ICON } = this.classes;
    const { speechRecognitionButton } = this.elements;

    this.speechRecognition.start();

    speechRecognitionButton.firstElementChild.classList.add(DISABLED_BUTTON_ICON);
  }

  stopSpeechRecognition() {
    const { DISABLED_BUTTON_ICON } = this.classes;
    const { speechRecognitionButton } = this.elements;

    this.speechRecognition.stop();

    speechRecognitionButton.firstElementChild.classList.remove(DISABLED_BUTTON_ICON);
    speechRecognitionButton.blur();
  }

  toggleSpeechRecognition() {
    const { DISABLED_BUTTON_ICON } = this.classes;
    const { speechRecognitionButton } = this.elements;

    if (this.isSpeechRecognitionStarted) {
      this.speechRecognition.stop();

      speechRecognitionButton.firstElementChild.classList.remove(DISABLED_BUTTON_ICON);
      speechRecognitionButton.blur();
    } else {
      this.speechRecognition.start();

      speechRecognitionButton.firstElementChild.classList.add(DISABLED_BUTTON_ICON);
    }

    this.isSpeechRecognitionStarted = !this.isSpeechRecognitionStarted;
  }

  handlerSpeechRecognitionButton(event) {
    if (event) {
      event.preventDefault();
    }

    this.toggleSpeechRecognition();
  }

  speechRecognize(event) {
    const { resultIndex, results } = event;
    const [speechRecognitionResult] = results[resultIndex];
    let { transcript } = speechRecognitionResult;

    transcript = transcript.toLowerCase();

    console.log('SPEECH_RECOGNIZED: ', transcript);

    const CHANGE_LANGUAGE = 'change language';
    const SEARCH = 'search';
    const CHANGE_BACKGROUND = 'change background';
    const CHANGE_UNITS = 'change units';
    const WEATHER = 'weather';
    const FORECAST = 'forecast';
    const DECREASE_VOLUME = 'decrease volume';
    const INCREASE_VOLUME = 'increase volume';
    const STOP = 'stop';
    const grammar = [
      CHANGE_LANGUAGE, SEARCH, CHANGE_BACKGROUND, CHANGE_UNITS,
      WEATHER, FORECAST, DECREASE_VOLUME, INCREASE_VOLUME,
      STOP,
    ];

    const getCommand = (text, commands) => {
      const result = commands.find((command) => text.includes(command));

      return result;
    };
    const processString = (dirtyString, splitter) => dirtyString.split(splitter).join('').trim();
    const getCallback = {
      [CHANGE_LANGUAGE]: () => {
        console.log('CHANGE LANGUAGE handler!');
        const parsedString = processString(transcript, CHANGE_LANGUAGE);

        const mapper = [{
          language: 'be',
          options: ['belaruski', 'belarusian'],
        }, {
          language: 'ru',
          options: ['russian', 'to russian'],
        }, {
          language: 'en',
          options: ['english', 'to english'],
        }];

        const result = mapper.find((item) => {
          const { options } = item;
          const isThisLanguage = options.some((option) => option === parsedString);

          return isThisLanguage;
        });

        console.log(parsedString);

        if (result) {
          this.parent.changeLanguage(result.language);
        }
      },

      [SEARCH]: () => {
        console.log('SEARCH handler!');
        const { searchField } = this.elements;
        const parsedString = processString(transcript, SEARCH);

        searchField.value = parsedString;

        this.handlerSearchButton();
        this.handlerSearchInputChange();
      },

      [CHANGE_BACKGROUND]: () => {
        this.parent.changeBackgroundImage();
      },

      [CHANGE_UNITS]: () => {
        this.parent.changeUnits();
      },

      [FORECAST]: () => {
        this.parent.speechSynthesis.speakIt();
      },

      [WEATHER]: () => {
        this.parent.speechSynthesis.speakIt();
      },

      [DECREASE_VOLUME]: () => {
        this.parent.speechSynthesis.decreaseVolume();
      },

      [INCREASE_VOLUME]: () => {
        this.parent.speechSynthesis.increaseVolume();
      },

      [STOP]: () => {
        console.log('Shutting down the Speech Recognition');
        this.toggleSpeechRecognition();
      },
    };

    let callback = getCallback[getCommand(transcript, grammar)];

    if (!callback) {
      callback = () => {
        console.log('Default callback: ', transcript);
      };
    }

    callback();
  }
}

export default SearchContainer;
