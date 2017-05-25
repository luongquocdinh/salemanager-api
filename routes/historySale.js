var express = require('express')
var path = require('path')
var csv = require('fast-csv')
var formidable = require('formidable')
var fs = require('fs')

var crypto = require('crypto')
var randomString = require('randomstring')

var router = express.Router()

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var Sale = require('./../models/sale')
var Customer = require('./../models/customer')
var Product = require('./../models/product')
var historySale = require('./../models/historySale')

router.post('/add', (req, res) => {
    var saleDate = req.body.saleDate
    var leadCode = req.body.leadCode
    var saleCode = req.body.saleCode
    var customer = req.body.customer
    var productId = req.body.productId

    Product.findOne({_id: productId})
        .then(r => {
            var data = historySale({
                saleDate: saleDate,
                leadCode: leadCode,
                saleCode: saleCode,
                customer: customer,
                productName: r.name,
                price: r.price,
                bonus: r.bonus
            })
            console.log(data)
            data.save(function (err) {
                if (err) {
                    return res.json(responseError("Add history Sale error"))
                }
                return res.json({
                    data: data,
                    error: null
                })
            })
        }).catch(e => {
            return res.json({
                data: null,
                error: e
            })
        })
})

router.post('/:id/update', (req, res) => {
    var saleDate = req.body.saleDate
    var leadCode = req.body.leadCode
    var saleCode = req.body.saleCode
    var customer = req.body.customer
    var productName = req.body.productName
    var price = req.body.price
    var bonus = req.body.bonus

    historySale.findOne({_id: req.params.id})
        .then(data => {
            data.saleDate = saleDate
            data.leadCode = leadCode
            data.saleCode = saleCode
            data.customer = customer
            data.productName = productName
            data.price = price
            data.bonus = bonus

            data.save(function (err) {
                if (err) {
                    return res.json(responseError("Update history Sale error"))
                }
                return res.json({
                    data: data,
                    error: null
                })
            })
        })
})

router.get('/getlist', (req, res) => {
    historySale.find({})
        .then(data => {
            return res.json({
                data: data,
                error: null
            })
        }).catch( err =>{
            return res.json({
                data: null,
                error: err
            })
        })
})

router.get('/getByDate', (req, res) => {
    
})

module.exports = router