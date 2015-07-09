module.exports = function (app) {
  var conf = app.conf.twitter_settings
  app.load('twitter')

  var backoff = 30000

  app.on('load', function () {
    app.twitter.stream('statuses/filter', {
      track: conf.keywords.join(','),
      'with': 'followings',
      replies: 'all'
    },  function (stream) {
      stream.on('data', function (tweet) {
        tweet.is_filtered = true
        app.tweets.maybeStore(tweet)
        tweet.user.is_filtered = true
        app.users.maybeStore(tweet.user)
        backoff = 30000
      })

      stream.on('error', function (err) {
        if (err && err.source === 'Exceeded connection limit for user') {
          backoff *= 2
          console.error('Exceeded connection limit for user. Backing off ' + backoff)
          setTimeout(function () {
            app.emit('load')
          }, backoff)
          return
        }
        app.emit('error', err, 'statuses/filter')
      })

      console.log('now streaming keywords', conf.keywords.join(','))
    })
  })
  console.log('loaded filter module')
}
