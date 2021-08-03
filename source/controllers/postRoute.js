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

router.get('/', async function (req, res) {
    id = req.query.id
    var data = await postModel.getPostByID(id);
    // res.send(data);
    res.render('posts/post-detail', {
        post: data
    })
})

router.post('/upload', async function (req, res) {
    const data = req.body;
    await postModel.addPost(data);
    res.send('OK')
})

// 10 posts
router.get('/get/topview', async function (req, res) {
    const data = await postModel.getHighlighByView();
    res.send(data)
})

//10 post
router.get('/get/topnews', async function (req, res) {
    const data = await postModel.getNew();
    res.send(data)
})

//3 post
router.get('/get/topinweek', async function (req, res) {
    const d = new Date();
    const time = d.getTime();
    console.log(time)
    const data = await postModel.getPostInWeek(time);
    res.send(data);
})

// get 10post/page    (category2)
router.get('/cat/:cat1/:cat2', async function (req, res) {
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    const page = req.query.page || 1
    console.log(page)
    var ans = await postModel.getPostByCat2(cat2, page);
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)
    // res.send(jsonAns)
    var nPages = 5; // needing to get total pages of cat
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrent: i === +page
        });
    }
    console.log(page)
    res.render('posts/categories', {
        data: jsonAns,
        empty: jsonAns.length === 0,
        page_numbers,
    });
})

// get 10 posts/page (category1)
router.get('/cat/:cat1', async function (req, res) {
    // console.log(res.locals.data)
    // console.log(req.session.data)
    
    const cat1 = req.params.cat1
    const page = req.query.page || 1
    var ans = await postModel.getPostByCat1(cat1, page);
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)


    var nPages = 5; // needing to get total pages of cat
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrent: i === +page
        });
    }
    res.render('posts/categories', {
        data: jsonAns,
        empty: jsonAns.length === 0,
        page_numbers
    });
})

// get 10 posts/page for Tag
router.get('/tag/:key', async function (req, res) {
    const key = req.params.key;
    const page = req.query.page || 1
    var ans = await postModel.getPostByTag(key, page)
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)
    res.send(jsonAns)
})

router.get('/updatedata', async function (req, res) {
    console.log('hihihi')
    result = await postModel.updateData();
    res.send(result)
})

module.exports = router;