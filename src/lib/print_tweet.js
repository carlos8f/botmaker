module.exports = function (app) {
  app.on('tweet', function (tweet) {
    console.log('@' + tweet.user.screen_name + ': ' + tweet.text)
  })
}