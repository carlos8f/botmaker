var fs = require('fs')
  , m = require('markov')(4)
  , path = require('path')
  , yaml = require('js-yaml')
  , EE = require('events').EventEmitter

require('colors')

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
  var lastTweet, fullText = ''
  app.tweets.list({load: true}, function (err, chunk, getNext) {
    if (err) throw err
    chunk.sort(function (a, b) {
      if (Math.random() >= 0.5) return -1
      return 1
    })
    chunk.forEach(function (tweet) {
      fullText += ' ' + (tweet.text || '')
      lastTweet = tweet.text || ''
    })
    if (chunk.length) {
      getNext()
    }
    else {
      m.seed(fullText)
      var response = m.respond(lastTweet || 'This is a fake tweet', 4)
      var outputLen = 140, output = ''
      response.forEach(function (word) {
        if ((output + ' ' + word).length >= outputLen) return
        output += ' ' + word
      })
      var handles = []
      output = output.replace(/([a-z0-9A-Z\?\!]+)?@([a-z0-9A-Z]+)/g, function (match, p1, p2, offset, string) {
        if (handles.indexOf(p2) !== -1) return ''
        console.log('handle: ', p2)
        handles.push(p2)
        if (p1) return p1 + ' @' + p2
        else return '@' + p2
      })
      output = output.replace(/\s+/g, ' ')
      if (Math.random() > 0.85) punc = '! :D'
      else punc = '.'
      output = output.trim() + punc
      console.log(output)
      app.load('twitter')
      app.twitter.post('statuses/update', {status: output}, function (err, tweet) {
        if (err) {
          return app.emit('error', err, 'tweet error')
        }
        console.log('tweet posted.'.yellow)
        process.exit()
      })
    }
  })
})

module.exports = app
