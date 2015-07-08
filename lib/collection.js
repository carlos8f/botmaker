// returns a modeler collection

var modeler = require('modeler-redis')

module.exports = function (app) {
  app.load('redis')
  return function (_opts) {
    _opts || (_opts = {})
    _opts.client = app.redis
    _opts.prefix || (_opts.prefix = '')
    return modeler(_opts)
  }
}
