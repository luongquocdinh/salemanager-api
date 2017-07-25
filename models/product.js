var mongoose = require('mongoose')
var Schema = mongoose.Schema

var product = new Schema({
    'typeId': {type: String},

    'name': {type: String},
    'price': {type: Number},
    'price_sold': {type: Number},
    'commission': {type: Number},
    "size": {type: String},
    "color": {type: String},
    "max_discount_si": {type: Number},
    "max_discount_le": {type: Number},
    "bonus": {type: Number},
    "bonus_si": {type: Number},
    "bonus_coefficient": {type: Number},
    
    "is_enable": {type: Boolean, default: true},
    "is_delete": {type: Boolean, default: false},

    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var Product = mongoose.model('product', product)

module.exports = Product
