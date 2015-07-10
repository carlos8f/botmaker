module.exports = function (app) {
  app.load('twitter')

  var backoff = 30000

  function checkFollowers () {
    app.twitter.get('followers/list', {
      skip_status: 'true',
      include_user_entities: 'false'
    }, function (err, data) {
      if (err) {
        if (err && Array.isArray(err) && err[0].code === 88) {
          backoff *= 2
          return setTimeout(checkFollowers, backoff)
        }
        return app.emit('error', err, 'followers/list')
      }
      backoff = 30000
      data.users = data.users.map(function (user) {
        user.is_follower = true
        return user
      })
      // console.log('followers', data.users)
      app.users.maybeStore(data.users)
    })
    setTimeout(checkFollowers, 60000)
  }

  app.on('user', function (user) {
    if (user.is_follower) {
      app.twitter.post('friendships/create', {user_id: user.id_str}, function (err) {
        if (err) {
          return app.emit('error', err, 'followers friendships/create')
        }
        console.log('friended @' + user.screen_name);
      })
    }
  })

  app.on('load', checkFollowers)
}
