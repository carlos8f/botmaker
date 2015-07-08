module.exports = function (app) {
  var conf = app.conf.twitter_settings

  app.on('tweet', function (tweet) {
    console.log('@' + tweet.user.screen_name + ': ' + tweet.text)
  })
}
