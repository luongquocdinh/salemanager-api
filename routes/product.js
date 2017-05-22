var express = require('express')
var path = require('path')

var router = express.Router()

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var Product = require('./../models/product')

router.post('/add', (req, res) =>{
    var name = req.body.name
    var typeId = req.body.typeId
    var data = Product({
        name: name,
        typeId: typeId
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
    var page = req.query.page || 1
    var per_page = req.query.per_page || 10
    Product.find({})
        .skip(per_page * (page - 1))
        .limit(per_page)
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
