var express = require('express')
var path = require('path')
var csv = require('fast-csv')
var formidable = require('formidable')
var fs = require('fs')

var router = express.Router()

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var Customer = require('./../models/customer')
var saleStatus = require('./../models/saleStatus')

router.post('/add', (req, res) =>{
    var name = req.body.name
    var phone = req.body.phone
    var data = Customer({
        name: name,
        phone: phone
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
    var customerId = req.body.customerId
    var saleId = req.body.saleId

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
                    return res.json({
                        customer: customer,
                        error: null
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