const performRequests = async ({
  promises,
  callback,
  setPreloader = true,
  preloaderEl = document.body,
  preloaderClassName = 'preloader',
  preloaderLoadingClassName = 'preloader_loading',
}) => {
  if (setPreloader) {
    const hasPreloaderClassName = preloaderEl.classList.contains(preloaderClassName);

    if (!hasPreloaderClassName) {
      preloaderEl.classList.add(preloaderClassName);
    }

    preloaderEl.classList.toggle(preloaderLoadingClassName);
  }

  const result = await Promise.all(promises);

  if (setPreloader) {
    preloaderEl.classList.toggle(preloaderLoadingClassName);
    callback();
  }

  return result;
};

module.exports = {
  performRequests,
};
