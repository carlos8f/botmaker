// return a twitter client

var Twitter = require('twitter')

module.exports = function (app) {
  var conf = app.conf.twitter_settings

  // load optional modules
  if (conf.enable_console) app.load('twitter__console')
  if (conf.enable_filter) app.load('twitter__filter')
  if (conf.enable_mentions) app.load('twitter__mentions')
  if (conf.enable_user) app.load('twitter__user')

  // return twitter client
  return new Twitter(conf.auth)
}
