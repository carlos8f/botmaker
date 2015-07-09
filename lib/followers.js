module.exports = function (app) {
  app.load('twitter')

  var backoff = 30000

  function checkFollowers () {
    app.twitter.get('followers/list', {
      skip_status: 'true',
      include_user_entities: 'false'
    }, function (err, users) {
      if (err) {
        if (err && Array.isArray(err) && err[0].code === 88) {
          backoff *= 2
          return setTimeout(checkFollowers, backoff)
        }
        return app.emit('error', err, 'followers/list')
      }
      backoff = 30000
      users = users.map(function (user) {
        user.is_follower = true
        return user
      })
      console.log('followers', users)
      app.users.maybeStore(users)
    })
    setTimeout(checkFollowers, 60000)
  }

  app.on('user', function (user) {
    if (user.is_follower) {
      // @todo: deal with follower
      // 1. follow back
      // 2. retweet/favorite their last tweet?
      // 3. DM them if mutual?
    }
  })

  app.on('load', checkFollowers)
}
