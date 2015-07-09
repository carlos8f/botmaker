// external modules
var fs = require('fs')
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

// bolt on the loader
require('./lib/utils')(app)

// load modules from conf
app.on('load', function () {
  // load modules specified in conf
  Object.keys(app.conf.modules).forEach(function (m) {
    if (app.conf.modules[m]) {
      app.load(m)
    }
  })
})

app.on('error', function (err, label) {
  console.error(label, 'error!!!');
  console.error(JSON.stringify(err, null, 2))
  throw new Error(label + ' fatal')
})

module.exports = app
