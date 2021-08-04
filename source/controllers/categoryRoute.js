const express = require('express');
const bodyParser = require('body-parser')
const cateModel = require('../models/categoryController');
const postModel = require('../models/postController');

const router = express.Router();
router.use(bodyParser.json());

// router.post('/add', async function(req, res){
//     const data = req.body;
//     result = await cateModel.addCategory(data)
//     res.send(result)
// })

// router.get('/getall', async function(req, res){
//     const data = await cateModel.getAllCategory()
//     res.send(data)
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

// get 10post/page    (category2)
router.get('/:cat1/:cat2', async function (req, res) {
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    const page = req.query.page || 1
    var ans = await postModel.getPostByCat2(cat2, page);
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)
    const nPages = 5
    // res.send(jsonAns)
    res.render('posts/categories', {
        data: jsonAns,
        isEmpty: jsonAns.length,
        page_numbers: processingNumberOfPagesToView(nPages, page),
        nameCat1: jsonAns['0']['nameCat1'],
        nameCat2: jsonAns['0']['nameCat2']
    })
})



// get 10 posts/page (category1)
router.get('/:cat1', async function (req, res) {
    const cat1 = req.params.cat1
    const page = req.query.page || 1
    var ans = await postModel.getPostByCat1(cat1, page);
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)
    const nPages = 5
    // res.send(jsonAns)
    res.render('posts/categories',  {
        data: jsonAns,
        isEmpty: jsonAns.length,
        page_numbers: processingNumberOfPagesToView(nPages, page),
        nameCat1: jsonAns['0']['nameCat1']
    })
})

module.exports = router;