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

router.post('/getList', (req, res) => {
    let idSale = req.body.idSale
    Order.find({idSale: idSale})
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

router.post('/:id/update', (req, res) => {
    let status = req.body.status
    Order.findOne({_id: req.params.id})
        .then(data => {
            data.status = status
            data.callDate.push(Date.now())
            data.save(function (err) {
                if (err) {
                    return res.json(responseError("Update status Call feilds"))
                }
                return res.json({
                    data: data,
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

module.exports = router