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
//auth.isAdmin,
router.get('/',  async function(req, res){
    res.render('vwAdmin/dashboard',{layout:'admin.hbs'});
})

router.get('/tag',  async function(req, res){
    // var data = await tagModel.getAllTag()
    // res.send(data);
    // console.log(data);
    res.render('vwAdmin/tag',{layout:'admin.hbs'});
})

router.get('/tag/gettagbyid/:id',  async function(req, res){



    id = req.params.id;
    var data = await tagModel.getTagByID(id)
    res.send(data);
})

router.get('/tag/edit/:id',  async function(req, res){
    id = req.params.id;
    var data = await tagModel.getTagByID(id);
    console.log(data);
    // res.send(data);
    res.render('vwAdmin/edittag',{layout:'admin.hbs',db:data,id:id});
})

router.post('/tag/edit/:id',  async function(req, res){
    const data = req.body;
    console.log.data();
    id = req.params.id;
    // const result = await tagModel.editTag(data)
    // res.send(result)
    var newdir="/admin/tag/view/"+String(id);
    res.redirect(newdir);
})

router.get('/tag/view/:id',  async function(req, res){
    id = req.params.id;
    var data = await tagModel.getTagByID(id);
    console.log(data);
    // res.send(data);
    res.render('vwAdmin/viewtag',{layout:'admin.hbs',db:data,id:id});
})
router.post('/tag/view/:id',  async function(req, res){
    const data = req.body;
    id = req.params.id;
    // const result = await tagModel.editTag(data)
    // res.send(result)
    var newdir="/admin/tag/edit/"+String(id);
    res.redirect(newdir);
})

router.get('/tag/add',  async function(req, res){
    res.render('vwAdmin/addtag',{layout:'admin.hbs'});
})

router.post('/tag/add',  async function(req, res){
    const data = req.body;
    const result = await tagModel.addTag(data)
    res.send(result)
})

router.post('/tag/del',  async function(req, res){
    id = req.body.id
    const result = await tagModel.delTag(id)
    res.send(result)
})

//-------------------------User------------------------------------------
router.get('/user',  async function(req, res){
    // var data = await userModel.getAllUser()
    // res.send(data);
    res.render('vwAdmin/usermanagement',{layout:'admin.hbs'});

})

router.get('/user/view/:id',  async function(req, res){
    id = req.params.id;
    var data = await userModel.getUserByID(id)
    console.log(data);
    res.render('vwAdmin/viewuser',{layout:'admin.hbs',db:data});

    // res.send(data);

})

// router.get('/user/edit/:id',  async function(req, res){
//     id = req.params.id;
//     var data = await userModel.getUserByID(id)
//     res.send(data);
// })

router.post('/user/edit',  async function(req, res){
    const data = req.body;
    result = await userModel.editUser(data)
    res.send(result);
})

router.get('/user/add',  async function(req, res){
    res.send('direct')
})

router.post('/user/add',  async function(req, res){
    const data = req.body;
    result = await userModel.addUser(data)
    res.send(result)
})

router.post('/user/del',  async function(req, res){
    id = req.body.id
    result = await userModel.delUser(id)
    res.send(result)
})


//-------------------------Post-------------------------------------------
router.get('/post',  async function(req, res){
    // var data = await postModel.getAllPost()
    // res.send(data);
    res.render('vwAdmin/post',{layout:'admin.hbs'});
})

router.get('/post/view/:id',  async function(req, res){
    id = req.params.id;
    var data = await postModel.getPostByID(id);
    // res.send(data);
    console.log(data);
    res.render('vwAdmin/viewpost',{layout:'admin.hbs',db: data});
})
router.post('/post/view/:id',  async function(req, res){
    const data = req.body;
    id = req.params.id;
    // const result = await tagModel.editTag(data)
    // res.send(result)
    var newdir="/admin/post/edit/"+String(id);
    res.redirect(newdir);
})
router.get('/post/edit/:id',  async function(req, res){
    id = req.params.id;
    var data = await postModel.getPostByID(id)
    // res.send(data);
    console.log(data);
    res.render('vwAdmin/editpost',{layout:'admin.hbs',db: data});
    // res.render('vwAdmin/editpost',{layout:'admin.hbs'});
})

router.post('/post/edit/:id',  async function(req, res){
    const id = req.body.id
    var data = req.body;
    delete data['id'] 
    result = await postModel.editPost(data, id)
    res.send(result)
})

router.get('/post/add',  async function(req, res){
    res.send('direct')
})

router.post('/post/add',  async function(req, res){
    const data = req.body;
    result = await postModel.addPost(data)
    return result;
})

router.post('/post/del',  async function(req, res){
    const id = req.body.id;
    result = await postModel.delPost(id);
    res.send(result)
})

//--------------------------------Writer----------------------//
router.get('/writer/getallpost',  async function(req, res){
    var data = await postModel.getAllPost()
    res.send(data);
})
router.get('/writer',  function(req, res){
    
    res.render('vwWriter/dashboard',{layout:'writer.hbs'});
})
router.get('/writer/upload',  function(req, res){
    res.render('vwWriter/createpost',{layout:'writer.hbs'});
})
router.get('/writer/view/:id',  async function(req, res){
    id = req.params.id;
    var data = await postModel.getPostByID(id)
    // res.send(data);
    console.log(data);
    res.render('vwWriter/viewpost',{layout:'writer.hbs',db:data});
})
//--------------------------------Category--------------------//
router.get('/category',  async function(req, res){

    res.render('vwAdmin/category',{layout:'admin.hbs'});
})


module.exports = router;