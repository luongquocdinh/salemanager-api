var mongoose = require('mongoose')
var Schema = mongoose.Schema

var sale = new Schema({
    'name': {type: String},
    'password': {type: String},
    'saleCode': {type: String},
    'is_active': {type: Boolean, default: true},
    'is_enable': {type: Boolean, default: true},
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var Sale = mongoose.model('sale', sale)

module.exports = Sale
