const express = require('express');
const bodyParser = require('body-parser')
const postModel = require('../models/postController');
const tagModel = require('../models/tagController')
const auth = require('../middlewares/authMethod')
const waittingPost = require('../models/waittingPostController')

const router = express.Router();
router.use(bodyParser.json())
//auth.isEditor,

router.get('/', function(req, res){
    res.render('vwEditor/dashboard',{layout:'editor.hbs'});
})
router.get('/view/post', function(req, res){
    res.render('vwEditor/vieweditor',{layout:'editor.hbs'});
})
router.get('/view/draft', function(req, res){
    res.render('vwEditor/vieweditordraft',{layout:'editor.hbs'});
})
router.get('/view/post', function(req, res){
    res.render('vwEditor/viewpost',{layout:'editor.hbs'});
})
router.get('/confirm', function(req, res){
    res.render('vwEditor/confirmpost',{layout:'editor.hbs'});
})

module.exports = router;