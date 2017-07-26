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
    let price_sold = req.body.price_sold
    let size = req.body.size
    let color = req.body.color
    let max_discount_si = req.body.max_discount_si
    let max_discount_le = req.body.max_discount_le
    let bonus = req.body.bonus
    let bonus_si = req.body.bonus_si
    let bonus_coefficient = req.body.bonus_coefficient
    

    let data = Product({
        typeId: typeId,
        name: name,
        price: price,
        price_sold: price_sold,
        size: size,
        color: color,
        max_discount_si: max_discount_si,
        max_discount_le: max_discount_le,
        bonus: bonus,
        bonus_si: bonus_si,
        bonus_coefficient: bonus_coefficient
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
    Product.find({is_enable: true})
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
                    price_lower: price_lower,
                    comission: r.comission,
                    size: r.size,
                    color: r.color,
                    max_discount_si: r.max_discount_si,
                    max_discount_le: r.max_discount_le,
                    bonus: r.bonus,
                    bonus_si: r.bonus_si,
                    bonus_coefficient: bonus_coefficient
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
    let price_lower = req.body.price_lower
    let comission = req.body.comission
    let size = req.body.size
    let color = req.body.color
    let max_discount_si = req.body.max_discount_si
    let max_discount_le = req.body.max_discount_le
    let bonus = req.body.bonus
    let bonus_si = req.body.bonus_si
    let bonus_coefficient = req.body.bonus_coefficient
    
    Product.findOne({_id: req.params.id})
        .then(data => {
            let p = {
                name: name || data.name,
                price: price || data.price,
                price_lower: price_lower || data.price_lower,
                comission: comission || data.comission,
                size: size || data.size,
                color: color || data.color,
                max_discount_si: max_discount_si || data.max_discount_si,
                max_discount_le: max_discount_le || data.max_discount_le,
                bonus: bonus || data.bonus,
                bonus_si: bonus_si || data.bonus_si,
                bonus_coefficient: bonus_coefficient || data.bonus_coefficient
            }

            Product.findOneAndUpdate({_id: req.params.id}, p, {new: true}, (err, product) => {
                if (err) {
                    return res.json(responseError("Update Product feilds"))
                }

                return res.json({
                    data: product,
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
