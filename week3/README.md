## Week 3
In the third week we will have the following exercises:
- [x] Give feedback to users
- [x] README with features, usage, wishlist and sources
- [x] Flow Diagram
- [ ] Interaction Diagram
- [x] Filter, map, sort
- [x] Refactor
- [ ] PubSub pattern (extra)
- [ ] Code review

### Deploying
Get an API key at [weather underground](https://www.wunderground.com) and put this in `config.js`.
```
touch config.js && vim config.js

var config = {
  API_KEY: ${YOUR_API_KEY}
};
```
Import this file in your html before the `main.js` file.

### Actor diagram of the app
![diagram](./week3-flow-diagram.png)
