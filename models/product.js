var mongoose = require('mongoose')
var Schema = mongoose.Schema

var product = new Schema({
    'name': {type: String},
    'type': {type: String},
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var Product = mongoose.model('product', product)

module.exports = Product
