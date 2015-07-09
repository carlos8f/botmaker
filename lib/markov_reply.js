var markov = require('markov')

module.exports = function (app) {
  var m = markov(1)
  app.load('twitter')

  app.on('tweet', function (tweet) {
    if (tweet.is_mention) {
      m.seed(tweet.text, function () {
        app.twitter.post('statuses/update', {
          status: '@' + tweet.user.screen_name + ' ' + m.respond(tweet.text, 120).join(' '),
          in_reply_to_status_id: tweet.id
        }, function (err) {
          if (err) return app.emit('error', err, 'markov fatal')
        })
      })
    }
  })

  return m
}