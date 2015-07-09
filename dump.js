var app = require('./main')
  , fs = require('fs')

app.conf.twitter_settings.enable_filter =
  app.conf.twitter_settings.enable_mentions =
  app.conf.twitter_settings.enable_user =
    false

app.once('load', function () {
  var data = {tweets: [], users: []}
  app.tweets.list({load: true}, function (err, chunk, getNext) {
    if (err) throw err
    data.tweets = data.tweets.concat(chunk)
    if (chunk.length && getNext) getNext()
    else {
      app.users.list({load: true}, function (err, chunk, getNext) {
        if (err) throw err
        data.users = data.users.concat(chunk)
        if (chunk.length && getNext) getNext()
        else {
          fs.writeFileSync('./dump.json', JSON.stringify(data, null, 2))
          console.log('wrote ./dump.json')
          process.exit()
        }
      })
    }
  })
})
