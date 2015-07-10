var markov = require('markov')

module.exports = function (app) {
  var m = markov(3)
  app.load('twitter')
  var fullText = ''

  app.on('tweet', function (tweet) {
    if (!tweet.text) return
    fullText += ' ' + tweet.text
    if (tweet.is_mention) {
      m.seed(fullText, function () {
        var words = m.respond(tweet.text, 4)
        var status = '@' + tweet.user.screen_name + ' '
        words.forEach(function (word) {
          if (status + ' ' + word >= 140) return
          status += ' ' + word
        })
        var handles = []
        status = status.replace(/([a-z0-9A-Z\?\!]+)?@([a-z0-9A-Z]+)/g, function (match, p1, p2, offset, string) {
          if (handles.indexOf(p2) !== -1) return ''
          if (p2 === app.conf.twitter_settings.screen_name) return ''
          console.log('handle: ', p2)
          handles.push(p2)
          if (p1) return p1 + ' @' + p2
          else return '@' + p2
        })
        status = status.replace(/\s+/g, ' ')
        app.twitter.post('statuses/update', {
          status: status,
          in_reply_to_status_id: tweet.id
        }, function (err) {
          if (err) return app.emit('error', err, 'markov fatal')
        })
      })
    }
    else {
      // seed with tweet content
      m.seed(fullText)
    }
  })

  return m
}