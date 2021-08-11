const express = require('express');
const bodyParser = require('body-parser')
const postModel = require('../models/postController');
const tagModel = require('../models/tagController')
const auth = require('../middlewares/authMethod')

const router = express.Router();
router.use(bodyParser.json())
//auth.isEditor,

router.get('/',  async function(req, res){
    // const data = await postModel.getAllPost()
    // console.log(data);
    // res.send(data)
    res.render('vwEditor/dashboard',{layout:'editor.hbs'});
})

router.get('/getalltag',  async function(req, res){
    const data = await tagModel.getAllTag()
    res.send(data)
})

router.get('/updatestatus',  async function(req, res){
    res.render('/')
})

router.post('/updatestatus',  async function(req, res){
    const data = req.body;
    result = await postModel.updateStatusById(data.id, data.status);
    res.send(result)
})

router.get('/addtag',  async function(req, res){
    res.render('/')
})

router.post('/addtag',  async function(req, res){
    const data = req.body;
    result = await tagModel.addTag(data)
    res.send(result)
})

module.exports = router;