var mongoose = require('mongoose')
var Schema = mongoose.Schema

var customer = new Schema({
    'name': {type: String},
    'phone': {type: String},
    'email': {type: String},
    'address': {type: String},

    "is_enable": {type: Boolean, default: true},
    "is_delete": {type: Boolean, default: false},

    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var Customer = mongoose.model('customer', customer)

module.exports = Customer
