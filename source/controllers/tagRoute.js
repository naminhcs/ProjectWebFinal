const express = require('express');
const bodyParser = require('body-parser')
const tag = require('../models/tagModel')


const tagModel = require('../models/tagController');
const postModel = require('../models/postController');
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

// util function
function processingNumberOfPagesToView(nPages, page) { // needing to get total pages of cat
    var page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrent: i === +page
        });
    }
    return page_numbers
}

router.get('/:key', async function(req, res){
    const key = req.params.key;
    const page = req.query.page | 1
    var ans;
    var premium = 0;
    if (typeof(req.session.data) === 'undefined' || req.session.data === null){
        premium = 0
    } else premium = req.session.data.premium;
    if (premium){
        ans = await postModel.getPostPremiumByTag(key)
    } else ans = await postModel.getPostByTag(key, page)
    
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)

    // res.send(jsonAns)
    res.render('posts/categories',  {
        data: jsonAns,
        isEmpty: jsonAns.length,
        page_numbers: processingNumberOfPagesToView(1, 1),
        isTag: true
    })
})

module.exports = router;