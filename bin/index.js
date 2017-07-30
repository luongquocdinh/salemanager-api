var http = require('http')
var app = require('./../src/app')
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');
var server = http.createServer(app)

var boot = function () {
  server.listen(app.get('port'), function () {
    console.info('Express server listening on port ' + app.get('port'))
  })
  mongoose.connect('mongodb://heroku_b2bz9ldg:e2jml2cku1ooake26hv0u94vnf@ds149481.mlab.com:49481/heroku_b2bz9ldg', function (err, result) {
    if (err) return console.log(err)
    console.log('Connect database successful')
  })
}

var shutdown = function () {
  server.close()
}
if (require.main === module) {
  boot()
} else {
  console.info('Running app as module')
  exports.boot = boot
  exports.shutdown = shutdown
  exports.port = app.get('port')
}


// echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
