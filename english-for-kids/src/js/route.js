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
    const { hash } = window.location; // #/categories/1
    // remove hash and split address by '/' = make this ["", "categories", "1"]
    const parsedArr = hash.substring(1).split('/');
    const parsedFormatted = parsedArr.join('/');
    // is address like '/{routeName}/{id}'
    const isLocationDepthEqualsThree = parsedArr.length === 3;
    const id = parsedArr[2];
    const isIdNotEmpty = id !== '';

    if (isLocationDepthEqualsThree && isIdNotEmpty) {
      const templatePath = this.name;
      const processedPath = templatePath.replace('{id}', id);

      return processedPath === parsedFormatted;
    }
    return this.name === parsedFormatted;
  }

  goToRoute() {
    this.callback();
  }
}

export default Route;
