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
var ProductBySale = require('./../models/productBySale')
var saleStatus = require('./../models/saleStatus')

router.post('/add', (req, res) => {
    var name = req.body.name
    var password = req.body.password
    var saleCode = req.body.saleCode

    Sale.findOne({name: name})
        .then(data => {
            if (!data) {
                let sale = Sale({
                    name: name,
                    password: password,
                    saleCode: saleCode
                })
                sale.save()
                    .then(r => {
                        return res.json({
                            data: sale,
                            error: null
                        })
                    }).catch(e => {
                        return res.json({
                            data: null,
                            error: e
                        })
                    })
            }
        }).catch(err => {
            return res.json({
                data: null,
                error: err
            })
        })
})

router.get('/listSale', (req, res) => {
    Sale.find({is_enable: true, is_active: true})
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

router.get('/:id/listCustomer', (req, res) => {
    let id = req.params.id
    Customer.find({saleId: id})
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

router.post('/:id/addProduct', (req, res) => {
    var id = req.params.id
    var product = req.body.product
    var typeId = req.body.typeId
    var price = req.body.price
    var bonus = req.body.bonus

    var dataProduct = Product({
        name: product,
        typeId: typeId,
        price: price,
        bonus: bonus,
        is_active: true
    })

    Product.findOne({name: product}, function (err, product) {
        console.log("here")
        if (err) {
            return res.json(responseError("Error Add product"))
        }
        if (product) {
            return res.json(responseError("Product exist"))
        }
        if (!product) {
            dataProduct.save(function (err, p) {
                console.log("1")
                if (err) {
                    return res.json(responseError("Error Save product"))
                }
                var data = ProductBySale({
                    productId: p._id,
                    SaleId: req.params.id
                })
                data.save(function (err) {
                    console.log("2")
                    if (err) {
                        return res.json(responseError("Error Save product"))
                    }
                    let response = {
                        dataProduct,
                        data
                    }
                    return res.json(responseSuccess("Successful add product by sale", response))
                })
            })
        }
    })
})

module.exports = router