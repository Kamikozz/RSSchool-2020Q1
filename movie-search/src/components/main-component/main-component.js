import SearchContainer from '../search-container/search-container';
import SliderContainer from '../slider-container/slider-container';

class MainComponent {
  constructor(props) {
    this.props = props;
    this.classes = {
      ROOT: 'main-content',
    };
    this.elements = {};
    this.data = {};
    this.slider = null;
    this.search = null;
  }

  init() {
    this.render();

    const searchContainer = new SearchContainer({
      parent: this,
      parentEl: this.elements.root.firstElementChild,
    });

    searchContainer.init();
    this.search = searchContainer;

    const sliderContainer = new SliderContainer({
      parent: this,
      parentEl: this.elements.root.firstElementChild,
      swiperOptions: {
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
      },
    });

    sliderContainer.init();
    this.slider = sliderContainer;
  }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    template.innerHTML = `
      <main class="main-content">
        <div class="wrapper"></div>
      </main>
    `;

    this.elements.root = template.content.firstElementChild;

    fragment.append(template.content);
    document.body.append(fragment);
  }
}

export default MainComponent;
