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
var Product = require('./../models/product')
var historySale = require('./../models/historySale')

router.post('/add', (req, res) => {
    var date = req.body.date
    var lead = req.body.lead
    var phone = req.body.phone
    var product = req.body.product
    var status = req.body.status
    var next_action = req.body.next_action
    var note = req.body.note
    var saleId = req.body.saleId

    Product.findOne({name: product})
        .then(r => {
            var data = historySale({
                date: date,
                lead: lead,
                phone: phone,
                product: r.name,
                status: status,
                saleId: saleId,
                price: r.price,
                sold_price: r.sold_price, 
                bonus: r.bonus,
                next_action: next_action,
                note: note
            })
            data.save(function (err) {
                if (err) {
                    return res.json(responseError("Add history Sale error"))
                }
                return res.json({
                    data: data,
                    error: null
                })
            })
        }).catch(e => {
            return res.json({
                data: null,
                error: e
            })
        })
})

router.post('/:id/update', (req, res) => {
    var saleDate = req.body.saleDate
    var leadCode = req.body.leadCode
    var saleCode = req.body.saleCode
    var customer = req.body.customer
    var productName = req.body.productName
    var price = req.body.price
    var bonus = req.body.bonus

    historySale.findOne({_id: req.params.id})
        .then(data => {
            data.saleDate = saleDate
            data.leadCode = leadCode
            data.saleCode = saleCode
            data.customer = customer
            data.productName = productName
            data.price = price
            data.bonus = bonus

            data.save(function (err) {
                if (err) {
                    return res.json(responseError("Update history Sale error"))
                }
                return res.json({
                    data: data,
                    error: null
                })
            })
        })
})

router.get('/getlist', (req, res) => {
    historySale.find({})
        .then(data => {
            return res.json({
                data: data,
                error: null
            })
        }).catch( err =>{
            return res.json({
                data: null,
                error: err
            })
        })
})


// Report By Result
router.post('/getByDate', (req, res) => {
    let success = 0
    let waitting = 0
    let failure = 0
    var dateStart = new Date(req.body.day)
    var dateEnd = new Date(req.body.day)
    dateEnd.setHours(dateEnd.getHours() +24);
    historySale.find({
        "date": {
            $gte: new Date(dateStart),
            $lte: new Date(dateEnd)
        }
    })
    .lean()
    .exec()
    .then(data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].status == 1) {
                success++
            } else if (data[i].status == 0) {
                waitting++
            } else {
                failure++
            }
        }
        return res.json({
            success,
            waitting,
            failure
        })
    }).catch(err =>{
        return res.json({
            data: null,
            error: err
        })
    })
})

router.post('/historyByDateForSale', (req, res) => {
    let success = 0
    let waitting = 0
    let failure = 0
    var dateStart = new Date(req.body.day)
    var dateEnd = new Date(req.body.day)
    dateEnd.setHours(dateEnd.getHours() +24);
    historySale.find({
        $and: [
            {saleId: req.body.saleId},
            {   "date": {
                    $gte: new Date(dateStart),
                    $lte: new Date(dateEnd)
                }
            }
        ]
        })
        .then(data => {
            for (var i = 0; i < data.length; i++) {
                if (data[i].status == 1) {
                    success++
                } else if (data[i].status == 0) {
                    waitting++
                } else {
                    failure++
                }
            }
            return res.json({
                success,
                waitting,
                failure
            })
        }).catch(err=> {
            return res.json({
                data: null,
                error: err
            })
        })
})

router.post('/getByMonth', (req, res) => {
    let success = 0
    let waitting = 0
    let failure = 0
    var month = req.body.month
    var result = []
    historySale.find({})
            .lean()
            .exec()
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    let t = new Date(data[i].date).getMonth()
                    if (t + 1 == month) {
                        result.push(data[i])
                    }
                }
                for (var i = 0; i < result.length; i++) {
                    if (result[i].status == 1) {
                        success++
                    } else if (result[i].status == 0) {
                        waitting++
                    } else {
                        failure++
                    }
                }
                return res.json({
                    success,
                    waitting,
                    failure
                })
            }).catch(err =>{
                return res.json({
                    data: null,
                    error: err
                })
            })
})

router.post('/historyByMonthForSale', (req, res) => {
    let success = 0
    let waitting = 0
    let failure = 0
    var month = req.body.month
    var saleId = req.body.saleId
    var result = []
    historySale.find({saleId: saleId})
        .then(data => {
            for (var i = 0; i < data.length; i++) {
                let t = new Date(data[i].date).getMonth()
                if (t + 1 == month) {
                    result.push(data[i])
                }
            }
            for (var i = 0; i < result.length; i++) {
                if (result[i].status == 1) {
                    success++
                } else if (result[i].status == 0) {
                    waitting++
                } else {
                    failure++
                }
            }
            return res.json({
                success,
                waitting,
                failure
            })
        }).catch(err =>{
            return res.json({
                data: null,
                error: err
            })
        })
})

router.post('/getByYear', (req, res) => {
    let success = 0
    let waitting = 0
    let failure = 0
    var year = req.body.year
    var result = []
    historySale.find({})
            .lean()
            .exec()
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    let t = new Date(data[i].date).getFullYear()
                    if (t == year) {
                        result.push(data[i])
                    }
                }
                for (var i = 0; i < result.length; i++) {
                    if (result[i].status == 1) {
                       success++
                    } else if (result[i].status == 0) {
                        waitting++
                    } else {
                        failure++
                    }
                }
                return res.json({
                    success,
                    waitting,
                    failure
                })
            }).catch(err =>{
                return res.json({
                    data: null,
                    error: err
                })
            })
})

router.post('/historyByYearForSale', (req, res) => {
    let success = 0
    let waitting = 0
    let failure = 0
    var year = req.body.year
    var result = []
    historySale.find({saleId: req.body.saleId})
            .lean()
            .exec()
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    let t = new Date(data[i].date).getFullYear()
                    if (t == year) {
                        result.push(data[i])
                    }
                }
                for (var i = 0; i < result.length; i++) {
                    if (result[i].status == 1) {
                        success++
                    } else if (result[i].status == 0) {
                        waitting++
                    } else {
                        failure++
                    }
                }
                return res.json({
                    success,
                    waitting,
                    failure
                })
            }).catch(err =>{
                return res.json({
                    data: null,
                    error: err
                })
            })
})


// Report By Product
router.post('/reportByDate', (req, res) => {
    let data_success = []
    let sum_price = 0
    let sum_bonus = 0
    var dateStart = new Date(req.body.day)
    var dateEnd = new Date(req.body.day)
    dateEnd.setHours(dateEnd.getHours() +24);
    historySale.find({
        "date": {
            $gte: new Date(dateStart),
            $lte: new Date(dateEnd)
        }
    })
    .lean()
    .exec()
    .then(data => {
        for (var i = 0; i < data.length; i++) {
            if (data[i].status == 1) {
                data_success.push(data[i])
                sum_bonus = sum_bonus + data[i].bonus
                sum_price = sum_price + data[i].price
            } 
        }
        return res.json({
            data_success,
            sum_bonus,
            sum_price
        })
    }).catch(err =>{
        return res.json({
            data: null,
            error: err
        })
    })
})

router.post('/reportByDateForSale', (req, res) => {
    let data_success = []
    let sum_price = 0
    let sum_bonus = 0
    var dateStart = new Date(req.body.day)
    var dateEnd = new Date(req.body.day)
    dateEnd.setHours(dateEnd.getHours() +24);
    historySale.find({
        $and: [
            {saleId: req.body.saleId},
            {   "date": {
                    $gte: new Date(dateStart),
                    $lte: new Date(dateEnd)
                }
            }
        ]
        })
        .then(data => {
             for (var i = 0; i < data.length; i++) {
                if (data[i].status == 1) {
                    data_success.push(data[i])
                    sum_bonus = sum_bonus + data[i].bonus
                    sum_price = sum_price + data[i].price
                } 
            }
            return res.json({
                data_success,
                sum_bonus,
                sum_price
            })
        }).catch(err=> {
            return res.json({
                data: null,
                error: err
            })
        })
})

router.post('/reportByMonth', (req, res) => {
    let data_success = []
    let sum_price = 0
    let sum_bonus = 0
    var month = req.body.month
    var result = []
    historySale.find({})
            .lean()
            .exec()
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    let t = new Date(data[i].date).getMonth()
                    if (t + 1 == month) {
                        result.push(data[i])
                    }
                }
                for (var i = 0; i < result.length; i++) {
                    if (result[i].status == 1) {
                        data_success.push(result[i])
                        sum_bonus = sum_bonus + result[i].bonus
                        sum_price = sum_price + result[i].price
                    }
                }
                return res.json({
                    data_success,
                    sum_bonus,
                    sum_price
                })
            }).catch(err =>{
                return res.json({
                    data: null,
                    error: err
                })
            })
})

router.post('/reportByMonthForSale', (req, res) => {
    let data_success = []
    let sum_price = 0
    let sum_bonus = 0
    var month = req.body.month
    var result = []
    historySale.find({
            saleId: req.body.saleId
        }).then(data => {
            for (var i = 0; i < data.length; i++) {
                let t = new Date(data[i].date).getMonth()
                if (t + 1 == month) {
                    result.push(data[i])
                }
            }
            for (var i = 0; i < result.length; i++) {
                if (result[i].status == 1) {
                    data_success.push(result[i])
                    sum_bonus = sum_bonus + result[i].bonus
                    sum_price = sum_price + result[i].price
                }
            }
            return res.json({
                data_success,
                sum_bonus,
                sum_price
            })
        }).catch(err =>{
            return res.json({
                data: null,
                error: err
            })
        })
})

router.post('/reportByYear', (req, res) => {
    let data_success = []
    let sum_price = 0
    let sum_bonus = 0
    var year = req.body.year
    var result = []
    historySale.find({})
            .lean()
            .exec()
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    let t = new Date(data[i].date).getFullYear()
                    if (t == year) {
                        result.push(data[i])
                    }
                }
                for (var i = 0; i < result.length; i++) {
                    if (result[i].status == 1) {
                        data_success.push(result[i])
                        sum_bonus = sum_bonus + result[i].bonus
                        sum_price = sum_price + result[i].price
                    }
                }
                return res.json({
                    data_success,
                    sum_bonus,
                    sum_price
                })
            }).catch(err =>{
                return res.json({
                    data: null,
                    error: err
                })
            })
})

router.post('/reportByYearForSale', (req, res) => {
    let data_success = []
    let sum_price = 0
    let sum_bonus = 0
    var year = req.body.year
    var result = []
    historySale.find({saleId: req.body.saleId})
            .lean()
            .exec()
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    let t = new Date(data[i].date).getFullYear()
                    if (t == year) {
                        result.push(data[i])
                    }
                }
                for (var i = 0; i < result.length; i++) {
                    if (result[i].status == 1) {
                        data_success.push(result[i])
                        sum_bonus = sum_bonus + result[i].bonus
                        sum_price = sum_price + result[i].price
                    }
                }
                return res.json({
                    data_success,
                    sum_bonus,
                    sum_price
                })
            }).catch(err =>{
                return res.json({
                    data: null,
                    error: err
                })
            })
})
module.exports = router