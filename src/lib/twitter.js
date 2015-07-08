var Twitter = require('twitter')

module.exports = function (app) {
  var conf = app.conf.twitter_settings
  var tw = new Twitter(conf.auth)

  tw.stream('user', {replies: 'all', 'with': 'followings'},  function (stream) {
    stream.on('data', function (tweet) {
      app.emit('user tweet', tweet)
    })

    stream.on('error', function (err) {
      if (err.source && err.source.friends) return;
      console.error(JSON.stringify(err, null, 2))
    })
  })

  if (conf.keywords) {
    tw.stream('statuses/filter', {
      track: conf.keywords.join(','),
      'with': 'followings',
      replies: 'all'
    },  function (stream) {
      stream.on('data', function (tweet) {
        app.emit('filter tweet', tweet)
      })

      stream.on('error', function (err) {
        if (err.source && err.source.friends) return;
        console.error(JSON.stringify(err, null, 2))
      })
    })
  }

  tw.stream('statuses/mentions_timeline', function (stream) {
    stream.on('data', function (tweet) {
      app.emit('mentions tweet', tweet)
    })

    stream.on('error', function (err) {
      if (err.source && err.source.friends) return;
      console.error(JSON.stringify(err, null, 2))
    })
  })

  if (conf.debug_tweets) {
    conf.debug_tweets.forEach(function (tweet_id) {
      tw.get('statuses/show/' + tweet_id, function (err, tweet) {
        if (err) return console.error(JSON.stringify(err, null, 2))
        console.log('tweet', JSON.stringify(tweet, null, 2))
      })
    })
  }

  return tw
}
