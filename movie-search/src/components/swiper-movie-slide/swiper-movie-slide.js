import { getImage, getRatingColor, hasData } from '../../js/utils/utils';

class SwiperMovieSlide {
  constructor(props) {
    this.props = props;
    this.parent = props.parent;
    this.classes = {
      ROOT: 'swiper-slide',
      SLIDE_IMAGE: 'swiper-slide__img',
      SLIDE_IMAGE_LOADING: 'swiper-slide__img_loading',
      SLIDE_PRELOADER: 'swiper-slide__preloader',
      PRELOADER_LOADING: 'preloader_loading',
    };
    this.elements = {
      parentEl: props.parentEl,
    };
    this.data = {
      defaultPosterImage: '/assets/img/no-poster.png',
    };
  }

  async init() {
    await this.initData();
    this.render();
    this.initElements();
    this.initHandlers();
  }

  async initData() {
    const {
      title, year, poster, imdbID, genre, imdbRating,
    } = this.props;
    // get manually the image (to prevent 404 not found, and at least to set the default image)
    const { defaultPosterImage: noPoster } = this.data;
    const imageSrc = hasData(poster, 'N/A') ? await getImage(poster, noPoster) : noPoster;

    Object.assign(this.data, {
      title, year, imageSrc, imdbID, genre, imdbRating, ratingColor: getRatingColor(imdbRating),
    });
  }

  render() {
    // const fragment = new DocumentFragment();
    const template = document.createElement('template');

    const { ROOT } = this.classes;
    const {
      imdbID, title, imageSrc, year, genre, imdbRating, ratingColor,
    } = this.data;

    template.innerHTML = `
      <div class="${ROOT}">
        <a  class="swiper-slide__link"
            href="https://www.imdb.com/title/${imdbID}/videogallery/">${title}</a>
        <div class="swiper-slide__img-container">
          <img class="swiper-slide__img swiper-slide__img_loading" src="${imageSrc}">
        </div>
        ${hasData(year, 'N/A') ? `<p class="swiper-slide__movie-year">${year}</p>` : ''}
        ${hasData(genre, 'N/A') ? `<p class="swiper-slide__movie-genre">${genre}</p>` : ''}
        ${hasData(imdbRating, 'N/A') ? `<h2
          class="swiper-slide__movie-rating"
          style="border-bottom: 5px solid ${ratingColor}">${imdbRating}</h2>` : ''}
        <div class="swiper-slide__preloader preloader preloader_loading">
          <div class="cssload-loader">
            <div class="cssload-inner cssload-one"></div>
            <div class="cssload-inner cssload-two"></div>
            <div class="cssload-inner cssload-three"></div>
          </div>
        </div>
      </div>
    `;

    this.elements.root = template.content.firstElementChild;

    // fragment.append(template.content);
    // this.elements.parentEl.append(fragment);
  }

  initElements() {
    const { root } = this.elements;
    const {
      SLIDE_IMAGE,
      SLIDE_PRELOADER,
    } = this.classes;
    const [slideImage] = root.getElementsByClassName(SLIDE_IMAGE);
    const [preloader] = root.getElementsByClassName(SLIDE_PRELOADER);

    Object.assign(this.elements, {
      slideImage,
      preloader,
    });
  }

  initHandlers() {
    const { slideImage, preloader } = this.elements;
    const { PRELOADER_LOADING, SLIDE_IMAGE_LOADING } = this.classes;

    slideImage.onload = () => {
      preloader.classList.remove(PRELOADER_LOADING);
      preloader.ontransitionend = () => {
        preloader.remove();
        slideImage.classList.remove(SLIDE_IMAGE_LOADING);
      };
    };
  }
}

export default SwiperMovieSlide;
