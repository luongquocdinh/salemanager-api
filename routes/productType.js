var express = require('express')
var path = require('path')

var router = express.Router()

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var ProductType = require('./../models/productType')

router.post('/add', (req, res) =>{
    var name = req.body.name
    var data = ProductType({
        name: name
    })
    ProductType.findOne({name: name}, function (err, type) {
        if (err) {
            return console.log(err)
        }
        if (!type) {
            data.save(function (err) {
                if (err) {
                    return console.log(err)
                }
                return res.json(responseSuccess('Add product type successful', data))
            })
        }
    })
})

router.get('/listType', (req, res) => {
    var page = req.query.page || 1
    var per_page = req.query.per_page || 10
    ProductType.find({})
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
