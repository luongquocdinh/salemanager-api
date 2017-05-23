var express = require('express')
var path = require('path')

var router = express.Router()

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var Product = require('./../models/product')

router.post('/add', (req, res) =>{
    var name = req.body.name
    var type = req.body.type
    var data = Product({
        name: name,
        type: type
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

module.exports = router
