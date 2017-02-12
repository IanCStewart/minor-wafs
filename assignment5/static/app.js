/*global window, document*/
(function (){
  const section = {
    toggle(route) {
      routes.pages.forEach(function (page) {
        page === route
        ? document.querySelector(page).classList.remove('invisible')
        : document.querySelector(page).classList.add('invisible');
      });
    }
  };
  const routes = {
    pages: ['#home', '#best-practices'],
    init() {
      window.location.hash === '' ? section.toggle('#home') : section.toggle(window.location.hash);
      window.addEventListener('hashchange', () => section.toggle(window.location.hash), false);
    }
  };
  const app = {
    init() {routes.init();}
  };

  app.init();
})();
