module.exports = function (app) {
  // create a modeler collection for tweets
  app.load('collection')
  var self = app.collection({name: 'tweets'})

  // maybe store a tweet if not already in the db.
  // trigger a 'tweet' app event if we have not
  // seen this tweet before.
  self.maybeStore = function (tweets, cb) {
    if (!Array.isArray(tweets)) tweets = [tweets]
    var latch = tweets.length, errored = false
    if (!latch) return cb && cb()

    tweets.forEach(function (tweet) {
      self.load(tweet.id || tweet, function (err, existing) {
        if (err) return cb && (err)
        if (existing) {
          if (!--latch) return cb && cb()
          return
        }
        self.create(tweet, function (err, tweet) {
          if (err) {
            return app.emit('error', err, 'create tweet')
          }
          app.emit('tweet', tweet)
          if (!--latch) return cb && cb()
        })
      })
    })
  }

  // return modeler collection + addons
  return self
}
