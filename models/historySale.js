var mongoose = require('mongoose')
var Schema = mongoose.Schema

var historySale = new Schema({
    "saleDate": {type: Date},
    "leadCode": {type: Number},
    "saleCode": {type: Number},
    "customer": {type: String},
    "productName": {type: String},
    "price": {type: Number},
    "bonus": {type: Number},
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var HistorySale = mongoose.model('historySale', historySale)

module.exports = HistorySale
