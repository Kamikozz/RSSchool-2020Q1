/** @see https://medium.com/@rishabhsrao/mocking-and-testing-fetch-with-jest-c4d670e2e167 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import getBackgroundData from '../src/js/api/unsplash-service';
import errorHandler from '../src/js/error-handler';
import mockFetch from './mock-fetch';

describe('Unsplash service module', () => {
  it('fetches data JSON when server returns a successful response', async (done) => { // 1
    const fakeDataJSON = {
      number: 2,
      string: 'fake',
    };

    mockFetch(fakeDataJSON, {
      ok: true,
      status: 200,
    });

    const testFunctionResults = await getBackgroundData('some fake query');

    expect(global.fetch).toHaveBeenCalledTimes(1);

    process.nextTick(() => { // 6
      expect(testFunctionResults).toEqual(fakeDataJSON);

      global.fetch.mockClear(); // Optionally, we clear the mock.
      done(); // We invoke done to tell Jest that this test case is complete.
    });
  });

  it('should get text from unsuccessful response with undefined error status & throw Error with this text', (done) => {
    const fakeDataText = 'fakeDataText';

    mockFetch(fakeDataText, {
      ok: false,
      status: 404,
    });

    process.nextTick(() => {
      expect(getBackgroundData('some fake query')).rejects.toThrow(new Error('fakeDataText'));

      global.fetch.mockClear(); // Optionally, we clear the mock.
      done(); // We invoke done to tell Jest that this test case is complete.
    });
  });

  it('should get text from unsuccessful response with predefined error status 403 & throw Error with this text', (done) => {
    const fakeDataText = 'fakeDataText';

    mockFetch(fakeDataText, {
      ok: false,
      status: 403,
    });

    process.nextTick(() => {
      expect(getBackgroundData('some fake query')).rejects.toThrow(new Error(errorHandler.ERROR_STATUSES.UNSPLASH_IMAGES_EXCEEDED_LIMIT));

      global.fetch.mockClear(); // Optionally, we clear the mock.
      done(); // We invoke done to tell Jest that this test case is complete.
    });
  });
});
