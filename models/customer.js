var mongoose = require('mongoose')
var Schema = mongoose.Schema

var customer = new Schema({
    'name': {type: String},
    'phone': {type: String},
    'is_sale': {type: Boolean, default: false},
    'saleId': {type: Number, default: null},
    'listProduct': [{
        'productId': {type: String},
        'name': {type: String},
        'price': {type: String},
        'bonus': {type: String}
    }],
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var Customer = mongoose.model('customer', customer)

module.exports = Customer
