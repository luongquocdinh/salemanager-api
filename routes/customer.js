var express = require('express')
var path = require('path')
var csv = require('fast-csv')
var formidable = require('formidable')
var fs = require('fs')

var router = express.Router()

var responseSuccess = require('./../helper/responseSuccess')
var responseError = require('./../helper/responseError')

var Customer = require('./../models/customer')

router.post('/add', (req, res) =>{
    var name = req.body.name
    var phone = req.body.phone
    var data = Customer({
        name: name,
        phone: phone
    })
    Customer.findOne({phone: phone}, function (err, customer) {
        if (err) {
            return console.log(err)
        }
        if (!customer) {
            data.save(function (err) {
                if (err) {
                    return console.log(err)
                }
                return res.json(responseSuccess('Add Customer successful', data))
            })
        }
    })
})

router.post('/addMultiple', (req, res) => {
    var customerList = []
    var form = new formidable.IncomingForm({
    uploadDir: path.join(__dirname, '/../uploads'),
    keepExtensions: true
    })
    form.parse(req, function (err, fields, files) {
        if (!err) {
        csv.fromStream(fs.createReadStream(files.file.path))
        .on('data', function (data) {
            customerList.push(data)
        })
        .on('error', function () {
            done(null, [responseError("Error")])
            fs.unlink(files.file.path, function () {})
        })
        .on('end', function () {
            addCustomer(customerList)
            fs.unlink(files.file.path, function () {})
        })
        } else {
            console.log(err)
        }
    })
})

function addCustomer (customerList) {
    for (var i = 0; i < customerList.length; i++) {
        var data = Customer({
            name: customerList[i][0],
            phone: customerList[i][1]
        })
        data.save()
    }
    return customerList
}

router.get('/listCustomer', (req, res) => {
    var page = req.query.page || 1
    var per_page = req.query.per_page || 10
    Customer.find({})
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