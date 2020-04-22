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
      console.error(e);
    }
  }

  init() {
    this.initElements();

    const scope = this;
    window.addEventListener('hashchange', () => scope.hasChanged());
    this.hasChanged();
  }

  initElements() {
    this.rootElem = document.getElementById('root');
    this.mainElem = document.querySelector('.main-content .wrapper');
  }

  hasChanged() {
    const { hash } = window.location;
    const route = hash.length > 0
      ? this.routes.find((routeLocal) => routeLocal.isActiveRoute())
      : this.routes.find((routeLocal) => routeLocal.default);

    if (route) {
      route.goToRoute();
    } else {
      const notFoundComponent = new NotFound();
      this.mainElem.innerHTML = notFoundComponent.getMarkup();
    }
  }
}

export default Router;
