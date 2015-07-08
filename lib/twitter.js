// return a twitter client

var Twitter = require('twitter')

module.exports = function (app) {
  var conf = app.conf.twitter_settings
  app.load('tweets')

  // return twitter client
  return new Twitter(conf.auth)
}
