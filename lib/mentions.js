module.exports = function (app) {
  app.load('twitter')
  var first_run = true
    , init_tweets = []

  function checkMentions () {
    app.twitter.get('statuses/mentions_timeline', {
      contributor_details: 'true'
    }, function (err, tweets) {
      if (err) {
        return app.emit('error', err, 'statuses/mentions_timeline')
      }
      var users = []
      tweets = tweets.map(function (tweet) {
        if (!first_run) {
          tweet.is_mention = true
          tweet.user.is_mention = true
          users.push(tweet.user)
        }
        return tweet
      })
      
      if (first_run) {
        init_tweets = tweets.map(function (tweet) {
          return tweet.id_str
        })
      }
      else {
        tweets = tweets.filter(function (tweet) {
          return !~init_tweets.indexOf(tweet.id_str)
        })
      }
      first_run = false
      app.tweets.maybeStore(tweets)
      app.users.maybeStore(users)
    })
    setTimeout(checkMentions, 60000)
  }

  app.on('tweet', function (tweet) {
    if (tweet.is_mention) {
      app.twitter.post('friendships/create', {user_id: tweet.user.id}, function (err) {
        // can't follow yourself!
        if (err && Array.isArray(err) && err[0].code === 158) return
        if (err) return app.emit('error', err, 'follow mention')
        console.log('followed mentioned user', tweet.user.screen_name)
        app.twitter.post('statuses/retweet/' + tweet.id_str, function (err) {
          if (err && Array.isArray(err) && err[0].code === 327) err = null;
          if (err) return app.emit('error', err, 'retweet mention')
          console.log('retweeted mentioned user', tweet.user.screen_name)
          // @todo: deal with mention
          // 3. parse for command
          // 4. execute cmd or reply with markov
        })
      })
    }
  })

  app.on('load', checkMentions)

  console.log('loaded mentions module')
}
