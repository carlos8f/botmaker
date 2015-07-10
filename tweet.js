var fs = require('fs')
  , m = require('markov')(3)
  , path = require('path')
  , yaml = require('js-yaml')
  , EE = require('events').EventEmitter

// read the conf
var conf_path = path.resolve(__dirname, 'bot.yml')
var conf_raw = fs.readFileSync(conf_path)
var conf_parsed = yaml.safeLoad(conf_raw)

// create the app as an event emitter
var app = new EE
app.setMaxListeners(0)
app.root = __dirname
app.conf = conf_parsed

// turn off twitter modules
app.conf.modules.mentions =
  app.conf.modules.user =
  app.conf.modules.filter =
    false

// bolt on the loader
require('./lib/utils')(app)

// load modules from conf
// load modules specified in conf
Object.keys(app.conf.modules).forEach(function (m) {
  if (app.conf.modules[m]) {
    app.load(m)
  }
})

app.on('error', function (err, label) {
  console.error(label, 'error!!!');
  console.error(JSON.stringify(err, null, 2))
  throw new Error(label + ' fatal')
})

app.once('load', function () {
  var data = {tweets: [], users: []}
  var lastTweet
  app.tweets.list({load: true}, function (err, chunk, getNext) {
    if (err) throw err
    chunk.forEach(function (tweet) {
      m.seed(tweet.text || '')
      lastTweet = tweet.text || ''
    })
    if (chunk.length) {
      getNext()
    }
    else {
      var response = m.respond(lastTweet || 'This is a fake tweet', 140)
      console.log(response.join(' '))
      process.exit()
    }
  })
})

module.exports = app
