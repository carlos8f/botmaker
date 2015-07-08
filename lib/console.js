var moment = require('moment')

module.exports = function (app) {
  var conf = app.conf.twitter_settings

  require('colors')

  app.on('tweet', function (tweet) {
    var date = moment().format('h:mm:ss a')
    console.log('[' + date + '] '.grey + '@'.red + tweet.user.screen_name.green + ': '.white + tweet.text.grey)
  })
}
