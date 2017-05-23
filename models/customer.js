var mongoose = require('mongoose')
var Schema = mongoose.Schema

var customer = new Schema({
    'name': {type: String},
    'phone': {type: String},
    'is_sale': {type: String, default: false},
    'saleId': {type: String, default: null},
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var Customer = mongoose.model('customer', customer)

module.exports = Customer
