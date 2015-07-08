module.exports = function (app) {
  app.load = function (m, p) {
    if (!p) p = './' + m
    try {
      app[m] = require(p)(app)
    }
    catch (e) {
      app[m] = require(p.replace(/__/g, '/'))(app)
    }
  }
}
