/*global document, aja, Handlebars*/
(function(){
  // set variables
  const appSettings = {
    main: document.querySelector('main'),
    template: Handlebars.compile(document.querySelector('#template').innerHTML),
    url: 'http://api.wunderground.com/api/7f0aee996268ea76/hourly10day/q/autoip.json',
    html: ''
  };

  // render data
  var render = function (data) {
    data.hourly_forecast.forEach(function (item) {
      appSettings.html = appSettings.template(item);
      appSettings.main.innerHTML += appSettings.html;
    });
  };

  // get data
  aja()
  .url(appSettings.url)
  .on('success', function(data){
     render(data);
  })
  .go();

})();
