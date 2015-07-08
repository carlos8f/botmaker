module.exports = function (app) {
  var conf = app.conf.twitter_settings
  app.load('twitter')

  app.on('load', function () {
    app.twitter.stream('statuses/filter', {
      track: conf.keywords.join(','),
      'with': 'followings',
      replies: 'all'
    },  function (stream) {
      stream.on('data', function (tweet) {
        tweet.is_filtered = true
        app.tweets.maybeStore(tweet)
      })

      stream.on('error', function (err) {
        app.emit('error', err, 'statuses/filter')
      })
    })
  })
}
