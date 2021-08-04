const express = require('express');
const bodyParser = require('body-parser')


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

router.get('/testing', async function (req, res){
    const data = res.locals.lcCategory
    result = await postModel.getTopOfPostInEachCat1(data);
    res.send(result)
})

module.exports = router;
