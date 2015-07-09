module.exports = function (app) {
  app.on('load', function () {
    app.twitter.stream('user', {
      replies: 'all',
      'with': 'followings'
    },  function (stream) {
      stream.on('data', app.tweets.maybeStore)

      stream.on('error', function (err) {
        if (err.source && err.source.friends) {
          return
        }
        return app.emit('error', err, 'user stream')
      })
      console.log('now streaming tweets...')
    })
  })

  app.on('user', function (user) {
    // deal with new user
    // 1. follow them?
    // 2. dm if mutual connection
  })

  console.log('loaded user module')
}
