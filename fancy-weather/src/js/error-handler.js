const errorHandler = {
  ERROR_I18N_DATA_ATTRIBUTE: 'data-i18n',
  ERROR_STATUSES: {
    NO_CONNECTION: 'error_no_connection',
    EMPTY_QUERY: 'error_empty_query',
    NOT_FOUND: 'error_not_found',
    UNSPLASH_IMAGES_EXCEEDED_LIMIT: 'error_unsplash_images_exceeded_limit',
  },
  errorInfoElement: null,
  timerId: null,

  initElements() {
    const INFO_MESSAGE_CLASS = 'search-container__info-message';

    [this.errorInfoElement] = document.getElementsByClassName(INFO_MESSAGE_CLASS);
  },

  handle(err) {
    this.initElements();

    const hasErrorStatus = this.hasErrorStatus(err);

    // If it's unhandled error then display the original error.message
    if (!hasErrorStatus) {
      this.errorInfoElement.removeAttribute(this.ERROR_I18N_DATA_ATTRIBUTE);
      this.errorInfoElement.textContent = err;
    } else {
      this.errorInfoElement.dataset.i18n = err;
    }

    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    this.timerId = this.removeErrorMessage({ delay: 5000 });
  },

  hasErrorStatus(errorStatus) {
    const valuesArray = Object.values(this.ERROR_STATUSES);

    return valuesArray.some((errorStatusValue) => errorStatusValue === errorStatus);
  },

  removeErrorMessage({ delay }) {
    this.initElements();

    return setTimeout(() => {
      this.errorInfoElement.removeAttribute(this.ERROR_I18N_DATA_ATTRIBUTE);
      this.errorInfoElement.textContent = '';
    }, delay);
  },
};

export default errorHandler;
