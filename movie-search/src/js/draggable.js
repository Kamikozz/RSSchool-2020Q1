class Draggable {
  constructor(element) {
    this.element = element;
    this.shiftX = null;
    this.shiftY = null;
  }

  init() {
    this.initHandlers();
  }

  initHandlers() {
    this.element.addEventListener('mousedown', this.handlerMouseDown.bind(this));

    // Browser has own Drag'n'Drop, which runs automatically and conflicts with our realization.
    // Need to prevent browser's default behaviour of drag'n'drop.
    this.element.addEventListener('dragstart', (event) => event.preventDefault());
  }

  handlerMouseDown(event) {
    const boundingClientRect = this.element.getBoundingClientRect();

    this.shiftX = event.clientX - boundingClientRect.left;
    this.shiftY = event.clientY - boundingClientRect.top;

    this.element.style.position = 'absolute';
    this.element.style.zIndex = 20;
    this.element.style.cursor = 'move';
    // move element into the body
    // to be sure element is not inside of position:relative
    document.body.append(this.element);

    // set absolutely positioned element under the cursor position
    this.moveAt(event.pageX, event.pageY);

    const onMouseMove = (evt) => {
      this.moveAt(evt.pageX, evt.pageY);
    };
    const onMouseUp = () => {
      this.element.style.cursor = 'initial';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  /**
   * Moves an element into the given coordinates (pageX, pageY)
   * additionally considering the initial shift relative to the mouse pointer
   * @param {Number} pageX position on the page in the X axis
   * @param {Number} pageY position on the page in the Y axis
  */
  moveAt(pageX, pageY) {
    this.element.style.left = `${pageX - this.shiftX}px`;
    this.element.style.top = `${pageY - this.shiftY}px`;
  }
}

export default Draggable;
