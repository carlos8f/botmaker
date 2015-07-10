module.exports = function (app) {
  app.on('load', function () {
    app.twitter.stream('user', {
      replies: 'all',
      'with': 'followings'
    },  function (stream) {
      stream.on('data', function (tweet) {
        if (!tweet || tweet.friends) return
        tweet.is_user = true
        app.tweets.maybeStore(tweet)
      })

      stream.on('error', function (err) {
        if (err.source && err.source.friends) {
          return
        }
        return app.emit('error', err, 'user stream')
      })
      console.log('now streaming tweets...')
    })
  })

  var conf = app.conf.twitter_settings
  app.on('tweet', function (tweet) {
    if (conf.user_favorite_rate && Math.random() <= conf.user_favorite_rate) {
      app.twitter.post('favorites/create', {id: tweet.id_str}, function (err) {
        if (err) {
          if (Array.isArray(err) && err[0].code === 88) {
            // rate limit exceeded
            return
          }
          return app.emit('error', err, 'favorites/create')
        }
        app.emit('favorite', tweet)
      })
    }
  })

  console.log('loaded user module')
}
