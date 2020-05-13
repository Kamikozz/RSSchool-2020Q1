import MainComponent from './main-component/main-component';
import Footer from './footer/footer';

const swiperOptions = {
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
};

const main = new MainComponent({
  swiperOptions,
});
const footer = new Footer();

main.init();
footer.init();
