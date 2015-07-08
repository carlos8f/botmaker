module.exports = function (app) {
  app.load = function (m, p) {
    if (!p) p = './lib/' + m
    console.log('require', p, 'for', m)
    app[m] = require(p)(app)
  }
}
