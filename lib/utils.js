module.exports = function (app) {
  app.load = function (m, p) {
    if (!p) p = './' + m
    p = p.replace(/__/g, '/')
    app[m] = require(p)(app)
  }
}
