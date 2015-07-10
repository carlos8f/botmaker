module.exports = function (app) {
  // create a modeler collection for users
  app.load('collection')
  var self = app.collection({name: 'users'})

  // maybe store a user if not already in the db.
  // trigger a 'user' app event if we have not
  // seen this user before.
  self.maybeStore = function (users, cb) {
    if (!Array.isArray(users)) users = [users]
    var latch = users.length, errored = false
    if (!latch) return cb && cb()

    users.forEach(function (user) {
      if (!user || !user.id_str) {
        if (!--latch) return cb && cb()
        return
      }
      self.load(user.id || user, function (err, existing) {
        if (err) return cb && (err)
        if (existing && !user.is_follower) {
          if (!--latch) return cb && cb()
          return
        }
        self.create(user, function (err) {
          if (err && err.code !== 'REV_CONFLICT') {
            return app.emit('error', err, 'create user')
          }
          app.emit('user', user)
          if (!--latch) return cb && cb()
        })
      })
    })
  }

  // return modeler collection + addons
  return self
}
