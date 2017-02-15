/*global window, document, aja, Handlebars*/
(function(){
  'use strict';

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
    filter: ''
  };

  const app = {
    init() {
      routes.init();
      filter.init();
      getData.current();
      getData.hourly();
    },
    render() {
      weatherData.current && weatherData.hourly ? render.init(weatherData) : null;
    }
  };

  const routes = {
    pages: ['#current', '#hourly'],
    init() {
      section.toggle(window.location.hash);
      window.addEventListener('hashchange', () => section.toggle(window.location.hash), false);
    }
  };

  const section = {
    toggle(route) {
      route === '' ? route = '#current' : null;
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

  const render = {
    init(data) {
      appSettings.html = appSettings.templateCurrent(data);
      appSettings.current.innerHTML += appSettings.html;
      data.hourly.forEach(function (item) {
        appSettings.html = appSettings.templateHourly(item);
        appSettings.hourly.innerHTML += appSettings.html;
      });
    },
    filteredData(data) {
      console.log(data);
    }
  };
// TODO: this is broken now
  const filter = {
    init() {
      console.log('filter.init()');
      document.querySelector('.filter-station').addEventListener('click', () => console.log('clicked'), false);
    }
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
    },
    filter() {
      console.log('getData.filter()');
      const filteredData = [];
      document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.checked
        ? checkbox.name === 'Partly Cloudy'
        ? filteredData.push(weatherData.hourly.filter((d) => d.condition.includes('Cloudy')))
        : filteredData.push(weatherData.hourly.filter((d) => d.condition === checkbox.name))
        : null;
      });
      console.log('after filter', filteredData);
      filteredData.length === 0 ? null : render.filteredData(filteredData);
    }
  };

  app.init();
})();
