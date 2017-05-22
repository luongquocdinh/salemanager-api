var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var argv = require('optimist').argv
var app = express()
var cors = require('cors')
var routes = require('./../routes/index')
var customer = require('./../routes/customer')
var productType = require('./../routes/productType')
var product = require('./../routes/product')
let path = require('path')

var conf = {
  port: process.env.PORT || 3000
}

app.set('port', conf.port)
app.use(cors())

app.use(cookieParser())
app.use(express.query())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.use('/', routes)
app.use('/customer', customer)
app.use('/productType', productType)
app.use('/product', product)

module.exports = app
