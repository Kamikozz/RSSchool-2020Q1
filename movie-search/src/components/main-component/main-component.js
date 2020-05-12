import Swiper from 'swiper';
import Keyboard from '../../libs/keyboard/script';
import Draggable from '../../js/draggable';
import { performRequests } from '../../js/utils/perform-requests';
import { getMoviesList, getMovie } from '../../js/api/omdb-service';
import getTranslation from '../../js/api/yandex-translate-service';
import getBase64Data from '../../js/utils/get-base64';

class MainComponent {
  constructor(props) {
    this.props = props;
    this.classes = {
      ROOT: 'main-content',
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
      SLIDER_PRELOADER: 'slider-container__preloader',
      SLIDE_PRELOADER: 'swiper-slide__preloader',
      KEYBOARD: 'section-keyboard',
    };
    this.elements = {};
    this.data = {};
    this.speechRecognition = null;
  }

  init() {
    // Swiper initialization
    this.swiper = new Swiper('.swiper-container', {
      // Prevent initialize to delayed initialization
      init: false,

      // Slides Settings
      speed: 500,
      centerInsufficientSlides: true,
      slidesPerView: 1,
      spaceBetween: 20,

      // Responsive breakpoints
      breakpoints: {
        // when window width is >= 560px
        560: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        // when window width is >= 1020px
        1020: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        // when window width is >= 1440px
        1440: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },

      // Grab Cursor (improve PC usability)
      grabCursor: true,

      // Allow keyboard interactions
      keyboard: {
        enabled: true,
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
    this.swiper.init();
    // SpeechRecognition initialization
    const SpeechRecognition = window.webkitSpeechRecognition;

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.lang = 'ru-RU'; // en-US
    this.speechRecognition.maxAlternatives = 1;
    // this.render();
    this.initElements();
    this.initData();
    this.initHandlers();
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');
    const c = this.classes;

    template.innerHTML = `
      <footer class="${c.ROOT}">
        <div class="wrapper">
          <div class="${c.ROOT}__container">
            <div class="${c.ROOT}__content">
              <a class="${c.ROOT}__link" href="https://rs.school/" target="_blank">
                <div class="${c.RSS_LOGO_CONTAINER}">
                  <img  class="${c.ROOT}__image"
                        src="/assets/icons/logo-rss.bg.svg"
                        alt="background-logo-rolling-scopes-school">
                  <img  class="${c.ROOT}__image ${c.IMAGE_ACTIVE}"
                        src="/assets/icons/logo-rss.text.svg"
                        alt="text-logo-rolling-scopes-school">
                  <img  class="${c.ROOT}__image"
                        src="/assets/icons/logo-rss.front.svg"
                        alt="front-logo-rolling-scopes-school">
                </div>
              </a>
            </div>

            <p class="${c.ROOT}__copyright">&copy; 2020</p>

            <div class="${c.ROOT}__content">
              <a class="${c.ROOT}__link" href="https://github.com/Kamikozz/" target="_blank">
                <div class="${c.GITHUB_LOGO_CONTAINER}">
                  <svg class="${c.ROOT}__image" xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    `;

    this.elements.root = template.content.firstElementChild;

    fragment.append(template.content);
    document.body.append(fragment);
  }

  initElements() {
    const {
      ROOT,
      SEARCH_FIELD, SEARCH_BOX, SEARCH_INFO_MESSAGE,
      SEARCH_BUTTON, CLEAR_BUTTON, KEYBOARD_BUTTON, SPEECH_RECOGNITION_BUTTON,
      SLIDER_PRELOADER,
    } = this.classes;
    const [root] = document.getElementsByClassName(ROOT);
    const [searchField] = root.getElementsByClassName(SEARCH_FIELD);
    const [searchBox] = root.getElementsByClassName(SEARCH_BOX);
    const [searchButton] = root.getElementsByClassName(SEARCH_BUTTON);
    const [clearButton] = root.getElementsByClassName(CLEAR_BUTTON);
    const [keyboardButton] = root.getElementsByClassName(KEYBOARD_BUTTON);
    const [speechRecognitionButton] = root.getElementsByClassName(SPEECH_RECOGNITION_BUTTON);
    const [searchInfoMessage] = root.getElementsByClassName(SEARCH_INFO_MESSAGE);
    const [sliderPreloader] = root.getElementsByClassName(SLIDER_PRELOADER);

    Object.assign(this.elements, {
      root,
      searchField,
      searchBox,
      searchButton,
      clearButton,
      keyboardButton,
      speechRecognitionButton,
      searchInfoMessage,
      sliderPreloader,
    });
  }

  async initData(defaultMovie = 'Bad Boys') {
    this.data.searchQuery = defaultMovie;

    await this.renderMoviesCards();
  }

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
    // Swiper listeners
    this.swiper.on('reachEnd', async () => {
      const MAX_MOVIES_PER_PAGE = 10;
      const currentResults = this.data.lastPage * MAX_MOVIES_PER_PAGE;
      const hasMoreData = currentResults < this.data.totalResults;

      if (hasMoreData) {
        this.data.lastPage += 1;

        await this.renderMoviesCards({
          page: this.data.lastPage,
        });
      }
    });
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

      await this.renderMoviesCards({
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
    const [keyboard] = document.getElementsByClassName(KEYBOARD);

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

      const [newKeyboard] = document.getElementsByClassName(KEYBOARD);
      const draggableKeyboard = new Draggable(newKeyboard);

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

  async fetchMoviesList(search, page = 1) {
    const isFirstPage = page === 1;

    if (isFirstPage) {
      this.data.MoviesList = undefined;
      this.data.totalResults = undefined;
      this.data.lastPage = undefined;
    }

    const response = await getMoviesList({ search, page });
    const { Response, Error } = response;
    const isError = Response !== 'True';
    const processError = () => {
      const defaultNotFoundAPIMessage = 'Movie not found!';
      const processedErrorMessage = `No results for "${search}"`;

      return Error === defaultNotFoundAPIMessage ? processedErrorMessage : Error;
    };

    response.Error = processError(); // make 'Movie not found!' be like 'No results for ...'

    this.elements.searchInfoMessage.textContent = isError
      ? processError()
      : `Showing results for "${search}"`;

    if (!isError) {
      const { Search, totalResults } = response;

      this.data.MoviesList = Search;

      if (this.data.totalResults === undefined) {
        this.data.totalResults = totalResults;
      }

      if (this.data.lastPage === undefined) {
        this.data.lastPage = page;
      }
    }

    return response;
  }

  fetchMovies({ Search }) {
    this.data.Movies = undefined;

    const movies = [];

    Search.forEach(({ imdbID }) => {
      movies.push(this.fetchMovie(imdbID));
    });

    return movies;
  }

  async fetchMovie(movieId) {
    const response = await getMovie({ movieId });
    const { Response } = response;
    const isError = Response !== 'True';

    if (!isError) {
      const { Movies = [] } = this.data;

      this.data.Movies = [...Movies, response];

      return response;
    }

    return response;
  }

  async renderMoviesCards({ page = 1, removeSlides = false } = {}) {
    const isFirstPage = page === 1;
    const [responseMoviesList] = await performRequests({
      promises: [this.fetchMoviesList(this.data.searchQuery, page)],
      setPreloader: isFirstPage,
      preloaderEl: this.elements.sliderPreloader,
    });

    const { Response } = responseMoviesList;
    const isError = Response !== 'True';

    if (!isError) {
      // if moviesList is completely fetched with Response: 'True' then fetchEachMovie
      await performRequests({
        promises: this.fetchMovies(responseMoviesList),
        setPreloader: true,
        preloaderEl: this.elements.sliderPreloader,
      });

      if (removeSlides) {
        this.swiper.removeAllSlides();
      }

      const getRatingColor = (rating) => {
        const ratingNumber = Number(rating);
        const BAD = '#c70303';
        const NEUTRAL = '#5f5f5f';
        const GOOD = '#007b00';

        if (ratingNumber < 5) { return BAD; }
        if (ratingNumber < 7) { return NEUTRAL; }
        return GOOD;
      };
      const getImage = async (imageSrc, defaultSrc) => {
        const imageBase64 = await getBase64Data(imageSrc);

        return imageBase64 ? imageSrc : defaultSrc;
      };
      const renderSlide = async ({
        title, year, poster, imdbID, genre, imdbRating, ratingColor,
      }) => {
        const hasData = (data) => data !== 'N/A';
        const defaultNoPosterImage = '/assets/img/no-poster.png';
        // get manually the image (to prevent 404 not found, and at least to set the default image)
        const image = hasData(poster)
          ? await getImage(poster, defaultNoPosterImage)
          : defaultNoPosterImage;
        const swiperSlide = document.createElement('div');

        swiperSlide.classList.add('swiper-slide');
        swiperSlide.innerHTML = `
          <a
            class="swiper-slide__link"
            href="https://www.imdb.com/title/${imdbID}/videogallery/">${title}</a>
          <div class="swiper-slide__img-container">
            <img
              class="swiper-slide__img swiper-slide__img_loading"
              src="${image}">
          </div>
          ${hasData(year) ? `<p class="swiper-slide__movie-year">${year}</p>` : ''}
          ${hasData(genre) ? `<p class="swiper-slide__movie-genre">${genre}</p>` : ''}
          ${hasData(imdbRating) ? `<h2
            class="swiper-slide__movie-rating"
            style="border-bottom: 5px solid ${ratingColor}">${imdbRating}</h2>` : ''}
          <div class="swiper-slide__preloader preloader preloader_loading">
            <div class="cssload-loader">
              <div class="cssload-inner cssload-one"></div>
              <div class="cssload-inner cssload-two"></div>
              <div class="cssload-inner cssload-three"></div>
            </div>
          </div>
        `;

        return swiperSlide;
      };
      const preloadImage = (swiperSlideEl) => {
        const [swiperSlideImg] = swiperSlideEl.getElementsByClassName('swiper-slide__img');

        swiperSlideImg.onload = (event) => {
          const { path: [imgEl] } = event;
          const { parentElement: { parentElement: slide } } = imgEl;
          const { SLIDE_PRELOADER } = this.classes;
          const [preloader] = slide.getElementsByClassName(SLIDE_PRELOADER);

          preloader.classList.remove('preloader_loading');
          preloader.ontransitionend = () => {
            preloader.remove();
            imgEl.classList.remove('swiper-slide__img_loading');
          };
        };
      };

      this.data.Movies.forEach(async ({
        Title: title, Year: year, Poster: poster, imdbID, Genre: genre, imdbRating,
      }) => {
        const ratingColor = getRatingColor(imdbRating);
        const swiperSlide = await renderSlide({
          title, year, poster, imdbID, genre, imdbRating, ratingColor,
        });

        preloadImage(swiperSlide);
        this.swiper.appendSlide(swiperSlide);
      });
    }
  }
}

export default MainComponent;
