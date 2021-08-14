const express = require('express');
const bodyParser = require('body-parser')
const commentModel = require('../models/commentController')

const postModel = require('../models/postController');
const {
    post
} = require('./userRoute');
const router = express.Router();
router.use(bodyParser.json());

//--------------------------------------------------------
const algoliasearch = require("algoliasearch")
// const admin = require("firebase-admin");
const db = require('../db');

const ALGOLIA_APP_ID = 'TO3MDPY1CJ';
const ALGOLIA_SEARCH_KEY = '322bd2d06b1c4b6cb37e4b1c478260b7'

//-----------------------------------------------------------------
router.get('/', async function (req, res) {
    id = req.query.id
    var premium;
    if (typeof (req.session.data) === 'undefined' || req.session.data === null) {
        premium = 0;
    } else premium = req.session.data.premium;
    var data = await postModel.getPostByID(id, premium);
    if (data === "Post cann't found" || data === "you need up your account to premium") {
        res.redirect('/notFound')
        return;
    }

    var relevantPost = await postModel.getRandomPostByCat2(data['keyCat2'])
    const comments = await commentModel.getAllComment(id)
    console.log(comments)
    res.render('posts/post-detail', {
        post: data,
        relevantPost: relevantPost,
        comments: comments,
    })
})

// router.get('/testing', async function (req, res) {
//     const textQuery = req.query.text;
//     console.log(textQuery)
//     var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
//     var index = client.initIndex('Post');

//     // Perform an Algolia search:
//     // https://www.algolia.com/doc/api-reference/api-methods/search/
//     var ans = await index.search(textQuery);
//     res.render('search/categories')
// })


router.get('/search', async function (req, res) {
    console.log('Come here')
    const textQuery = req.query.key;
    var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
    var index = client.initIndex('Post');
    // console.log(textQuery),
    var ans = await index.search(textQuery);
    var returnData = ans['hits']
    for (let i = 0 ; i < returnData.length; i++){
        delete returnData[i]['_highlightResult']
        const t = new Date(returnData[i]['dateUpload'])
        returnData[i]['dateUpload'] = t.toGMTString()
    }
    res.render('search/search',{
        key: textQuery,
        data: returnData,
        isEmpty: returnData.length
    })
})

module.exports = router;