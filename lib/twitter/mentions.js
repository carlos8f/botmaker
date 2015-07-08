module.exports = function (app) {
  var times = 0

  function checkMentions () {
    app.twitter.get('statuses/mentions_timeline', {
      contributor_details: 'true'
    }, function (err, tweets) {
      if (err) {
        console.error('mentions_timeline error!!!')
        console.error(JSON.stringify(err, null, 2))
        return
      }
      var ids = tweets.map(function (tweet) {
        return tweet.id_str
      })
      console.log('mentions!!!', times++, ids)
      setTimeout(checkMentions, 60000)
    })
  }

  app.on('load', checkMentions)
}
