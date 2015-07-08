module.exports = function (app) {
  app.load('tweets')
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
        console.error('home_timeline error!!!')
        console.error(JSON.stringify(err, null, 2))
      })
    })
  })
}
