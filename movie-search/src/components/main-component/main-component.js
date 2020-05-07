import { imdbApi } from '../credentials';

const getMoviesList = async ({ search, page = 1 }) => {
  const { baseUrl, apiKey } = imdbApi;
  const params = `apikey=${apiKey}&s=${search}&page=${page}`;
  const url = `${baseUrl}?${params}`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

const processMoviesList = (response) => {
  // Type can be: 'movie, series, episode, game'
  const movieSeriesEpisodeSelector = ({ Type }) => Type !== 'game';

  response.Search = response.Search.filter(movieSeriesEpisodeSelector);

  return response;
};

const getMovie = async ({ movieId }, plot = 'short') => {
  const { baseUrl, apiKey } = imdbApi;
  const params = `apikey=${apiKey}&i=${movieId}&plot=${plot}`;
  const url = `${baseUrl}?${params}`;
  const res = await fetch(url);
  const json = await res.json();

  return json;
};

const performRequests = async (promises) => {
  document.getElementById('swaggaboy').style.opacity = '0';

  const result = await Promise.all(promises);

  document.getElementById('swaggaboy').style.opacity = '1';

  return result;
};

class MainComponent {
  constructor(props) {
    this.props = props;
    this.classes = {
      ROOT: 'main-content',
      SEARCH_BOX: 'search-box',
      SEARCH_FIELD: 'search-box__search-field',
      SEARCH_BUTTON: 'search-button',
      CLEAR_BUTTON: 'clear-button',
      DISABLED_BUTTON: 'search-box__button_disabled',
      ACTIVE_BUTTON: 'search-box__button_active',
      HIDDEN_BUTTON: 'search-box__button_hidden',
      KEYBOARD_BUTTON: 'keyboard-button',
      SEARCH_INFO_MESSAGE: 'search-container__info-message',
    };
    this.elements = {};
    this.data = {};
  }

  init() {
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
      SEARCH_FIELD,
      SEARCH_BOX,
      SEARCH_BUTTON,
      CLEAR_BUTTON,
      KEYBOARD_BUTTON,
      SEARCH_INFO_MESSAGE,
    } = this.classes;
    const [root] = document.getElementsByClassName(ROOT);
    const [searchField] = root.getElementsByClassName(SEARCH_FIELD);
    const [searchBox] = root.getElementsByClassName(SEARCH_BOX);
    const [searchButton] = root.getElementsByClassName(SEARCH_BUTTON);
    const [clearButton] = root.getElementsByClassName(CLEAR_BUTTON);
    const [keyboardButton] = root.getElementsByClassName(KEYBOARD_BUTTON);
    const [searchInfoMessage] = root.getElementsByClassName(SEARCH_INFO_MESSAGE);

    // TODO: delete this in the future
    const element = document.createElement('img');

    element.src = '/assets/img/loading.gif';
    element.id = 'swaggaboy';
    document.body.append(element);

    Object.assign(this.elements, {
      root,
      searchField,
      searchBox,
      searchButton,
      clearButton,
      keyboardButton,
      searchInfoMessage,
    });
  }

  async initData(defaultMovie = 'Bad Boys') {
    const [responseMoviesList] = await performRequests([this.fetchMoviesList(defaultMovie)]);
    const { Response } = responseMoviesList;
    const isError = Response !== 'True';

    if (!isError) {
      // if moviesList is completely fetched with Response: 'True' then fetchEachMovie
      await performRequests(this.fetchMovies(responseMoviesList));
    }

    console.log(this.data, responseMoviesList);
  }

  initHandlers() {
    const {
      searchField,
      // searchBox,
      searchButton,
      clearButton,
      keyboardButton,
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
  }

  handlerSearchInputChange() {
    const {
      searchField,
      searchButton,
      clearButton,
    } = this.elements;
    const { DISABLED_BUTTON, ACTIVE_BUTTON, HIDDEN_BUTTON } = this.classes;
    const isEmptyField = searchField && !searchField.value.length;

    if (isEmptyField) {
      searchButton.classList.remove(ACTIVE_BUTTON);
      searchButton.classList.add(DISABLED_BUTTON);
      clearButton.classList.add(HIDDEN_BUTTON);
    } else {
      searchButton.classList.add(ACTIVE_BUTTON);
      searchButton.classList.remove(DISABLED_BUTTON);
      clearButton.classList.remove(HIDDEN_BUTTON);

      console.log('you entered something');
    }
  }

  async handlerSearchButton(event) {
    if (event) {
      event.preventDefault();
    }

    console.log('Search Button');

    const { searchField } = this.elements;
    const isEmptyField = searchField && !searchField.value.length;

    if (!isEmptyField) {
      const [responseMoviesList] = await performRequests([this.fetchMoviesList(searchField.value)]);
      const { Response } = responseMoviesList;
      const isError = Response !== 'True';

      if (!isError) {
        // if moviesList is completely fetched with Response: 'True' then fetchEachMovie
        await performRequests(this.fetchMovies(responseMoviesList));
      }

      console.log(this.data, responseMoviesList);
    }
  }

  handlerClearInputButton(event) {
    if (event) {
      event.preventDefault();
    }

    console.log('Clear Input Button');

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

    console.log('Keyboard initialized', this);
  }

  async fetchMoviesList(search, page = 1) {
    console.log('Fetch movies!');

    const isFirstPage = page === 1;

    if (isFirstPage) {
      this.data.MoviesList = undefined;
      this.data.totalResults = undefined;
      this.data.lastPage = undefined;
    }

    const response = await getMoviesList({ search, page });

    console.log('@getMoviesList', response);

    const { Response, Error } = response;
    const isError = Response !== 'True';

    this.elements.searchInfoMessage.textContent = isError ? Error : '';

    if (!isError) {
      const processedResponse = processMoviesList(response); // exclude type: 'game'
      const { Search, totalResults } = processedResponse;
      const { MoviesList = [] } = this.data;

      this.data.MoviesList = MoviesList.concat(Search);
      this.elements.searchInfoMessage.textContent = this.data.MoviesList.length;

      if (this.data.totalResults === undefined) {
        this.data.totalResults = totalResults;
      }

      if (this.data.lastPage === undefined) {
        this.data.lastPage = page;
      }

      return processedResponse;
    }

    return response;
  }

  fetchMovies({ Search }) {
    const isFirstPage = this.data.lastPage === 1;

    if (isFirstPage) {
      this.data.Movies = undefined;
    }

    const arr = [];

    Search.forEach(({ imdbID }) => {
      arr.push(this.fetchMovie(imdbID));
    });

    return arr;
  }

  async fetchMovie(movieId) {
    const response = await getMovie({ movieId });

    console.log('@getMovie', response);

    const { Response } = response;
    const isError = Response !== 'True';

    if (!isError) {
      const { Movies = [] } = this.data;

      this.data.Movies = [...Movies, response];

      return response;
    }

    return response;
  }
}

export default MainComponent;
