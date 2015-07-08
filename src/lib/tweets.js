module.exports = function (app) {
  // create a modeler collection for tweets
  app.load('collection')
  var tweets = app.collection({name: 'tweets'})

  // maybe store a tweet if not already in the db.
  tweets.maybeStore = function (tweet, cb) {
    tweets.load(tweet.id_str, function (err, tweet) {
      if (err) return cb(err)
      if (tweet) return cb()
      tweets.create(tweet, cb)
    })
  }

  // return modeler collection + addons
  return tweets
}
