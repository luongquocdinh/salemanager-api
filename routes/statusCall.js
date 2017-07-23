let express = require('express')
let path = require('path')
let csv = require('fast-csv')
let formidable = require('formidable')
let fs = require('fs')

let crypto = require('crypto')
let randomString = require('randomstring')

let router = express.Router()

let responseSuccess = require('./../helper/responseSuccess')
let responseError = require('./../helper/responseError')

let Sale = require('./../models/sale')
let Customer = require('./../models/customer')
let Order = require('./../models/order')
let Product = require('./../models/product')

router.post('/getList', (req, res) => {
    let idSale = req.body.idSale
    let result = []
    Order.find({idSale: idSale})
        .then(data => {

            let ids = [];

            data.map(id => {
                ids.push(id.idCustomer);
            });

            Customer.find({
                _id: {
                    $in: ids
                }
            }).then(cus => {
                let users = {}
                cus.map(u => {
                    users[u._id] = u
                })

                result = data.map(info => {
                    return {
                        id: info._id,
                        idCustomer: info.idCustomer,
                        name: users[info.idCustomer].name,
                        phone: users[info.idCustomer].phone,
                        email: users[info.idCustomer].email,
                        address: users[info.idCustomer].address,
                        status: info.status,
                        nextAction: info.nextAction,
                        details: info.details,
                        note: info.note,
						is_check: info.is_check
                    }
                })

                return res.json({
                    data: result,
                    error: null
                })
            })
        })
        .catch(err => {
            return res.json({
                data: null,
                error: err
            })
        })
})

router.get('/:id', (req, res) => {
    let id = req.params.id
    Order.findOne({_id: id})
        .then(data => {
            return res.json({
                data: data,
                error: null
            })
        }).catch(err => {
            return res.json({
                data: null,
                error: err
            })
        })
})

router.post('/add', (req, res) => {
    let data = Order({
        "idSale": req.body.idSale,
        "idCustomer": req.body.idCustomer,
        "status": req.body.status,
        "nextAction": req.body.nextAction,
        "note": req.body.note,
        "details": req.body.details,
        "is_check": req.body.is_check
    })

    data.save(function (err) {
        if (err) {
            return res.json(responseError("add status call feild"))
        }
        return res.json({
            data: data,
            error: null
        })
    })
})

router.post('/update', (req, res) => {
    let status = req.body.status
    let id = req.body.id
    Order.findOne({_id: id})
        .then(customer => {
            let data = {
                "status": req.body.status || customer.status,
                "nextAction": req.body.nextAction || customer.nextAction,
                "note": req.body.note || customer.note,
                "details": req.body.details || customer.details,
                "is_check": req.body.is_check|| customer.is_check
            }
            Order.findOneAndUpdate({_id: id}, data, {new: true}, (err, order) => {
                if (err) {
                    return res.json(responseError("Update Order feilds"))
                }

                return res.json({
                    data: order,
                    error: null
                })
            })
        }).catch(err => {
            return res.json({
                data: null,
                error: err
            })
        })
})

router.post('/sum', (req, res) => {
    let idSale = req.body.idSale
    let sum = []
    Order.aggregate([
        { "$match": { "idSale": idSale } },
        { "$unwind": "$details" },
        {
            "$group": {
                "_id": "$details.idProduct",
                "sold_price": { "$sum": "$details.price" },
                "quantity": { "$sum": "$details.quantity" },
                "bonus": { "$sum": "$details.bonus" }
            }
        }
    ], (err, result) => {
        if (err) {
            return res.json({
                data: null,
                error: err
            });
        }
        let ids = []
        result.map(r => {
            ids.push(r._id)
        })

        Product.find({
            _id: {
                $in: ids
            }
        }).then(p => {
            let product = {}
            p.map(u => {
                product[u._id] = u
            })

            sum = result.map(info => {
                return {
                    name: product[info._id].name,
                    price: product[info._id].price,
                    sold_price: info.sold_price,
                    quantity: info.quantity,
                    comission: product[info._id].comission,
                    bonus: info.bonus,
                    total: info.quantity * info.sold_price
                }
            })

            return res.json({
                data: sum,
                error: null
            })
        })
    })
})

module.exports = router