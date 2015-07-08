module.exports = function (app) {
  app.load('twitter')

  function checkFollowers () {
    app.twitter.get('followers/list', {
      skip_status: 'true',
      include_user_entities: 'false'
    }, function (err, users) {
      if (err) {
        return app.emit('error', err, 'followers/list')
      }
      users = users.map(function (user) {
        user.is_follower = true
        return user
      })
      console.log('followers', users)
      app.users.maybeStore(users)
    })
    setTimeout(checkMentions, 60000)
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
