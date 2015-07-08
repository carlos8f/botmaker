module.exports = function (app) {
  var conf = app.conf.twitter_settings

  // on the user timeline
  app.on('tweet', function (tweet) {
    console.log('[home] @' + tweet.user.screen_name + ': ' + tweet.text)
  })
  // public tweet
  app.on('filtered tweet', function (tweet) {
    console.log('[' + app.conf.twitter_settings.keywords.join(',') + '] @' + tweet.user.screen_name + ': ' + tweet.text)
  })
  app.on('mentioned tweet', function (tweet) {
    console.log('[mentioned] @' + tweet.user.screen_name + ': ' + tweet.text)
  })
}
