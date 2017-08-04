let mongoose = require('mongoose')
let Schema = mongoose.Schema

let order = new Schema({
    "idSale": {type: Number, index: true},
    "idCustomer": {type: String, index: true},
    "status": {type: Number},
    "nextAction": {type: Number},
    "note": [
        {
            "description": {type: String},
            "created_date": { type: Date, default: Date.now() },
        }
    ],
    "details": [
        {
            "idProduct": {type: String, index: true},
			"price": {type: Number},
            "quantity": {type: Number},
            "type": {type: Number},
			"bonus": {type: Number},
			"total": {type: Number},
			"is_enable": {type: Boolean, default: true},
            "is_delete": {type: Boolean, default: false},
            "date": {type: Number},
            "updated_date"    : { type: Date, default: Date.now() }
        }
    ],
    "is_check": {type: Boolean},
    "is_delete": {type: Boolean, default: false},
    "is_enable": {type: Boolean, default: true},
    "created_date": { type: Date, default: Date.now() },
    "updated_date"    : { type: Date, default: Date.now() }
},
{ versionKey: false })

let Order = mongoose.model('order', order)

module.exports = Order
