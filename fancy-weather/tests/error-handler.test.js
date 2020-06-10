import errorHandler from '../src/js/error-handler';

describe('Error handling module', () => {
  describe('hasErrorStatus', () => {
    it('should return true for error status which is in ERROR_STATUSES', () => {
      expect(errorHandler.hasErrorStatus('error_no_connection')).toBeTruthy();
    });

    it('should return false for error status which is not in ERROR_STATUSES', () => {
      expect(errorHandler.hasErrorStatus('error_this_is_not_an_error')).toBeFalsy();
    });
  });

  describe('handle', () => {
    const initHTMLMockElement = () => {
      document.body.innerHTML = `
        <p class="search-container__info-message"></p>
      `;

      return document.body.firstElementChild;
    };

    it('should set data-i18n to the given error', () => {
      const errorInfoMessage = initHTMLMockElement();

      errorHandler.handle('error_no_connection');
      expect(errorInfoMessage.dataset.i18n).toStrictEqual('error_no_connection');
    });

    it('should remove data-i18n and set textContent to the given error (if ERROR_STATUSES doesn\'t have the given error)', () => {
      const errorInfoMessage = initHTMLMockElement();
      const errorDescription = 'error_unhandled_error_that_is_not_in_error_statuses';

      errorHandler.handle(errorDescription);
      expect(errorInfoMessage.dataset.i18n).toBeUndefined();
      expect(errorInfoMessage.textContent).toStrictEqual(errorDescription);
    });

    it('should reset timeout delay on Nth execution of the handle() function', () => {
      const errorInfoMessage = initHTMLMockElement();

      jest.useFakeTimers();

      // There we set data-i18n="error_no_connection"
      // and set the timer to remove data-i18n after 5 seconds
      errorHandler.handle('error_no_connection');
      jest.advanceTimersByTime(3000);
      expect(errorInfoMessage.dataset.i18n).toStrictEqual('error_no_connection');

      // There we run second error handler and set data-i18n="error_not_found";
      // reset previous timer and set new timer to remove data-i18n after 5 seconds
      errorHandler.handle('error_not_found');

      // Make sure that after 5 seconds first handler didn't run
      jest.advanceTimersByTime(2001);
      expect(errorInfoMessage.dataset.i18n).toStrictEqual('error_not_found');

      // Make sure that after 5 seconds after run second handler
      // data-i18n removed
      jest.advanceTimersByTime(3000);
      expect(errorInfoMessage.dataset.i18n).toBeUndefined();
    });
  });

  describe('removeErrorMessage', () => {
    const checkForRemovedErrorMessage = () => {
      document.body.innerHTML = `
        <p class="search-container__info-message" data-i18n="error_no_connection">Error</p>
      `;

      const args = { delay: 5000 };

      jest.useFakeTimers();
      errorHandler.removeErrorMessage(args);
      jest.advanceTimersByTime(5100);

      const element = document.body.firstElementChild;
      const { dataset: { i18n }, textContent } = element;

      return [i18n, textContent];
    };

    it('should remove data-i18n and textContent to be set empty string', () => {
      const [dataAttribute, text] = checkForRemovedErrorMessage();

      expect(dataAttribute).toBeUndefined();
      expect(text).toStrictEqual('');
    });
  });
});
