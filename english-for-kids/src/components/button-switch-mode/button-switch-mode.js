class ButtonSwitchMode {
  constructor() {
    this.classes = {
      HEADER_CONTAINER: 'header__container',
      SWITCH_BLOCK: 'button-switch-mode-block',
      SWITCH_BUTTON: 'button-switch-mode',
    };

    this.elements = {
      headerElem: document.getElementsByClassName(this.classes.HEADER_CONTAINER)[0],
    };

    this.initial();
  }

  initial() {
    // this.initData();
    this.render();
    this.initElements();
    // this.initHandlers();
  }

  // initData() {
  //   this.data = null;
  // }

  render() {
    const fragment = new DocumentFragment();
    const template = document.createElement('template');
    template.innerHTML = `
      <div class="button-switch-mode-block">
        <button class="button button-switch-mode button_theme_train">TRAIN</button>
      </div>
    `;
    fragment.append(template.content);

    this.rootEl = fragment.firstElementChild;
    this.elements.headerElem.append(this.rootEl);
  }

  initElements() {
    const switchBlock = this.rootEl;
    const switchButton = this.rootEl.firstElementChild;

    Object.assign(this.elements, {
      switchBlock,
      switchButton,
    });
  }

  // initHandlers() {
  //   this.elements.switchButton.addEventListener('click', this.handlerSwitchMode.bind(this));
  // }

  // handlerSwitchMode() {
  //   console.log('WTF', this);
  // }
}

export default ButtonSwitchMode;
