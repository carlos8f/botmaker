var moment = require('moment')

module.exports = function (app) {
  var conf = app.conf.twitter_settings

  require('colors')

  app.on('tweet', function (tweet) {
    var date = moment().format('h:mm:ss a')
    var label = ''
    if (tweet.is_mention) label = 'is_mention! '.red
    else if (tweet.is_filtered) label = 'is_filtered! '.red

    var tweet_text = tweet.text.replace(/\n/g, '  ').grey
    app.conf.twitter_settings.keywords.forEach(function (keyword) {
      tweet_text = tweet_text.replace(new RegExp(keyword, 'i'), function (str, p1, offset, s) {
        return str.red
      })
    })

    console.log(('[' + date + '] ').grey + '@'.red + tweet.user.screen_name.green + ' (' + tweet.user.name.yellow + '): ' + label + ' ' + tweet_text)
  })

  app.on('user', function (user) {
    var date = moment().format('h:mm:ss a')
    var label = ''
    if (user.is_mention) label = 'is_mention! '.red
    else if (user.is_follower) label = 'is_follower! '.red
    else return
    console.log(('[' + date + '] ').grey + '@'.yellow + user.screen_name.green + ' (' + user.name.yellow + '): ' + label + ' ' + (user.description || 'n/a/').grey)
  })
}
