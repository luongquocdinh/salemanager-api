let express = require('express')
let path = require('path')

let router = express.Router()

let responseSuccess = require('./../helper/responseSuccess')
let responseError = require('./../helper/responseError')

let Product = require('./../models/product')

router.post('/add', (req, res) =>{
    let typeId = req.body.typeId

    let name = req.body.name
    let price = req.body.price
    let comission = req.body.comission
    let size = req.body.size
    let color = req.body.color
    let max_discount_si = req.body.max_discount_si
    let max_discount_le = req.body.max_discount_le
    let bonus = req.body.bonus
    let bonus_si = req.body.bonus_si
    

    let data = Product({
        typeId: typeId,
        name: name,
        price: price,
        comission: comission,
        size: size,
        color: color,
        max_discount_si: max_discount_si,
        max_discount_le: max_discount_le,
        bonus: bonus,
        bonus_si: bonus_si
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

router.post('/productByType', (req, res) => {
    let type = req.body.typeId
    let response = [];
    Product.find({typeId: type})
        .then(data => {
            data.map(r => {
                response.push({
                    name: r.name,
                    price: r.price,
                    comission: r.comission,
                    size: r.size,
                    color: r.color,
                    max_discount_si: r.max_discount_si,
                    max_discount_le: r.max_discount_le,
                    bonus: r.bonus,
                    bonus_si: r.bonus_si
                })
            })
            
            return res.json({
                data: response,
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
    let typeId = req.body.typeId

    let name = req.body.name
    let price = req.body.price
    let comission = req.body.comission
    let size = req.body.size
    let color = req.body.color
    let max_discount_si = req.body.max_discount_si
    let max_discount_le = req.body.max_discount_le
    let bonus = req.body.bonus
    let bonus_si = req.body.bonus_si
    
    Product.findOne({_id: req.params.id})
        .then(data => {
            data.typeId = typeId

            data.name = name
            data.price = price
            data.comission = comission
            data.size = size
            data.color = color
            data.max_discount_si = max_discount_si
            data.max_discount_le = max_discount_le
            data.bonus = bonus
            data.bonus_si = bonus_si

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
            data.is_delete = !data.is_delete
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
