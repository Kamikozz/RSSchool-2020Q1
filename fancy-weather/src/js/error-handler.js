const [errorInfoElement] = document.getElementsByClassName('search-container__info-message');

let timerId = null;

const errorHandler = {
  ERROR_STATUSES: {
    NO_CONNECTION: 'error_no_connection',
    EMPTY_QUERY: 'error_empty_query',
    NOT_FOUND: 'error_not_found',
    UNSPLASH_IMAGES_EXCEEDED_LIMIT: 'error_unsplash_images_exceeded_limit',
  },

  handle(err) {
    console.log('Ошибка: ', err);

    const hasErrorStatus = this.hasErrorStatus(err);

    // If it's unhandled error then display the original error.message
    if (!hasErrorStatus) {
      errorInfoElement.removeAttribute('data-i18n');
      errorInfoElement.textContent = err;
    } else {
      errorInfoElement.dataset.i18n = err;
    }

    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    timerId = this.removeErrorMessage({ delay: 5000 });
  },

  hasErrorStatus(errorStatus) {
    const valuesArray = Object.values(this.ERROR_STATUSES);

    return valuesArray.some((errorStatusValue) => errorStatusValue === errorStatus);
  },

  removeErrorMessage({ delay }) {
    return setTimeout(() => {
      errorInfoElement.removeAttribute('data-i18n');
      errorInfoElement.textContent = '';
    }, delay);
  },
};


export default errorHandler;
