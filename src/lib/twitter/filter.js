module.exports = function (app) {
  var conf = app.conf.twitter_settings

  app.twitter.stream('statuses/filter', {
    track: conf.keywords.join(','),
    'with': 'followings',
    replies: 'all'
  },  function (stream) {
    stream.on('data', function (tweet) {
      app.emit('filtered tweet', tweet)
    })

    stream.on('error', function (err) {
      console.error('twitter_filter error!!!');
      console.error(JSON.stringify(err, null, 2))
    })
  })
}
