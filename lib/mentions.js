module.exports = function (app) {
  app.load('twitter')

  function checkMentions () {
    app.twitter.get('statuses/mentions_timeline', {
      contributor_details: 'true'
    }, function (err, tweets) {
      if (err) {
        return app.emit('error', err, 'statuses/mentions_timeline')
      }
      var users = []
      tweets = tweets.map(function (tweet) {
        tweet.is_mention = true
        tweet.user.is_mention = true
        users.push(tweet.user)
        return tweet
      })
      app.tweets.maybeStore(tweets)
      app.users.maybeStore(users)
    })
    setTimeout(checkMentions, 60000)
  }

  app.on('tweet', function (tweet) {
    if (tweet.is_mention) {
      // @todo: deal with mention
      // 1. follow remote user
      // 2. retweet their tweet
      // 3. parse for command
      // 4. execute cmd or reply with markov
    }
  })

  app.on('load', checkMentions)
}
