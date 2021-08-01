const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/authMethod')

const user = require('../models/userModel')
const post = require('../models/postModel')
const tag = require('../models/tagModel')

const userModel = require('../models/userController');
const postModel = require('../models/postController');
const tagModel = require('../models/tagController');

const router = express.Router();
router.use(bodyParser.json());

//--------------------------Tag--------------------------------------

router.get('/tag/getalltag', auth.isAdmin, async function(req, res){
    var data = await tagModel.getAllTag()
    res.send(data);
})

router.get('/tag/gettagbyid/:id', auth.isAdmin, async function(req, res){
    id = req.params.id;
    var data = await tagModel.getTagByID(id)
    res.send(data);
})

// router.get('/tag/edit', auth.isAdmin, async function(req, res){
//     var data = await tagModel.getTagByID(id)
//     res.send(data);
// })

router.post('/tag/edit', auth.isAdmin, async function(req, res){
    const data = req.body;
    const result = await tagModel.editTag(data)
    res.send(result)
})

router.get('/tag/add', auth.isAdmin, async function(req, res){
    res.send('direct')
})

router.post('/tag/add', auth.isAdmin, async function(req, res){
    const data = req.body;
    const result = await tagModel.addTag(data)
    res.send(result)
})

router.post('/tag/del', auth.isAdmin, async function(req, res){
    id = req.body.id
    const result = await tagModel.delTag(id)
    res.send(result)
})

//-------------------------User------------------------------------------
router.get('/user/getalluser', auth.isAdmin, async function(req, res){
    var data = await userModel.getAllUser()
    res.send(data);
})

router.get('/user/getuserbyid/:id', auth.isAdmin, async function(req, res){
    id = req.params.id;
    var data = await userModel.getUserByID(id)
    res.send(data);
})

// router.get('/user/edit/:id', auth.isAdmin, async function(req, res){
//     id = req.params.id;
//     var data = await userModel.getUserByID(id)
//     res.send(data);
// })

router.post('/user/edit', auth.isAdmin, async function(req, res){
    const data = req.body;
    result = await userModel.editUser(data)
    res.send(result);
})

router.get('/user/add', auth.isAdmin, async function(req, res){
    res.send('direct')
})

router.post('/user/add', auth.isAdmin, async function(req, res){
    const data = req.body;
    result = await userModel.addUser(data)
    res.send(result)
})

router.post('/user/del', auth.isAdmin, async function(req, res){
    id = req.body.id
    result = await userModel.delUser(id)
    res.send(result)
})


//-------------------------Post-------------------------------------------
router.get('/post/getallpost', auth.isAdmin, async function(req, res){
    var data = await postModel.getAllPost()
    res.send(data);
})

router.get('/post/getpostbyid/:id', auth.isAdmin, async function(req, res){
    id = req.params.id;
    var data = await postModel.getPostByID(id)
    res.send(data);
})

router.get('/post/edit/:id', auth.isAdmin, async function(req, res){
    id = req.params.id;
    var data = await postModel.getPostByID(id)
    res.send(data);
})

router.post('/post/edit', auth.isAdmin, async function(req, res){
    const id = req.body.id
    var data = req.body;
    delete data['id'] 
    result = await postModel.editPost(data, id)
    res.send(result)
})

router.get('/post/add', auth.isAdmin, async function(req, res){
    res.send('direct')
})

router.post('/post/add', auth.isAdmin, async function(req, res){
    const data = req.body;
    result = await postModel.addPost(data)
    return result;
})

router.post('/post/del', auth.isAdmin, async function(req, res){
    const id = req.body.id;
    result = await postModel.delPost(id);
    res.send(result)
})

module.exports = router;