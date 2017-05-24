var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productType = new Schema({
    'name': {type: String},
    'is_active': {type: Boolean},
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var ProductType = mongoose.model('productType', productType)

module.exports = ProductType
