/*global window, document, aja, Handlebars*/
(function(){
  const appSettings = {
    current: document.querySelector('#current'),
    hourly: document.querySelector('#hourly'),
    detail: document.querySelector('#hourly-detail'),
    templateCurrent: Handlebars.compile(document.querySelector('#template-current').innerHTML),
    templateHourly: Handlebars.compile(document.querySelector('#template-hourly').innerHTML),
    urlHourly: 'http://api.wunderground.com/api/7f0aee996268ea76/hourly/q/autoip.json',
    urlCurrent: 'http://api.wunderground.com/api/7f0aee996268ea76/conditions/q/autoip.json',
    html: ''
  };

  const weatherData = {
    datestamp: '',
    timestamp: '',
    current: '',
    hourly: '',
    detail: ''
  };

  const app = {
    init() {
      routes.init();
      getData.current();
      getData.hourly();
    },
    render() {
      weatherData.current && weatherData.hourly ? render(weatherData) : null;
    }
  };

  const routes = {
    pages: ['#current', '#hourly', '#hourly-detail'],
    init() {
      section.toggle(window.location.hash === '' ? '#current' : this.location);
      window.addEventListener('hashchange', () => section.toggle(window.location.hash), false);
    }
  };

  const section = {
    toggle(route) {
      routes.pages.forEach(function (page) {
        page === route
        ? document.querySelector(page).classList.remove('invisible')
        : document.querySelector(page).classList.add('invisible');
      });
    }
  };

  const storeData = {
    current(data) {
      const date = new Date();
      const minutes = '0' + date.getMinutes();
      const seconds = '0' + date.getSeconds();
      const month = '0' + date.getMonth();
      const formattedTime = `${date.getHours()}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
      const formattedDate = `${date.getDate()}-${month.substr(-2)}-${date.getFullYear()}`;
      weatherData.current = data.current_observation;
      weatherData.datestamp = formattedTime;
      weatherData.timestamp = formattedDate;
      app.render();
    },
    hourly(data) {
      weatherData.hourly = data.hourly_forecast;
      app.render();
    }
  };

  const render = function (data) {
    (function(){
      appSettings.html = appSettings.templateCurrent(data);
      appSettings.current.innerHTML += appSettings.html;
    })();
    data.hourly.forEach(function (item) {
      appSettings.html = appSettings.templateHourly(item);
      appSettings.hourly.innerHTML += appSettings.html;
    });
  };

  const getData = {
    current() {
      aja()
      .url(appSettings.urlCurrent)
      .on('success', function(data){
         storeData.current(data);
      })
      .go();
    },
    hourly() {
      aja()
      .url(appSettings.urlHourly)
      .on('success', function(data){
         storeData.hourly(data);
      })
      .go();
    }
  };

  app.init();
})();
