import Swiper from 'swiper';
import SwiperMovieSlide from '../swiper-movie-slide/swiper-movie-slide';
import { performRequests } from '../../js/utils/perform-requests';
import { getMoviesList, getMovie } from '../../js/api/omdb-service';
import { isUndefined } from '../../js/utils/utils';

class SliderContainer {
  constructor(props) {
    this.props = props;
    this.parent = props.parent;
    this.classes = {
      ROOT: 'slider-container',
      SLIDER_PRELOADER: 'slider-container__preloader',
      SLIDE_PRELOADER: 'swiper-slide__preloader',
    };
    this.elements = {
      parentEl: props.parentEl,
    };
    this.data = {};
    this.swiper = null;
    this.speechRecognition = null;
  }

  async init() {
    this.render();

    // SpeechRecognition initialization
    const SpeechRecognition = window.webkitSpeechRecognition;

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.lang = 'ru-RU'; // en-US
    this.speechRecognition.maxAlternatives = 1;

    // Swiper initialization
    const { swiperOptions } = this.props;

    this.swiper = new Swiper('.swiper-container', swiperOptions);

    const { init: isSwiperInit } = swiperOptions;

    if (!isSwiperInit) {
      this.swiper.init();
    }

    this.initElements();
    // this.initData();
    this.initHandlers();

    await this.renderMoviesCards();
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    template.innerHTML = `
      <div class="slider-container">
        <!-- Slider main container -->
        <div class="swiper-container">
          <!-- Additional required wrapper -->
          <div class="swiper-wrapper">
              <!-- Slides -->
          </div>

          <!-- If we need navigation buttons -->
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>

        <!-- Slider preloader -->
        <div class="slider-container__preloader preloader">
          <div class="cssload-loader">
            <div class="cssload-inner cssload-one"></div>
            <div class="cssload-inner cssload-two"></div>
            <div class="cssload-inner cssload-three"></div>
          </div>
        </div>
      </div>
    `;

    this.elements.root = template.content.firstElementChild;

    fragment.append(template.content);
    this.elements.parentEl.append(fragment);
  }

  initElements() {
    const { root } = this.elements;
    const {
      SLIDER_PRELOADER,
    } = this.classes;
    const [sliderPreloader] = root.getElementsByClassName(SLIDER_PRELOADER);

    Object.assign(this.elements, {
      sliderPreloader,
    });
  }

  // async initData(defaultMovie = 'Bad Boys') {
  //   this.data.searchQuery = defaultMovie;

  //   await this.renderMoviesCards();
  // }

  initHandlers() {
    // const {
    //   searchField,
    //   // searchBox,
    //   searchButton, clearButton, keyboardButton, speechRecognitionButton,
    // } = this.elements;

    // searchField.addEventListener('input', this.handlerSearchInputChange.bind(this));
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

  async renderMoviesCards({ page = 1, removeSlides = false } = {}) {
    const isFirstPage = page === 1;
    const { sliderPreloader } = this.elements;
    const { search } = this.parent;
    const [responseMoviesList] = await performRequests({
      promises: [this.fetchMoviesList(search.getSearchQuery(), page)],
      setPreloader: isFirstPage,
      preloaderEl: sliderPreloader,
    });

    const { Response } = responseMoviesList;
    const isError = Response !== 'True';

    if (!isError) {
      // if moviesList is completely fetched with Response: 'True' then fetchEachMovie
      await performRequests({
        promises: this.fetchMovies(responseMoviesList),
        setPreloader: true,
        preloaderEl: sliderPreloader,
      });

      if (removeSlides) {
        this.swiper.removeAllSlides();
      }

      this.data.Movies.forEach(async ({
        Title: title, Year: year, Poster: poster, imdbID, Genre: genre, imdbRating,
      }) => {
        const swiperSlide = new SwiperMovieSlide({
          title, year, poster, imdbID, genre, imdbRating,
        });

        await swiperSlide.init();

        this.swiper.appendSlide(swiperSlide.elements.root);
      });
    }
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

    const { search: SearchModule } = this.parent;

    SearchModule.showMessage(isError ? processError() : `Showing results for "${search}"`);

    if (!isError) {
      const { Search, totalResults } = response;

      this.data.MoviesList = Search;

      if (isUndefined(this.data.totalResults)) {
        this.data.totalResults = totalResults;
      }

      if (isUndefined(this.data.lastPage)) {
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
    }

    return response;
  }
}

export default SliderContainer;
