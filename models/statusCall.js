var mongoose = require('mongoose')
var Schema = mongoose.Schema

var statusCall = new Schema({
    "saleId": {type: Number},
    "customerId": {type: String},
    "countCall": {type: String},
    "callDate": {type: Array},
    "isWin": {type: Boolean},
    "status": {type: String},
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

var StatusCall = mongoose.model('statusCall', statusCall)

module.exports = StatusCall
