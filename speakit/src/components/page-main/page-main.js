class PageMain {
  constructor() {
    this.classes = {
      ROOT: 'page-main',
    };
    this.elements = {};
  }

  init() {
    this.render();
    this.initElements();
    this.initHandlers();
  }

  render() {
    // const c = this.classes;
    const fragment = new DocumentFragment();
    const template = document.createElement('template');

    template.innerHTML = `
      <div class="page-intro">
        <main class="page-intro__main change-colors">
          <div class="wrapper">
            <div class="page-intro__text-container">
              <h1 class="page-intro__app-name">SpeakIt</h1>
              <h2 class="page-intro__app-description">An application where you can listen to the pronunciation of English
                words and to check your pronunciation</h2>
              <p class="page-intro__app-how-to-use"><b class="page-intro__first-word">Click</b> on the words to hear their sound.</p>
              <p class="page-intro__app-how-to-use"><b class="page-intro__first-word">Click</b> on the button and say the words into the microphone.</p>
              <p class="page-intro__app-how-to-use"><b class="page-intro__first-word">Click</b> on the button below to get started.</p>
              <button class="page-intro__start-button change-colors">Yes, but speak what?</button>
            </div>
          </div>
        </main>
      </div>
    `;
    fragment.append(template.content);
    this.elements.root = fragment.firstElementChild;
    document.body.append(fragment);
  }

  initElements() {
    console.log(this);
  }

  initHandlers() {
    console.log(this);
  }
}

export default PageMain;
