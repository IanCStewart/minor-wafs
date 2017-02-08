/*global window, document*/
(function (){
  const section = {
    toggle: function (){
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
    init: function (){
      window.addEventListener('hashchange', section.toggle, false);
    }
  };
  const app = {
    init: function (){
      routes.init();
    }
  };

  app.init();
})();
