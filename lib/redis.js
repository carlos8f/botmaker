// return a redis client

var modeler = require('modeler-redis')
  , redis = require('redis')

module.exports = function (app) {
  var conf = app.conf.redis || {}
  var port = conf.port || 6379
  var host = conf.host || 'localhost'
  return redis.createClient(conf.port, conf.host, conf)
}
