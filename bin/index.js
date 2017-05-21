var http = require('http')
var app = require('./../src/app')
var mongoose = require('mongoose')
var server = http.createServer(app)

var boot = function () {
  server.listen(app.get('port'), function () {
    console.info('Express server listening on port ' + app.get('port'))
  })
  mongoose.connect('mongodb://localhost:27017/commercial', function (err, result) {
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
