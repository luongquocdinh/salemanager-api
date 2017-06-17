var mongoose = require('mongoose')
var Schema = mongoose.Schema

var historySale = new Schema({
    "date": {type: Date}, // date
    "lead": {type: String}, // lead
    "phone": {type: String}, // phone
    "productName": {type: String}, // product
    "status": {type: Number}, // status
    "next_action": {type: String}, //next_action
    "note": {type: String}, // note
    "price": {type: Number}, // price
    "saleId":{type: Number}, // sale
    "sold_price": {type: Number}, // sold price
    "bonus": {type: Number}, // commision
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var HistorySale = mongoose.model('historySale', historySale)

module.exports = HistorySale
