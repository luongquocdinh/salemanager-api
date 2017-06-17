var express = require('express')
var path = require('path')

var router = express.Router()

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var Product = require('./../models/product')

router.post('/add', (req, res) =>{
    var name = req.body.name
    var typeId = req.body.typeId
    var price = req.body.price
    var bonus = req.body.bonus
    var sold_price = req.body.sold_price
    var data = Product({
        name: name,
        typeId: typeId,
        price: price,
        sold_price: sold_price,
        bonus: bonus,
        is_active: true
    })
    Product.findOne({name: name}, function (err, product) {
        if (err) {
            return console.log(err)
        }
        if (!product) {
            data.save(function (err) {
                if (err) {
                    return console.log(err)
                }
                return res.json(responseSuccess('Add product successful', data))
            })
        }
    })
})

router.get('/listProduct', (req, res) => {
    Product.find({})
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

router.get('/:id', (req, res) => {
    Product.findOne({_id: req.params.id})
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

router.post('/:id/update', (req, res) => {
    var name = req.body.name
    var typeId = req.body.typeId
    var price = req.body.price
    var sold_price = req.body.sold_price
    var bonus = req.body.bonus
    Product.findOne({_id: req.params.id})
        .then(data => {
            data.name = name
            data.typeId = typeId
            data.price = price
            data.bonus = bonus
            data.sold_price = sold_price
            data.save(function (err) {
                if (err) {
                    return res.json(responseError("Update error"))
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

router.post('/:id/delete', (req, res) => {
    Product.findOne({_id: req.params.id})
        .then(data => {
            data.is_active = !data.is_active
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
