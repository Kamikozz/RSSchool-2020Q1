class Route {
  constructor(name, htmlName, defaultRoute) {
    try {
      if (!name || !htmlName) {
        throw new Error('name and htmlName params are required');
      }

      this.name = name;
      this.htmlName = htmlName;
      this.default = defaultRoute;
    } catch (e) {
      // console.log(e);
    }
  }

  isActiveRoute() {
    const { hash } = window.location;
    // console.log('WTF', hash);
    // const parsedHash = hash.substring(1);
    // console.log('Parsed: ', parsedHash);
    // const parsedArr = parsedHash.split('/');
    // console.log(parsedArr);
    // const parsedFormatted = parsedArr.join('/');
    // console.log('Joined: ', parsedFormatted);

    const parsedArr = hash.substring(1).split('/');
    const parsedFormatted = parsedArr.join('/');

    if (parsedArr.length === 3 && parsedArr[2] !== '') {
      const templatePath = this.name;
      const processedPath = templatePath.replace('{id}', parsedArr[2]);
      // console.log(parsedFormatted, templatePath, processedPath);
      return processedPath === parsedFormatted;
    }
    return this.name === parsedFormatted;
  }
}

export default Route;
