## Week 2
In the second week we will have the following exercises:
- [x] Get data with AJAX (ended up using aja.js)
- [x] Implement Routing (ended up using vannilla-js)
- [x] Implement Templating engine (ended up using Handlebar.js)
- [x] Manipulate data (map, filter, reduce)
- [x] Code Review classmates
- [ ] Implement Web Worker (extra)

### Diagram of the app
![week 2 diagram](./week2-diagram.png)

### Deploying
Get an API key at [weather underground](https://www.wunderground.com) and put this in `config.js`.
```
touch config.js && vim config.js

var config = {
  API_KEY: ${YOUR_API_KEY}
};
```
Import this file in your html before the `main.js` file.

#### Links to assignments
- [Web app](https://github.com/IanCStewart/minor-wafs)
- Code Review classmates [review 1](https://github.com/rijkvanzanten/minor-wafs/pull/7)
