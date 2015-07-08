var moment = require('moment')

module.exports = function (app) {
  var conf = app.conf.twitter_settings

  require('colors')

  app.on('tweet', function (tweet) {
    var date = moment().format('h:mm:ss a')
    var label = ''
    if (tweet.is_mention) label = 'is_mention! '.blue
    else if (tweet.is_filtered) label = 'is_filtered! '.yellow
    console.log(label + '[' + date + '] '.grey + '@'.red + tweet.user.screen_name.green + ' (' + tweet.user.name.yellow + '): ' + tweet.text.grey)
  })

  app.on('user', function (user) {
    var date = moment().format('h:mm:ss a')
    var label = ''
    if (user.is_mention) return
    else if (user.is_follower) label = 'is_follower! '.orange
    console.log(label + '[' + date + '] '.grey + '@'.yellow + user.screen_name.green + ' (' + user.name.yellow + '): ' + user.description.grey)
  })
}
