import PageMain from '../page-main/page-main';
import loader from '../../js/loader';

class PageIntro {
  constructor(rootClassName) {
    this.elements = {};
    this.classes = {
      ROOT: rootClassName,
      START_BUTTON: 'page-intro__start-button',
    };
  }

  init() {
    this.initElements();
    this.initHandlers();
  }

  initElements() {
    const [root] = document.getElementsByClassName(this.classes.ROOT);
    const [startButton] = root.getElementsByClassName(this.classes.START_BUTTON);

    Object.assign(this.elements, {
      root,
      startButton,
    });
  }

  initHandlers() {
    this.elements.startButton.addEventListener('click', this.handlerStartButton.bind(this));
  }

  handlerStartButton() {
    this.elements.root.remove();

    loader.toggleLoader();

    const pageMain = new PageMain({
      page: 0,
    });
    pageMain.init();
  }
}

export default PageIntro;
