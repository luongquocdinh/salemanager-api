var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var argv = require('optimist').argv
var app = express()
var cors = require('cors')
var customer = require('./../routes/customer')
var product = require('./../routes/product')
var productType = require('./../routes/productType')
var sale = require('./../routes/sale')
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

app.use('/customer', customer)
app.use('/product', product)
app.use('/sale', sale)
app.use('/productType', productType)

module.exports = app
