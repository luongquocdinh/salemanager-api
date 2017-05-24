var express = require('express')
var path = require('path')

var router = express.Router()

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var ProductType = require('./../models/productType')

router.post('/add', (req, res) => {
    var name = req.body.name
    var data = ProductType({
        name: name,
        is_active: true
    })

    ProductType.findOne({name: name}, function (err, product) {
        if (err) {
            return console.log(err)
        }
        if (!product) {
            data.save(function (err) {
                if (err) {
                    return console.log(err)
                }
                return res.json(responseSuccess('Add product type successful', data))
            })
        }
    })
})

router.get('/listProductType', (req, res) => {
    ProductType.find({})
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

router.post('/:id/delete', (req, res) => {
    ProductType.findOne({_id: req.params.id})
        .then(data => {
            data.is_active = false
            data.save(function(err) {
                if (err) {
                    return res.json(responseError("Delete error"))
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