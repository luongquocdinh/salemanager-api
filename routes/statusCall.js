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
var statusCall = require('./../models/statusCall')

router.post('/getList', (req, res) => {
    var saleId = req.body.saleId
    statusCall.find({saleId: saleId})
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
    var id = req.params.id
    statusCall.findOne({_id: id})
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
    var data = statusCall({
        saleId: req.body.saleId,
        customerId: req.body.customerId,
        countCall: 1,
        callDate: [Date.now()],
        isWin: req.body.isWin,
        status: req.body.status
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
    var saleId = req.body.saleId
    var customerId = req.body.customerId
    var isWin = req.body.isWin
    var status = req.body.status
    statusCall.findOne({_id: req.params.id})
        .then(data => {
            data.saleId = saleId
            data.customerId = customerId
            data.isWin = isWin
            data.status = status
            data.countCall++
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