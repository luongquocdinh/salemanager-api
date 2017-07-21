let express = require('express')
let path = require('path')
let csv = require('fast-csv')
let formidable = require('formidable')
let fs = require('fs')

let router = express.Router()

let responseSuccess = require('./../helper/responseSuccess')
let responseError = require('./../helper/responseError')

let Customer = require('./../models/customer')
let saleStatus = require('./../models/saleStatus')
let statusCall = require('./../models/statusCall')

router.post('/add', (req, res) =>{
    let name = req.body.name
    let phone = req.body.phone
    let email = req.body.email
    let address = req.body.address
    let data = Customer({
        name: name,
        phone: phone,
        email: email,
        address: address
    })
    Customer.findOne({phone: phone}, function (err, customer) {
        if (err) {
            return console.log(err)
        }
        if (!customer) {
            data.save(function (err) {
                if (err) {
                    return console.log(err)
                }
                return res.json(responseSuccess('Add Customer successful', data))
            })
        }
    })
})

router.post('/edit', (req, res) => {
    let id = req.body.id
    Customer.findOne({_id: id})
        .then(user => {
            let data = {
                name: req.body.name || user.name,
                email: req.body.email || user.email,
                phone: req.body.phone || user.phone,
                address: req.body.address || user.address
            }
            Customer.findOneAndUpdate({_id: id}, data, {new: true}, (err, customer) => {
                if (err) {
                    return res.json(responseError("Update Customer feilds"))
                }

                return res.json({
                    data: customer,
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

router.post('/detail', (req, res) => {
    let id = req.body.id;
    Customer.findOne({_id: id})
        .then(user => {
            let customer = {
                id: id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }

            return res.json({
                data: customer,
                error: null
            })
        }).catch(err => {
            return res.json({
                data: null,
                error: err
            })
        })
})

router.get('/listCustomer', (req, res) => {
    Customer.find({})
        .lean()
        .exec()
        .then(data => {
            return res.json({
                data: data,
                error: null
            })
        })
        .catch(err => {
            return res.json({
                data: null,
                error: err
            })
        })
})

router.get('/listNotSale', (req, res) => {
    Customer.find({is_sale: false})
        .lean()
        .exec()
        .then(data => {
            return res.json({
                data: data,
                error: null
            })
        })
        .catch(err => {
            return res.json({
                data: null,
                error: err
            })
        })
})

router.post('/assignSale', (req, res) => {
    let customerId = req.body.customerId
    let saleId = req.body.saleId

    Customer.findOne({_id: customerId})
        .then(customer => {
            customer.saleId = saleId
            customer.is_sale = true
            customer.save()
            let status = saleStatus({
                customerId: customer._id,
                saleId: saleId
            })
            status.save()
                .then(data => {
                    let status_Call = statusCall({
                        saleId: saleId,
                        customerId: customerId,
                        countCall: 1,
                        callDate: [Date.now()],
                        isWin: false,
                        status: "lead",
                        note: "none"
                    })
                    status_Call.save()
                        .then(data => {
                            return res.json({
                                customer: customer,
                                error: null
                            })
                        })
                }).catch(err => {
                    return res.json({
                        customer: null,
                        error: err
                    })
                })
        }).catch(err => {
            return res.json({
                customer: null,
                error: err
            })
        })
})

module.exports = router