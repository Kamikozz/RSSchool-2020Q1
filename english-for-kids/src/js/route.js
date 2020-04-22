class Route {
  constructor(name, callback, defaultRoute) {
    try {
      if (!name || !callback) {
        throw new Error('name and callback params are required');
      }

      this.name = name;
      this.callback = callback;
      this.default = defaultRoute;
    } catch (e) {
      console.log(e);
    }
  }

  isActiveRoute() {
    const { hash } = window.location;
    const parsedArr = hash.substring(1).split('/');
    const parsedFormatted = parsedArr.join('/');

    if (parsedArr.length === 3 && parsedArr[2] !== '') {
      const templatePath = this.name;
      const processedPath = templatePath.replace('{id}', parsedArr[2]);
      return processedPath === parsedFormatted;
    }
    return this.name === parsedFormatted;
  }

  goToRoute() {
    this.callback();
  }
}

export default Route;
