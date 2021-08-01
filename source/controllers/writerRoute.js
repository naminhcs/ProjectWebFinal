const express = require('express');
const bodyParser = require('body-parser')
const postModel = require('../models/postController');
const auth = require('../middlewares/authMethod')

const router = express.Router();
router.use(bodyParser.json())

router.get('/getallpost', auth.isWriter, async function(req, res){
    const data = await postModel.getAllPostByNickName(req.session.data.nickName)
    res.send(data)
})

router.get('/edit', auth.isWriter, async function(req, res){
    res.render('....')
})

router.post('/edit', auth.isWriter, async function(req, res){
    var data = req.body
    id = data.id
    delete data['id']
    result = await postModel.editPost(data, id)
    res.send(result)
})

router.post('/upload', auth.isWriter, async function(req, res){
    const data = req.body;
    result = await postModel.addPost(data)
    res.send(result)
})

module.exports = router;