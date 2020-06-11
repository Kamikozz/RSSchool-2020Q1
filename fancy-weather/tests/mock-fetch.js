/** @see https://medium.com/@rishabhsrao/mocking-and-testing-fetch-with-jest-c4d670e2e167 */

/**
 * Mocks `global.fetch` to send fake data that will be given by `json` argument.
 * @param {String|Object} json result that will be returned after calling json() || text()
 * @param {Object} options configuration of the fetch (e.g. `ok`, `status` fields)
 */
const mockFetch = (json, options = {}) => {
  const { ok = true, status = 200 } = options;
  const mockSuccessResponse = json;
  const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
  const mockFetchPromise = Promise.resolve({ // 3
    ok,
    status,
    json: () => mockJsonPromise,
    text: () => mockJsonPromise,
  });

  jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); // 4
};

export default mockFetch;
