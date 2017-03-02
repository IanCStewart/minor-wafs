/*global window, document, aja, Handlebars, config, localStorage*/
(function(){
  const appSettings = {
    current: document.querySelector('#current'),
    hourly: document.querySelector('.hourly-container'),
    templateCurrent: Handlebars.compile(document.querySelector('#template-current').innerHTML),
    templateHourly: Handlebars.compile(document.querySelector('#template-hourly').innerHTML),
    url(parameter) { return `https://api.wunderground.com/api/${config.API_KEY}/${parameter}/q/autoip.json`;},
    html: ''
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
    connection: `
      <div class="empty-state">
        <h1>Connection issue</h1>
        <p>Seems like there is a problem with the connection to the API. Please check your internet connectivity.</p>
      </div>
    `
  };

  const app = {
    init() {
      routes.listen();
    }
  };

  const routes = {
    listen() {
      store.hydrate();
      section.toggle(window.location.hash);
      window.addEventListener('hashchange', () => section.toggle(window.location.hash), false);
      document.querySelector('.filter-station').addEventListener('click', () => store.filter(), false);
    },
    pages: ['#current', '#hourly']
  };

  const section = {
    toggle(route) {
      route === '' ? route = '#current' : null;
      routes.pages.forEach(function (page) {
        page === route
        ? document.querySelector(page).classList.remove('invisible')
        : document.querySelector(page).classList.add('invisible');
      });
    },
    renderInitial(data) {
      appSettings.current.innerHTML = '';
      appSettings.hourly.innerHTML = '';
      appSettings.html = appSettings.templateCurrent(data);
      appSettings.current.innerHTML = appSettings.html;
      data.hourly.forEach(function (item) {
        appSettings.html = appSettings.templateHourly(item);
        appSettings.hourly.innerHTML += appSettings.html;
      });
    },
    renderFiltered(data) {
      appSettings.hourly.innerHTML = '';
      data.length > 0
      ? data.map(function (item) {
        appSettings.html = appSettings.templateHourly(item);
        appSettings.hourly.innerHTML += appSettings.html;
      })
      : appSettings.hourly.innerHTML += emptyState.noLenght('filter');
    },
    renderError(filter) {
      appSettings.html = emptyState.connection;
      if (filter) {
        appSettings.html = emptyState.noLenght('filter');
        appSettings.hourly.innerHTML = appSettings.html;
      } else {
        appSettings.current.innerHTML = appSettings.html;
        appSettings.hourly.innerHTML = appSettings.html;
      }
    }
  };

  const store = {
    hydrate() {
      const weatherData = JSON.parse(localStorage.getItem('weatherData'));
      if (!weatherData) {
        request.data();
      } else {
        const date = new Date();
        const minutes = '0' + date.getMinutes();
        const month = '0' + date.getMonth();
        const formattedDate = `${date.getDate()}-${month.substr(-2)}-${date.getFullYear()}`;
        const timestamp = weatherData.timestamp.split(':');
        if (formattedDate != weatherData.datestamp) {
          request.data();
        } else if (timestamp[0] * 1 < date.getHours() && timestamp[1] * 1 < minutes.substr(-2)) {
          request.data();
        } else {
          section.renderInitial(weatherData);
        }
      }
    },
    filter() {
      const weatherData = JSON.parse(localStorage.getItem('weatherData'));
      const filteredData = [];
      document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        if (checkbox.checked) {
          checkbox.name === 'Partly Cloudy'
          ? filteredData.push(weatherData.hourly.filter((d) => d.condition.includes('Cloudy')))
          : filteredData.push(weatherData.hourly.filter((d) => d.condition === checkbox.name));
        }
      });
      filteredData.length === 0 ? section.renderFiltered(weatherData.hourly) : section.renderFiltered([].concat.apply([], filteredData));
    },
    data(data) {
      localStorage.setItem('weatherData', JSON.stringify(data));
      this.hydrate();
    }
  };

  const request = {
    data() {
      const apiData = {};
      const date = new Date();
      const minutes = '0' + date.getMinutes();
      const seconds = '0' + date.getSeconds();
      const month = '0' + date.getMonth();
      const formattedTime = `${date.getHours()}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
      const formattedDate = `${date.getDate()}-${month.substr(-2)}-${date.getFullYear()}`;
      apiData.datestamp = formattedDate;
      apiData.timestamp = formattedTime;
      Promise.all([this.get('conditions'), this.get('hourly')])
        .then(function(results) {
          apiData.current = results[0].current_observation;
          apiData.hourly = results[1].hourly_forecast;
          store.data(apiData);
        })
        .catch(section.renderError());
    },
    get(type) {
      const promise = new Promise(function(resolve) {
        aja()
        .url(appSettings.url(type))
        .on('success', function(data){
          resolve(data);
        })
        .go();
      });
      return promise;
    }
  };

  app.init();
})();
