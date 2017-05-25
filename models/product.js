var mongoose = require('mongoose')
var Schema = mongoose.Schema

var product = new Schema({
    'name': {type: String},
    'typeId': {type: String},
    'price': {type: Number},
    'bonus': {type: Number},
    'is_active': {type: Boolean},
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var Product = mongoose.model('product', product)

module.exports = Product
