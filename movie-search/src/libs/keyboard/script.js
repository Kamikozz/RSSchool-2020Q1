const Keyboard = ({ inputClassName }) => {
  const variables = {
    specialKeys: {
      ESC: 'Esc',
      F1: 'F1',
      F2: 'F2',
      F3: 'F3',
      F4: 'F4',
      F5: 'F5',
      F6: 'F6',
      F7: 'F7',
      F8: 'F8',
      F9: 'F9',
      F10: 'F10',
      F11: 'F11',
      F12: 'F12',
      PRINT_SCREEN: 'Prtscr',
      SCROLL_LOCK: 'Scroll lock',
      PAUSE: 'Pause',
      INSERT: 'Insert',
      DELETE: 'Delete',
      PAGE_UP: 'Pgup',
      PAGE_DOWN: 'Pgdn',
      BACKSPACE: 'Backspace',
      NUM_LOCK: 'Num lock',
      TAB: 'Tab',
      CAPS_LOCK: 'Caps lock',
      ENTER: 'Enter',
      SHIFT: 'Shift',
      ARROW_UP: '↑',
      CTRL: 'Ctrl',
      FN: 'LANG',
      ALT: 'Alt',
      SPACE: '- -',
      ALTGR: 'Altgr',
      META: '',
      ARROW_LEFT: '←',
      ARROW_DOWN: '↓',
      ARROW_RIGHT: '→',
    },
    keys: null,
    mousedownFiredEvent: null, // store event object if mousedown fired at 'key' class
    isCapslock: false,
    isShift: false,
    languages: {
      EN: 'english',
      RU: 'русский',
    },
    KEYBOARD_LANGUAGE: 'keyboardLanguage',
    DATA_KEYCODE: 'keycode',
  };

  const {
    ESC, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, PRINT_SCREEN, SCROLL_LOCK, PAUSE,
    INSERT, DELETE, PAGE_UP, PAGE_DOWN, BACKSPACE, NUM_LOCK, TAB, CAPS_LOCK, ENTER, SHIFT,
    ARROW_UP, CTRL, FN, ALT, SPACE, ALTGR, META, ARROW_LEFT, ARROW_DOWN, ARROW_RIGHT,
  } = variables.specialKeys;

  variables.keys = {
    'row-k': [ESC, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, PRINT_SCREEN, SCROLL_LOCK, PAUSE, INSERT, DELETE, PAGE_UP, PAGE_DOWN],
    'row-e': ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', BACKSPACE,
      NUM_LOCK, '/', '*', '-'],
    'row-d': [TAB, 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
      '7', '8', '9', '+'],
    'row-c': [CAPS_LOCK, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', ENTER,
      '4', '5', '6'],
    'row-b': [SHIFT, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', SHIFT, ARROW_UP,
      '1', '2', '3', ENTER],
    'row-a': [CTRL, FN, ALT, SPACE, '<', ALTGR, META, CTRL, ARROW_LEFT, ARROW_DOWN,
      ARROW_RIGHT, '0', '.'],
  };

  variables.structureKeyCodes = {
    'row-k': ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
      'PrintScreen', 'ScrollLock', 'Pause', 'Insert', 'Delete', 'PageUp', 'PageDown'],
    'row-e': ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7',
      'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace', 'NumLock', 'NumpadDivide',
      'NumpadMultiply', 'NumpadSubtract'],
    'row-d': ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP',
      'BracketLeft', 'BracketRight', 'Backslash', 'Numpad7', 'Numpad8', 'Numpad9', 'NumpadAdd'],
    'row-c': ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL',
      'Semicolon', 'Quote', 'Enter', 'Numpad4', 'Numpad5', 'Numpad6'],
    'row-b': ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period',
      'Slash', 'ShiftRight', 'ArrowUp', 'Numpad1', 'Numpad2', 'Numpad3', 'NumpadEnter'],
    'row-a': ['ControlLeft', 'Fn', 'AltLeft', 'Space', 'IntlBackslash', 'AltRight', 'MetaLeft',
      'ControlRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'Numpad0', 'NumpadDecimal'],
  };

  variables.shiftCodes = [
    'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6',
    'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal',
    'BracketLeft', 'BracketRight', 'Backslash',
    'Semicolon', 'Quote',
    'Comma', 'Period', 'Slash',
    'IntlBackslash', 'NumpadDecimal',
  ];

  const { EN, RU } = variables.languages;

  variables.keyCodes = {
    [EN]: {
      Backquote: ['`', '~'],
      Digit1: ['1', '!'],
      Digit2: ['2', '@'],
      Digit3: ['3', '#'],
      Digit4: ['4', '$'],
      Digit5: ['5', '%'],
      Digit6: ['6', '^'],
      Digit7: ['7', '&'],
      Digit8: ['8', '*'],
      Digit9: ['9', '('],
      Digit0: ['0', ')'],
      Minus: ['-', '_'],
      Equal: ['=', '+'],
      BracketLeft: ['[', '{'],
      BracketRight: [']', '}'],
      Backslash: ['\\', '|'],
      Semicolon: [';', ':'],
      Quote: ['\'', '"'],
      Comma: [',', '<'],
      Period: ['.', '>'],
      Slash: ['/', '?'],
      IntlBackslash: ['\\', '|'],
      NumpadDecimal: ['.', '.'],
    },
    [RU]: {
      Backquote: ['ё', 'Ё'],
      Digit1: ['1', '!'],
      Digit2: ['2', '"'],
      Digit3: ['3', '№'],
      Digit4: ['4', ';'],
      Digit5: ['5', '%'],
      Digit6: ['6', ':'],
      Digit7: ['7', '?'],
      Digit8: ['8', '*'],
      Digit9: ['9', '('],
      Digit0: ['0', ')'],
      Minus: ['-', '_'],
      Equal: ['=', '+'],
      BracketLeft: ['х', 'Х'],
      BracketRight: ['ъ', 'Ъ'],
      Backslash: ['\\', '/'],
      Semicolon: ['ж', 'Ж'],
      Quote: ['э', 'Э'],
      Comma: ['б', 'Б'],
      Period: ['ю', 'Ю'],
      Slash: ['.', ','],
      IntlBackslash: ['\\', '/'],
      NumpadDecimal: [',', ','],
    },
  };

  const classes = {
    TEXTAREA: 'textarea',
    KEY: 'key',
    KEYBOARD: 'keyboard',
    KEY_ACTIVE: 'key-active',
    KEY_UPPERCASE: 'key-uppercase',
    ICON: 'icon',
    META_WIN: 'icon-windows-logo',
    META_APPLE: 'icon-apple-logo',
    META_WIN_ACTIVE: 'icon-windows-logo-active',
    META_APPLE_ACTIVE: 'icon-apple-logo-active',
    HIDDEN: 'hidden',
  };

  const getSymbolsArray = (alphabet) => []
    .concat(Object.keys(alphabet), Object.values(alphabet))
    .filter((val) => {
      const symbols = ['`', '[', ']', ';', '\'', ',', '.', '/'];
      const isPresent = symbols.every((item) => item !== val);

      return isPresent;
    });

  function getAlphabet(language) {
    const languageEnglishRussian = {
      '`': 'ё',
      q: 'й',
      w: 'ц',
      e: 'у',
      r: 'к',
      t: 'е',
      y: 'н',
      u: 'г',
      i: 'ш',
      o: 'щ',
      p: 'з',
      '[': 'х',
      ']': 'ъ',
      a: 'ф',
      s: 'ы',
      d: 'в',
      f: 'а',
      g: 'п',
      h: 'р',
      j: 'о',
      k: 'л',
      l: 'д',
      ';': 'ж',
      '\'': 'э',
      z: 'я',
      x: 'ч',
      c: 'с',
      v: 'м',
      b: 'и',
      n: 'т',
      m: 'ь',
      ',': 'б',
      '.': 'ю',
      '/': '.',
    };

    const numpadEnglishRussian = {
      '.': ',',
    };

    switch (language) {
      case EN: {
        variables.layout = getSymbolsArray(languageEnglishRussian);
        return [languageEnglishRussian, numpadEnglishRussian];
      }
      case RU: {
        const languageRussianEnglish = {};

        Object.keys(languageEnglishRussian).forEach((key) => {
          // languageEnglishRussian[key] = value -> langRusEng[value] = key;
          languageRussianEnglish[languageEnglishRussian[key]] = key;
        });

        const numpadRussianEnglish = {};

        Object.keys(numpadEnglishRussian).forEach((key) => {
          // languageEnglishRussian[key] = value -> langRusEng[value] = key;
          numpadRussianEnglish[numpadEnglishRussian[key]] = key;
        });

        variables.layout = getSymbolsArray(languageRussianEnglish);
        return [languageRussianEnglish, numpadRussianEnglish];
      }
      default: {
        variables.layout = getSymbolsArray(languageEnglishRussian);
        return [languageEnglishRussian, numpadEnglishRussian];
      }
    }
  }

  /**
   * Gives 2 objects and optional keyClassName, gets all of the HTMLElements
   * with the given keyClassName and changes their innerText
   * according to alphabet & numpad.
   * @param {Object} alphabet map with key/value of the main keys on keyboard
   * @param {Object} numpad map with key/value of the numpad keys on keyboard
   * @param {string} keyClassName string with the name of the class of keys
   */
  function changeKeysInnerText(alphabet, numpad, keyClassName = classes.KEY) {
    // change symbols from english to russian, and backwards
    const numpadKeys = Object.keys(numpad);
    const numpadLength = numpadKeys ? numpadKeys.length : 0;

    // get array of keys with keyClassName
    const keys = [...document.getElementsByClassName(keyClassName)]
      .map((node) => node.firstElementChild);

    // change innerText to all of the elements (except numpad)
    const DELETE_ME = 1;

    for (let i = 0; i < keys.length - numpadLength - DELETE_ME; i += 1) {
      const translatedLetter = alphabet[keys[i].innerText.toLowerCase()];

      if (translatedLetter) keys[i].innerText = translatedLetter;
    }

    // change numpad elements innerText
    for (let i = keys.length - numpadLength; i < keys.length; i += 1) {
      const translatedLetter = numpad[keys[i]];

      if (translatedLetter) keys[i].innerText = translatedLetter;
    }
  }

  const isPlatformWindows = () => navigator.platform.toLowerCase().includes('win');
  const isUppercase = () => variables.isShift !== variables.isCapslock; // XOR

  const createSection = (className) => {
    const section = document.createElement('section');

    if (className) {
      section.className = className;
    }

    const wrapper = document.createElement('div');

    wrapper.className = 'wrapper';
    section.append(wrapper);

    return section.firstElementChild;
  };

  const createKeyboard = () => {
    const keyboard = document.createElement('div');
    const { KEYBOARD, HIDDEN } = classes;

    keyboard.className = KEYBOARD;
    keyboard.setAttribute(HIDDEN, 'true');

    return keyboard;
  };

  function createTree() {
    const [textarea] = document.getElementsByClassName(inputClassName);
    const sectionKeyboard = createSection('section-keyboard');
    const keyboard = createKeyboard();

    const note = document.createElement('div');

    note.classList.add('section-keyboard__note');

    const textDeveloped = document.createElement('p');
    const textSwitchKeyboardLayout = document.createElement('p');
    const textDraggableMessage = document.createElement('p');

    textDeveloped.textContent = 'Developed on Microsoft© Windows.';
    textSwitchKeyboardLayout
      .textContent = 'CTRL + SHIFT; CTRL + ALT; SHIFT + ALT to switch keyboard layout.';
    textDraggableMessage.textContent = '- also you can drag this keyboard anywhere you want -';
    note.append(textDeveloped);
    note.append(textSwitchKeyboardLayout);
    note.append(textDraggableMessage);

    sectionKeyboard.append(keyboard);
    sectionKeyboard.append(note);

    const returnObject = {
      textarea,
      keys: [],
      'row-k': null,
      'row-e': null,
      'row-d': null,
      'row-c': null,
      'row-b': null,
      'row-a': null,
      keyboard,
    };

    const { keys, structureKeyCodes } = variables;
    const rows = Object.keys(keys);

    rows.forEach((rowClass) => {
      const row = document.createElement('div');

      row.classList.add(rowClass);

      keys[rowClass].forEach((text, i) => {
        const span = document.createElement('span');

        span.textContent = text;

        const key = document.createElement('div');
        const { KEY } = classes;

        key.classList.add(KEY);
        key.dataset.keycode = structureKeyCodes[rowClass][i];
        key.append(span);
        row.append(key);

        returnObject.keys.push(key); // get array of keys 'key'
      });

      keyboard.append(row);
      returnObject[rowClass] = row;
    });

    // apply icon & icon-windows-logo or icon-apple-logo
    const keysRowA = returnObject['row-a'].children;

    for (let i = 0; i < keysRowA.length; i += 1) {
      const { firstElementChild: key } = keysRowA[i];
      const isTextEmpty = key.textContent === '';
      const isLanguageKey = key.textContent === 'LANG';

      if (isTextEmpty) {
        const { ICON, META_WIN, META_APPLE } = classes;

        key.classList.add(ICON, isPlatformWindows() ? META_WIN : META_APPLE);
      } else if (isLanguageKey) {
        // apply english/russian-flag image
        const { KEYBOARD_LANGUAGE } = variables;
        const keyboardLanguage = localStorage.getItem(KEYBOARD_LANGUAGE);
        const isEnglish = keyboardLanguage === EN;

        key.parentElement.style.backgroundImage = isEnglish
          ? 'url(assets/icons/american-flag.svg)'
          : 'url(assets/icons/russian-flag.svg)';
        key.textContent = isEnglish ? 'EN' : 'RU';
      }
    }

    document.body.append(sectionKeyboard.parentElement);

    return returnObject;
  }

  const elements = createTree();

  /**
   * Invokes when window.onLoad() & gets the stored value in KEYBOARD_LANGUAGE
   * & sets the current language of the keyboard, unhides the 'keyboard' class.
   */
  function initLanguageFromStorage() {
    const { KEYBOARD_LANGUAGE } = variables;

    switch (localStorage.getItem(KEYBOARD_LANGUAGE)) {
      case RU: {
        // change default english innerText to russian
        const [alphabet, numpad] = getAlphabet(EN);

        changeKeysInnerText(alphabet, numpad);
        break;
      }
      case EN: {
        getAlphabet(EN);
        break;
      }
      default: {
        getAlphabet(EN);
        break;
      }
    }
    // unhide the whole keyboard
    elements.keyboard.toggleAttribute(classes.HIDDEN);
  }

  const changeOnShift = () => {
    const {
      DATA_KEYCODE, shiftCodes, KEYBOARD_LANGUAGE, keyCodes, isShift,
    } = variables;
    const { keys } = elements;
    const currentLang = localStorage.getItem(KEYBOARD_LANGUAGE);

    keys.forEach((key) => {
      const currentKeyCode = key.dataset[DATA_KEYCODE];

      if (shiftCodes.includes(currentKeyCode)) {
        const currentKey = key.firstElementChild;

        currentKey.innerText = keyCodes[currentLang][currentKeyCode][Number(isShift)];
      }
    });
  };

  const changeCase = () => {
    const { KEY_UPPERCASE } = classes;
    const { layout } = variables;

    elements.keys.forEach((key) => {
      const innerElement = key.firstElementChild;
      const text = innerElement.textContent.toLowerCase();

      const hasLayoutText = layout.includes(text);
      const hasKeyUppercaseClass = key.classList.contains(KEY_UPPERCASE);

      if (hasLayoutText) {
        if (hasKeyUppercaseClass) {
          key.classList.remove(KEY_UPPERCASE);
        } else {
          key.classList.add(KEY_UPPERCASE);
        }

        innerElement.textContent = hasKeyUppercaseClass ? text : text.toUpperCase();
      }
    });
  };

  /**
   * Changes the language stored in localStorage to the opposite.
   * Changes button's with className 'btn' innerText with name of the language.
   * Changes keys' innerText to the opposite
   */
  function changeLanguage() {
    // 1. remove key-uppercase before update
    const { KEY_UPPERCASE } = classes;
    const { keys } = elements;

    keys.forEach((key) => key.classList.remove(KEY_UPPERCASE));

    // 2. changeLanguage
    // make changes with localStorage
    // and get source alphabet pair map {'en':'ru'} or {'ru':'en'}
    let alphabet;
    let numpad;
    const { KEYBOARD_LANGUAGE } = variables;
    const keyboardLanguage = localStorage.getItem(KEYBOARD_LANGUAGE);
    const key = document.querySelector('.key[data-keycode="Fn"]'); // get fn (language key en/ru)

    switch (keyboardLanguage) {
      case RU:
        localStorage.setItem(KEYBOARD_LANGUAGE, EN);
        [alphabet, numpad] = getAlphabet(RU);
        // apply english flag image & text
        key.style.backgroundImage = 'url(assets/icons/american-flag.svg)';
        key.firstElementChild.textContent = 'EN';
        break;
      case EN:
      default:
        localStorage.setItem(KEYBOARD_LANGUAGE, RU);
        [alphabet, numpad] = getAlphabet(EN);
        // apply russian flag image & text
        key.style.backgroundImage = 'url(assets/icons/russian-flag.svg)';
        key.firstElementChild.textContent = 'RU';
        break;
    }

    // change symbols from english to russian, and backwards
    changeKeysInnerText(alphabet, numpad);

    // 3. restore uppercase
    if (isUppercase()) {
      changeCase();
    }
  }

  const playKeypressSound = () => {
    const audio = new Audio('assets/audio/key-press.mp3');

    audio.volume = 0.5;
    audio.autoplay = true;
  };

  initLanguageFromStorage(); // set language from storage init

  function handlerKeyInput(elem, event) {
    if (!elem) return;

    const text = elements.textarea;

    text.focus();

    const isMouse = () => event.type === 'mousedown';
    const { firstElementChild: el } = elem;

    switch (el.innerText) {
      case ESC: case F1: case F2: case F3: case F4: case F6: case F7: case F8: case F9: case F10:
      case F12: case PRINT_SCREEN: case SCROLL_LOCK: case PAUSE: case INSERT: case NUM_LOCK:
      case CTRL: case FN: case 'Fn': case 'RU': case 'EN': case META:
        break;
      case ALT:
        if (!isMouse()) event.preventDefault();

        break;
      case ALTGR:
        if (!isMouse()) event.preventDefault();

        break;
      case F5: {
        if (isMouse()) document.location.reload();

        break;
      }
      case F11: {
        const isFullScreen = isMouse() && document.fullscreenElement;
        const isNotFullScreen = isMouse() && !document.fullscreenElement;

        if (isFullScreen) {
          document.exitFullscreen();
        } else if (isNotFullScreen) {
          document.documentElement.requestFullscreen();
        }

        break;
      }
      case DELETE: {
        event.preventDefault();

        const { selectionStart: start, selectionEnd: end, value } = text;
        const len = 1;

        if (start !== end) {
          // if selection presents -> cut between start & end
          const strBefore = value.substring(0, start);
          const strAfter = value.substring(end);

          // set textarea value to: text before caret + text after caret
          text.value = `${strBefore}${strAfter}`;

          // put caret at right position
          text.selectionEnd = start;
        } else if (end !== value.length) {
          const strBefore = value.substring(0, start);
          const strAfter = value.substring(end + len);

          // set textarea value to: text before caret + text after caret
          text.value = `${strBefore}${strAfter}`;

          // put caret at right position
          text.selectionEnd = start;
        }
        break;
      }
      case PAGE_UP: {
        const fixOffset = 110;
        const offset = document.documentElement.clientHeight - fixOffset;

        window.scrollBy(0, -offset);
        break;
      }
      case PAGE_DOWN: {
        const fixOffset = 110;
        const offset = document.documentElement.clientHeight - fixOffset;

        window.scrollBy(0, +offset);
        break;
      }
      case BACKSPACE: {
        event.preventDefault();

        const { selectionStart: start, selectionEnd: end, value } = text;
        const len = 1;

        if (start !== end) {
          const strBefore = value.substring(0, start);
          const strAfter = value.substring(end);

          // set textarea value to: text before caret + text after caret
          text.value = `${strBefore}${strAfter}`;

          // put caret at right position
          text.selectionEnd = start;
        } else if (start !== 0) {
          const strBefore = value.substring(0, start - len);
          const strAfter = value.substring(end);

          // set textarea value to: text before caret + text after caret
          text.value = `${strBefore}${strAfter}`;

          // put caret at right position
          text.selectionStart = start - len;
          text.selectionEnd = text.selectionStart;
        }
        break;
      }
      case TAB: {
        event.preventDefault();

        const { selectionStart: start, selectionEnd: end, value } = text;
        const strBefore = value.substring(0, start);
        const strAfter = value.substring(end);
        const tab = '\t';

        // set textarea value to: text before caret + tab + text after caret
        text.value = `${strBefore}${tab}${strAfter}`;

        // put caret at right position
        text.selectionStart = start + tab.length;
        text.selectionEnd = text.selectionStart;
        break;
      }
      case CAPS_LOCK: {
        variables.isCapslock = !variables.isCapslock;
        changeCase();
        break;
      }
      case SHIFT: {
        if (!event.repeat) {
          variables.isShift = !variables.isShift;
          changeCase();
          changeOnShift();
        }

        break;
      }
      case ENTER: {
        event.preventDefault();

        const { selectionStart: start, selectionEnd: end } = text;
        const strBefore = text.value.substring(0, start);
        const strAfter = text.value.substring(end);
        const newline = '\n';

        // set textarea value to: text before caret + newline + text after caret
        text.value = `${strBefore}${newline}${strAfter}`;

        // put caret at right position
        text.selectionStart = start + newline.length;
        text.selectionEnd = text.selectionStart;
        break;
      }
      case SPACE: {
        event.preventDefault();

        const { selectionStart: start, selectionEnd: end } = text;
        const strBefore = text.value.substring(0, start);
        const strAfter = text.value.substring(end);
        const symbol = ' ';

        // set textarea value to: text before caret + tab + text after caret
        text.value = `${strBefore}${symbol}${strAfter}`;

        // put caret at right position
        text.selectionStart = start + symbol.length;
        text.selectionEnd = text.selectionStart;
        break;
      }
      case ARROW_LEFT: {
        event.preventDefault();

        const { selectionStart: start, selectionEnd: end } = text;

        // check if selection presents
        if (start !== end) {
          // remove selection
          text.selectionEnd = text.selectionStart;
        } else if (start !== 0) {
          // handle out of left boundaries
          text.selectionStart = start - 1;
          text.selectionEnd = text.selectionStart;
        }
        break;
      }
      case ARROW_RIGHT: {
        event.preventDefault();

        const { selectionStart: start, selectionEnd: end, value } = text;
        const isTextEmpty = value?.length;

        // check if selection presents
        if (start !== end) {
          // remove selection
          text.selectionStart = text.selectionEnd;
        } else if (end !== isTextEmpty) {
          // handle out of right boundaries
          text.selectionStart = start + 1;
          text.selectionEnd = text.selectionStart;
        }
        break;
      }
      default: {
        const isCtrlOrShiftOrAltKey = event.ctrlKey || event.shiftKey || event.altKey;

        if (!isMouse() && isCtrlOrShiftOrAltKey) {
          break;
        }

        if (isMouse()) {
          event.preventDefault();

          const { selectionStart: start, selectionEnd: end, value } = text;

          const strBefore = value.substring(0, start);
          const strAfter = value.substring(end);
          const { innerText: symbol } = el;

          // set textarea value to: text before caret + tab + text after caret
          text.value = `${strBefore}${symbol}${strAfter}`;

          // put caret at right position
          text.selectionStart = start + symbol.length;
          text.selectionEnd = text.selectionStart;
        }
        break;
      }
    }
  }

  const isSpecialKey = (text, e) => (
    (text === ESC && e.key === 'Escape')
    || (text === SPACE && e.code === 'Space')
    || (text === ARROW_UP && e.code === 'ArrowUp')
    || (text === ARROW_DOWN && e.code === 'ArrowDown')
    || (text === ARROW_LEFT && e.code === 'ArrowLeft')
    || (text === ARROW_RIGHT && e.code === 'ArrowRight')
    || (text === PAGE_UP && e.code === 'PageUp')
    || (text === PAGE_DOWN && e.code === 'PageDown')
    || (text === ALTGR && e.code === 'AltRight')
    || (text === CTRL && e.code === 'ControlLeft')
    || (text === SHIFT && e.code === 'ShiftLeft')
    || (text === SCROLL_LOCK && e.key === 'ScrollLock')
    || (text === PRINT_SCREEN && e.key === 'PrintScreen')
    || (text === '<' && e.code === 'IntlBackslash')
  );

  const isSecondKey = (text, e) => (
    (text === CTRL && e.code === 'ControlRight')
    || (text === SHIFT && e.code === 'ShiftRight')
    || (text === ALT && e.code === 'AltRight')
    || (text === ENTER && e.code === 'NumpadEnter')
    || (text === '\\' && e.code === 'IntlBackslash')
    || (text === '/' && e.code === 'Slash')
    || (text === '-' && e.code === 'NumpadSubtract')
    || (text === '0' && e.code === 'Numpad0')
    || (text === '1' && e.code === 'Numpad1')
    || (text === '2' && e.code === 'Numpad2')
    || (text === '3' && e.code === 'Numpad3')
    || (text === '4' && e.code === 'Numpad4')
    || (text === '5' && e.code === 'Numpad5')
    || (text === '6' && e.code === 'Numpad6')
    || (text === '7' && e.code === 'Numpad7')
    || (text === '8' && e.code === 'Numpad8')
    || (text === '9' && e.code === 'Numpad9')
    || (text === '.' && e.code === 'NumpadDecimal')
  );

  const processKeySelection = (e) => {
    let isKeydown;
    const { type } = e;

    switch (type) {
      case 'keydown':
        isKeydown = true;
        break;
      case 'keyup':
        isKeydown = false;
        break;
      default:
        break;
    }

    function addRemoveKeyActive(currentKey) {
      const { KEY_ACTIVE } = classes;

      return isKeydown
        ? currentKey.classList.add(KEY_ACTIVE)
        : currentKey.classList.remove(KEY_ACTIVE);
    }

    let isRightKey = false;
    let target;

    for (let i = 0; i < elements.keys.length; i += 1) {
      const {
        META_WIN, META_APPLE, META_WIN_ACTIVE, META_APPLE_ACTIVE, KEY_ACTIVE,
      } = classes;
      const key = elements.keys[i];
      const { innerText: keyText } = key;
      const isMeta = (text, event) => text === META && event.key === 'Meta';
      const META_ICON = isPlatformWindows() ? META_WIN : META_APPLE;
      const META_ACTIVE = isPlatformWindows() ? META_WIN_ACTIVE : META_APPLE_ACTIVE;
      const isCapsLock = (text, event) => text === CAPS_LOCK && event.key === 'CapsLock';
      const isNumLock = (text, event) => text === NUM_LOCK && event.key === 'NumLock';

      if (isMeta(keyText, e)) {
        addRemoveKeyActive(key);

        const { firstElementChild: innerSpanKey } = key;

        innerSpanKey.classList.remove(isKeydown ? META_ICON : META_ACTIVE);
        innerSpanKey.classList.add(isKeydown ? META_ACTIVE : META_ICON);
        break;
      } else if (isSpecialKey(keyText, e)) {
        addRemoveKeyActive(key);
        target = key;
        break;
      } else if (isKeydown && !e.repeat && isCapsLock(keyText, e)) {
        const hasKeyActiveClass = key.classList.contains(KEY_ACTIVE);

        if (hasKeyActiveClass) {
          key.classList.remove(KEY_ACTIVE);
        } else {
          key.classList.add(KEY_ACTIVE);
        }
        target = key;
        break;
      } else if (isKeydown && !e.repeat && isNumLock(keyText, e)) {
        const hasKeyActiveClass = key.classList.contains(KEY_ACTIVE);

        if (hasKeyActiveClass) {
          key.classList.remove(KEY_ACTIVE);
        } else {
          key.classList.add(KEY_ACTIVE);
        }
        target = key;
        break;
      } else if (isSecondKey(keyText, e) && isRightKey) {
        addRemoveKeyActive(key);
        target = key;
        break;
      } else if (isSecondKey(keyText, e) && !isRightKey) {
        isRightKey = true;
      } else if (keyText === e.key) {
        addRemoveKeyActive(key);
        target = key;
        break;
      }
    }

    return target;
  };

  // ///////////////////////// KEYBOARD HANDLERS ///////////////////////////
  const handlerKeyDown = (e) => {
    if (!e.repeat) {
      // playKeypressSound();

      const {
        ctrlKey, shiftKey, altKey, code,
      } = e;

      const isCtrlShiftPressed = ctrlKey && shiftKey
        && (code === 'ControlLeft' || code === 'ShiftLeft');
      const isCtrlAltPressed = ctrlKey && altKey
        && (code === 'ControlLeft' || code === 'AltLeft');
      const isAltShiftPressed = shiftKey && altKey
        && (code === 'ShiftLeft' || code === 'AltLeft');

      if (isCtrlShiftPressed || isCtrlAltPressed || isAltShiftPressed) {
        changeLanguage();
      }
    }

    elements.textarea.focus();

    const target = processKeySelection(e);

    handlerKeyInput(target, e);
  };

  const handlerKeyUp = (e) => {
    const PRINTSCREEN = 'PrintScreen';
    const { key } = e;
    const isKeyShift = key === SHIFT;

    if (isKeyShift) {
      variables.isShift = !variables.isShift;
      changeCase();
      changeOnShift();
    }

    const isKeyPrintScreen = key === PRINTSCREEN;

    if (isKeyPrintScreen) {
      const customEvent = new KeyboardEvent('keydown', {
        cancelable: true,
        key: PRINTSCREEN,
        code: PRINTSCREEN,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        repeat: false,
      });

      handlerKeyDown(customEvent);
      setTimeout(() => processKeySelection(e), 100);
      return;
    }

    // if released, reset the key hold
    processKeySelection(e);
  };

  // ///////////////////////// MOUSE HANDLERS ///////////////////////////
  const handlerMouseDown = (e) => {
    const { KEY } = classes;
    // find div.key
    let target;
    const hasTargetKeyClass = e.target.classList.contains(KEY);

    if (hasTargetKeyClass) {
      target = e.target;
    } else if (!e.target.children.length) {
      target = e.target.parentElement;
    }
    // store this node as a fired mousedown event to the future removal
    variables.mousedownFiredEvent = target;

    // make UI effects if event exists
    if (target) {
      playKeypressSound();

      const text = target.firstElementChild.innerText;
      const isShift = (key) => key === SHIFT;
      const isCtrl = (key) => key === CTRL;
      const isAlt = (key) => key === ALT;
      const isCtrlShiftPressed = (e.ctrlKey && isShift(text)) || (e.shiftKey && isCtrl(text));
      const isCtrlAltPressed = (e.ctrlKey && isAlt(text)) || (e.altKey && isCtrl(text));
      const isAltShiftPressed = (e.altKey && isShift(text)) || (e.shiftKey && isAlt(text));
      const isLanguageKey = text === 'EN' || text === 'RU';

      if (isCtrlShiftPressed || isCtrlAltPressed || isAltShiftPressed || isLanguageKey) {
        changeLanguage();
      }

      const isMeta = (key) => key === META;
      const { KEY_ACTIVE } = classes;

      if (isShift(text)) {
        elements.keys.forEach((key) => {
          if (isShift(key.firstElementChild.innerText)) {
            key.classList.toggle(KEY_ACTIVE);
          }
        });
      } else if (isMeta(text)) {
        const {
          META_WIN, META_APPLE, META_WIN_ACTIVE, META_APPLE_ACTIVE,
        } = classes;
        const META_ICON = isPlatformWindows() ? META_WIN : META_APPLE;
        const META_ACTIVE = isPlatformWindows() ? META_WIN_ACTIVE : META_APPLE_ACTIVE;

        target.classList.toggle(KEY_ACTIVE);
        target.firstElementChild.classList.toggle(META_ICON);
        target.firstElementChild.classList.toggle(META_ACTIVE);
      } else {
        target.classList.toggle(KEY_ACTIVE);
      }
    }

    // key input handler
    handlerKeyInput(target, e);
  };

  const handlerMouseUp = () => {
    if (!variables.mousedownFiredEvent) return;

    const { innerText: text } = variables.mousedownFiredEvent.firstElementChild;
    const isCapsLock = (key) => key === CAPS_LOCK;
    const isNumLock = (key) => key === NUM_LOCK;
    const isShift = (key) => key === SHIFT;

    if (isCapsLock(text) || isNumLock(text) || isShift(text)) return;

    const isMeta = (key) => key === META;

    if (isMeta(text)) {
      const {
        META_WIN, META_APPLE, META_WIN_ACTIVE, META_APPLE_ACTIVE,
      } = classes;
      const META_ICON = isPlatformWindows() ? META_WIN : META_APPLE;
      const META_ACTIVE = isPlatformWindows() ? META_WIN_ACTIVE : META_APPLE_ACTIVE;

      variables.mousedownFiredEvent.firstElementChild.classList.add(META_ICON);
      variables.mousedownFiredEvent.firstElementChild.classList.remove(META_ACTIVE);
    }

    const { KEY_ACTIVE } = classes;

    variables.mousedownFiredEvent.classList.remove(KEY_ACTIVE);
  };

  function initHandlers() {
    document.body.addEventListener('keydown', handlerKeyDown);
    document.body.addEventListener('keyup', handlerKeyUp);

    elements.keyboard.addEventListener('mousedown', handlerMouseDown);
    document.addEventListener('mouseup', handlerMouseUp);
  }

  initHandlers();
};

export default Keyboard;
