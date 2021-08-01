const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const post = require('../models/postModel')
const auth = require('../middlewares/authMethod')

const postModel = require('../models/postController');
const router = express.Router();
router.use(bodyParser.json());

router.get('/get/post', async function(req, res){
    var query = require('url').parse(req.url,true).query;
    id = query.id
    var data = await postModel.getPostById(id);
    res.send(data);
})

router.post('/upload', async function(req, res){
    const data = req.body;
    var dataPush = new post(data)
    var obj = {}
    for (x in dataPush){
        obj[x] = dataPush[x]
    }
    console.log(obj);
    await postModel.addPost(obj);
    res.send('OK')
})

// 10 posts
router.get('/get/topview', async function(req, res){
    const data = await postModel.getHighlighByView();
    res.send(data)
})

//10 post
router.get('/get/topnews', async function(req, res){
    const data = await postModel.getNew();
    res.send(data)
})

//3 post
router.get('/get/topinweek', async function(req, res){
    const d = new Date();
    const time = d.getTime();
    console.log(time)
    const data = await postModel.getPostInWeek(time);
    res.send(data);
})

module.exports = router;