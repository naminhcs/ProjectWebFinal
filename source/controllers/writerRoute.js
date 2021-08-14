const express = require('express');
const bodyParser = require('body-parser')
const postModel = require('../models/postController');
const auth = require('../middlewares/authMethod');
const { isWriter } = require('../middlewares/authMethod');

const router = express.Router();
router.use(bodyParser.json())
//
router.get('/',  async function(req, res){
    // const data = await postModel.getAllPostByNickName(req.session.data.nickName)
    // res.send(data)
    res.render('vwWriter/dashboard',{layout:'writer.hbs'});
})
router.get('/upload',  async function(req, res){
    // const data = await postModel.getAllPostByNickName(req.session.data.nickName)
    // res.send(data)
    res.render('vwWriter/createpost',{layout:'writer.hbs'});
})
router.get('/edit',  async function(req, res){
    // res.render('....')
    res.render('vwWriter/editpost',{layout:'writer.hbs'});
})



router.post('/edit',  async function(req, res){
    var data = req.body
    id = data.id
    delete data['id']
    result = await postModel.editPost(data, id)
    res.send(result)
})

router.post('/upload',  async function(req, res){
    const data = req.body;
    result = await postModel.addPost(data)
    res.send(result)
})

module.exports = router;