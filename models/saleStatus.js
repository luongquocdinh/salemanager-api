var mongoose = require('mongoose')
var Schema = mongoose.Schema

var saleStatus = new Schema({
    'customerId': {type: String},
    'saleId': {type: Number},
    "created_date": { type: Date, default: Date.now() },
    "updated_date": { type: Date, default: Date.now() }
},
{ versionKey: false })

var SaleStatus = mongoose.model('saleStatus', saleStatus)

module.exports = SaleStatus
