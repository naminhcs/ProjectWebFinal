const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const tag = require('../models/tagModel')


const tagModel = require('../models/tagController');
const router = express.Router();
router.use(bodyParser.json());

// router.get('/all', async function(req, res){
//     const data = await tagModel.getAllTag();
//     res.send(data);
// })

// router.post('/add', async function(req, res){
//     result = await tagModel.addTag(req.body);
//     res.send(result);   
// })


router.get('/:key', async function(req, res){
    const key = req.params.key;
    const page = req.query.page | 1
    var ans = await postModel.getPostByTag(key, page)
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)
    res.send(jsonAns)
})

module.exports = router;