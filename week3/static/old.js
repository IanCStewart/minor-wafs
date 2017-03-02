/*global window, document, aja, Handlebars, config*/
(function(){
  'use strict';

  const appSettings = {
    current: document.querySelector('#current'),
    hourly: document.querySelector('.hourly-container'),
    templateCurrent: Handlebars.compile(document.querySelector('#template-current').innerHTML),
    templateHourly: Handlebars.compile(document.querySelector('#template-hourly').innerHTML),
    urlHourly: `https://api.wunderground.com/api/${config.API_KEY}/hourly/q/autoip.json`,
    urlCurrent: `https://api.wunderground.com/api/${config.API_KEY}/conditions/q/autoip.json`,
    html: ''
  };

  const weatherData = {
    datestamp: '',
    timestamp: '',
    current: '',
    hourly: ''
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

  const emptyState = {
    noLenght(type) {
      return (
        `
          <div class="empty-state">
            <h1>No data<h1>
            <p>The ${type} data seems to be empty</p>
            ${type === 'filter' ? '<p>Try turning on different filters</p>' : null}
          </div>
        `
      );
    },
    connection: '<div class="empty-state"><h1>Connection issue</h1><p>Seems like there is a problem with the connection to the API. Please check your internet connectivity.</p></div>'
  };

  const render = {
    init(data) {
      appSettings.current.innerHTML = '';
      appSettings.hourly.innerHTML = '';
      data.current
      ? appSettings.html = appSettings.templateCurrent(data)
      : appSettings.html = emptyState.noLenght('current');
      appSettings.current.innerHTML += appSettings.html;
      data.hourly.length > 0
      ? data.hourly.forEach(function (item) {
        appSettings.html = appSettings.templateHourly(item);
        appSettings.hourly.innerHTML += appSettings.html;
      })
      : appSettings.hourly.innerHTML += emptyState.noLenght('hourly');
    },
    filteredData(data) {
      appSettings.hourly.innerHTML = '';
      data.length > 0
      ? data.map(function (item) {
        appSettings.html = appSettings.templateHourly(item);
        appSettings.hourly.innerHTML += appSettings.html;
      })
      : appSettings.hourly.innerHTML += emptyState.noLenght('filter');
    },
    clearedFilter(data) {
      appSettings.hourly.innerHTML = '';
      data.hourly.forEach(function (item) {
        appSettings.html = appSettings.templateHourly(item);
        appSettings.hourly.innerHTML += appSettings.html;
      });
    },
    error(type) {
      appSettings.html = emptyState.connection;
      type === 'current'
      ? appSettings.current.innerHTML = appSettings.html
      : appSettings.hourly.innerHTML = appSettings.html;
    }
  };

  const filter = {
    init() {
      document.querySelector('.filter-station').addEventListener('click', () => getData.filter(), false);
    }
  };

  const getData = {
    current() {
      aja()
      .url(appSettings.urlCurrent)
      .on('success', function(data){
         storeData.current(data);
      }).
      on('error', render.error('current'))
      .go();
    },
    hourly() {
      aja()
      .url(appSettings.urlHourly)
      .on('success', function(data){
         storeData.hourly(data);
      }).
      on('error', render.error('hourly'))
      .go();
    },

    filter() {
      const filteredData = [];
      document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        if (checkbox.checked) {
          checkbox.name === 'Partly Cloudy'
          ? filteredData.push(weatherData.hourly.filter((d) => d.condition.includes('Cloudy')))
          : filteredData.push(weatherData.hourly.filter((d) => d.condition === checkbox.name));
        }
      });
      filteredData.length === 0 ? render.clearedFilter(weatherData) : render.filteredData([].concat.apply([], filteredData));
    }
  };

  app.init();
})();
