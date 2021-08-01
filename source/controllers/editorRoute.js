const express = require('express');
const bodyParser = require('body-parser')
const postModel = require('../models/postController');
const tagModel = require('../models/tagController')
const auth = require('../middlewares/authMethod')

const router = express.Router();
router.use(bodyParser.json())

router.get('/getallpost', auth.isEditor, async function(req, res){
    const data = await postModel.getAllPost()
    res.send(data)
})

router.get('/getalltag', auth.isEditor, async function(req, res){
    const data = await tagModel.getAllTag()
    res.send(data)
})

router.get('/updatestatus', auth.isEditor, async function(req, res){
    res.render('/')
})

router.post('/updatestatus', auth.isEditor, async function(req, res){
    const data = req.body;
    result = await postModel.updateStatusById(data.id, data.status);
    res.send(result)
})

router.get('/addtag', auth.isEditor, async function(req, res){
    res.render('/')
})

router.post('/addtag', auth.isEditor, async function(req, res){
    const data = req.body;
    result = await tagModel.addTag(data)
    res.send(result)
})

module.exports = router;