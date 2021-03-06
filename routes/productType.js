let express = require('express')
let path = require('path')

let router = express.Router()

let responseSuccess = require('./../helper/responseSuccess')
let responseError = require('./../helper/responseError')

let ProductType = require('./../models/productType')

router.post('/add', (req, res) => {
    let name = req.body.name
    let data = ProductType({
        name: name,
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

router.post('/:id/update', (req, res) => {
    let name = req.body.name
    ProductType.findOne({_id: req.params.id})
        .then(data => {
            data.name = name
            data.save(function (err) {
                if (err) {
                    return res.json(responseError("Update product type error"))
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
    ProductType.findOne({_id: req.params.id})
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