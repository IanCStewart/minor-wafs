## Week 2
In the third week we will have the following exercises:
- [ ] Give feedback to users
- [ ] README with features, usage, wishlist and sources
- [x] Flow Diagram
- [ ] Interaction Diagram
- [ ] Filter, map, sort
- [ ] Refactor to modules
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
![diagram](https://github.com/IanCStewart/minor-wafs/blob/week3/week3/week3-flow-diagram.png)
