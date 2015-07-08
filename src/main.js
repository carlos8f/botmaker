var fs = require('fs')
  , path = require('path')
  , yaml = require('js-yaml')
  , EE = require('events').EventEmitter

var conf_path = path.resolve(__dirname, 'bot.yml')
var conf_raw = fs.readFileSync(conf_path)
var conf_parsed = yaml.safeLoad(conf_raw)

var app = new EE
app.setMaxListeners(0)
app.conf = conf_parsed

Object.keys(app.conf.modules).forEach(function (m) {
  if (app.conf.modules[m]) {
    app[m] = require('./lib/' + m + '.js')(app)
  }
})

app.emit('load')
