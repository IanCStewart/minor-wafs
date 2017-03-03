# Web App From Scratch
_This is a Repo for the course Web App From Scratch. I have made a web app on the Weather Underground API_

## The app
The app is a single page web app (SPA) that shows the current and hourly weather by your location. I mainly built this to experiment with SPA’s and API calls. Besides that I’m looking into building a weather dashboard for a company someday so this will be the first steps to that as well.

### Diagrams
#### Actor diagram
![actor diagram](./week3/week3-actor-diagram.png)

#### Flow diagram
![flow diagram]()

### Developing
Get an API key at [weather underground](https://www.wunderground.com) and put this in `config.js`.
```
touch config.js && vim config.js

var config = {
  API_KEY: ${YOUR_API_KEY}
};
```
Import this file in your html before the `main.js` file.

## Usage
By browsing to the `index.html` file u can start using the app. The user can then see the current weather. By browsing to the hourly section the user will be able to see the hourly forecast. Here the user can filter weather data .

## Resources
- [Weather Underground](https://www.wunderground.com)
- [Aja()]()
- [Handlebars()]()
- [Mozilla Developers Network}()

## Wishlist
- Implement web worker
- Automatic update on new weather data
- Loader (loading spinner during start-up)
- Handle API call without Aja()
- Handle tempting without Handlebars()

## Link to web app
Here is the link to my [weather SPA](iancstewart.github.io/wafs).
