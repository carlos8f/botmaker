module.exports = function (app) {
  function checkMentions () {
    app.twitter.get('statuses/mentions_timeline', {
      contributor_details: 'true'
    }, function (err, tweets) {
      if (err) {
        console.error('mentions_timeline error!!!')
        console.error(JSON.stringify(err, null, 2))
        return
      }
      tweets = tweets.map(function (tweet) {
        tweet.is_mention = true
      })
      app.tweets.maybeStore(tweets)
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
