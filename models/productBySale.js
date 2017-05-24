var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productBySale = new Schema({
    'productId': {type: String},
    'SaleId': {type: String},
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var ProductBySale = mongoose.model('productBySale', productBySale)

module.exports = ProductBySale
