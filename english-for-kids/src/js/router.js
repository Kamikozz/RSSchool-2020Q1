import NotFound from '../components/not-found/not-found';

class Router {
  constructor(routes) {
    try {
      if (!routes) {
        throw new Error('routes param is required');
      }

      this.routes = routes;

      this.init();
    } catch (e) {
      // console.error(e);
    }
  }

  init() {
    this.initElements();

    const { routes } = this.routes;
    const scope = this;
    window.addEventListener('hashchange', () => scope.hasChanged(scope, routes));
    this.hasChanged(this, routes);
  }

  initElements() {
    this.rootElem = document.getElementById('root');
    this.mainElem = document.querySelector('.main-content .wrapper');
  }

  hasChanged(scope) {
    const { hash } = window.location;
    const route = hash.length > 0
      ? this.routes.find((routeLocal) => routeLocal.isActiveRoute())
      : this.routes.find((routeLocal) => routeLocal.default);
    // console.log(scope, hash, route);
    console.log('CURRENT ROUTE', route);
    if (route) {
      scope.goToRoute(route.htmlName);
    } else {
      scope.goToRoute('404');
    }
  }

  goToRoute(htmlName) {
    console.log(this.routes, htmlName);
    // const scope = this;
    // const url = `views/${htmlName}`;
    // scope.rootElem.innerHTML = this.responseText;

    switch (htmlName) {
      case '404': {
        const notFoundComponent = new NotFound();
        this.mainElem.innerHTML = notFoundComponent.getMarkup();
        break;
      }
      default:
        console.log('HEY, ADD SOME HANDLER TO ME!');
        break;
    }
  }

  // goToRoute(htmlName) {
  //   const scope = this;
  //   const url = `views/${htmlName}`;
  //   const xhr = new XMLHttpRequest();
  //   xhr.onreadystatechange = function requestCallback() {
  //     if (this.readyState === 4 && this.status === 200) {
  //       scope.rootElem.innerHTML = this.responseText;
  //     }
  //   };
  //   xhr.open('GET', url, true);
  //   xhr.send();
  // }
}

export default Router;
