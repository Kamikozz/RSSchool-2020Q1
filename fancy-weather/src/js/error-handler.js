const [errorInfoElement] = document.getElementsByClassName('search-container__info-message');

const errorHandler = {
  ERROR_STATUSES: {
    NO_CONNECTION: 'error_no_connection',
    EMPTY_QUERY: 'error_empty_query',
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
  },

  hasErrorStatus(errorStatus) {
    const valuesArray = Object.values(this.ERROR_STATUSES);

    return valuesArray.some((errorStatusValue) => errorStatusValue === errorStatus);
  },
};


export default errorHandler;
