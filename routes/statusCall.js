let express = require('express')
let path = require('path')
let csv = require('fast-csv')
let formidable = require('formidable')
let fs = require('fs')
let Promise = require('bluebird')
let _ = require('underscore');

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
    let response = []
    Order.aggregate([
        { "$match": { "idSale": idSale } },
        { "$unwind": "$details" },
    ], (err, orders) => {
        let ids_product = []
        let ids_customer = []

        orders.map(p => {
            ids_product.push(p.details.idProduct)
            ids_customer.push(p.idCustomer)

        })

        Product.find({
            _id: {
                $in: ids_product
            }
        }).then(r => {
            let product = {}
            r.map(value => {
                product[value._id] = value
            })

            response = orders.map(p => {
                p.details.name = product[p.details.idProduct].name
                return {
                    _id: p._id,
                    idCustomer: p.idCustomer,
                    idSale: p.idSale,
                    status: p.status,
                    nextAction: p.nextAction,
                    is_check: p.is_check,
                    is_enable: p.is_enable,
                    is_delete: p.is_delete,
                    details: p.details,
                    note: p.note
                }
            })
            
            Customer.find({
                _id: {
                    $in: ids_customer
                }
            }).then(u => {
                let customers = {}
                u.map(user => {
                    customers[user._id] = user
                })

                response = response.map(r => {
                    r.name = customers[r.idCustomer].name
                    r.email = customers[r.idCustomer].email
                    r.phone = customers[r.idCustomer].phone
                    r.address = customers[r.idCustomer].address
                    return {
                        _id: r._id,
                        idCustomer: r.idCustomer,
                        name: r.name,
                        email: r.email,
                        phone: r.phone,
                        address: r.address,
                        idSale: r.idSale,
                        status: r.status,
                        nextAction: r.nextAction,
                        is_check: r.is_check,
                        is_enable: r.is_enable,
                        is_delete: r.is_delete,
                        details: r.details,
                        note: r.note
                    }
                })

                let groups = _.groupBy(response, (value) => {
                    return value._id + '#' + value.idCustomer + '#'
                        + value.idSale + '#' + value.name + '#'
                        + value.email + '#' + value.phone + '#'
                        + value.address + '#' + value.status + '#'
                        + value.nextAction + '#' + value.is_check + '#'
                        + value.is_delete + '#' + value.is_enable + '#'
                        + value.note
                })
                
                let output = _.map(groups, (group) => {
                    return {
                        _id: group[0]._id,
                        idCustomer: group[0].idCustomer,
                        idSale: group[0].idSale,
                        name: group[0].name,
                        email: group[0].email,
                        phone: group[0].phone,
                        address: group[0].address,
                        status: group[0].status,
                        nextAction: group[0].nextAction,
                        is_check: group[0].is_check,
                        is_delete: group[0].is_delete,
                        is_enable: group[0].is_enable,
                        details: _.pluck(group, 'details'),
                        note: group[0].note
                    }
                })
                return res.json({
                    data: output,
                    error: null
                })            
            })
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