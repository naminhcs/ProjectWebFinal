const express = require('express');
const bodyParser = require('body-parser')


const postModel = require('../models/postController');
const router = express.Router();
router.use(bodyParser.json());

router.get('/', async function (req, res) {
    id = req.query.id
    var permission;
    if (typeof (req.session.data) === 'undefined' || typeof (req.session.data) === 'null'){
        permission = 0;
    } else permission = req.session.data.permission;
    console.log(permission)
    var data = await postModel.getPostByID(id, permission);

    var relevenPosts = '' /*postModel.getRandomPost(res.locals.lcCategory)*/
    // var data = require('../assets/json_file/bai_viet_noi_bat.json');
    // res.send(data);
    // console.log(data['1550']['keyTags'])
    // console.log(data)
    res.render('posts/post-detail', {
        post: data,
        relevenPosts: relevenPosts,
    })
})

router.get('/testing', async function (req, res){
    const data = res.locals.lcCategory
    result = await postModel.setEditorForCat();
    res.send(result)
})

module.exports = router;
