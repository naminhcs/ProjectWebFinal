const express = require('express');
const bodyParser = require('body-parser')


const postModel = require('../models/postController');
const { post } = require('./userRoute');
const router = express.Router();
router.use(bodyParser.json());

//--------------------------------------------------------
const algoliasearch = require("algoliasearch")
// const admin = require("firebase-admin");
 const db = require('../db');

const ALGOLIA_APP_ID = 'TO3MDPY1CJ';
// const ALGOLIA_ADMIN_KEY = '842e8a716cad95953cb173c66c0481a4';
// const ALGOLIA_INDEX_NAME = 'Post';
const ALGOLIA_SEARCH_KEY = '322bd2d06b1c4b6cb37e4b1c478260b7'


// router.get('/testing', async function (req, res){
//     var arr = [];
//     console.log('ok')
//     db.firestore.collection('Post').get().then((docs) =>{
//         console.log('done get post')
//         docs.forEach((doc) => {
//             let post = doc.data();
//             post.objectID = doc.id;
//             arr.push(post)
//         })
//         console.log('done here')
//         var client = algoliasearch.default(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
//         var index = client.initIndex(ALGOLIA_INDEX_NAME);
//         index.saveObject(arr, function (err, content){
//             console.log('come here')
//             res.status(200).send(content)
//         })
//     })
// })

//-----------------------------------------------------------------
router.get('/', async function (req, res) {
    id = req.query.id
    var premium;
    if (typeof (req.session.data) === 'undefined' || typeof (req.session.data) === 'null'){
        premium = 0;
    } else premium = req.session.data.premium;
    var data = await postModel.getPostByID(id, premium);
    if (data === "Post cann't found" || data === "you need up your account to premium"){
        res.send(data);
        return;
    }
    var postRelevant = await postModel.getRandomPostByCat2(data['keyCat2'])
    res.send(postRelevant);
    return;
    // res.render('posts/post-detail', {
    //     post: data,

    // })
})

router.get('/testing', async function (req, res){
    const textQuery = req.query.text;
    console.log(textQuery)
    var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
    var index = client.initIndex('Post');

  // Perform an Algolia search:
  // https://www.algolia.com/doc/api-reference/api-methods/search/
    var ans = await index.search(textQuery);
    res.send(ans);
})

module.exports = router;
