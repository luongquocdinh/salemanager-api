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
var saleStatus = require('./../models/saleStatus')

router.post('/add', (req, res) => {
    var name = req.body.name
    var password = req.body.password
    var saltValue = crypto.createHash("sha256").update(name).digest('hex')

    Sale.findOne({name: name})
        .then(data => {
            if (!data) {
                let sale = Sale({
                    name: name,
                    password: password,
                    saltValue: saltValue
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

module.exports = router