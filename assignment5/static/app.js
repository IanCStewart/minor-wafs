/*global window, document*/
(function (){
  const section = {
    init() {
      const route = window.location.hash;
      if(route === '') {
        routes.pages.forEach(function (page) {
          page === 'home'
          ? document.getElementById(page).classList.remove('invisible')
          : document.getElementById(page).classList.add('invisible');
        });
      } else {
        routes.pages.forEach(function (page) {
          `#${page}` === route
          ? document.getElementById(page).classList.remove('invisible')
          : document.getElementById(page).classList.add('invisible');
        });
      }
    },
    toggle() {
      const route = window.location.hash;
      routes.pages.forEach(function (page) {
        `#${page}` === route
        ? document.getElementById(page).classList.remove('invisible')
        : document.getElementById(page).classList.add('invisible');
      });
    }
  };
  const routes = {
    pages: [
      'home',
      'best-practices'
    ],
    init() {
      section.init();
      window.addEventListener('hashchange', section.toggle, false);
    }
  };
  const app = {
    init() {
      routes.init();
    }
  };

  app.init();
})();
