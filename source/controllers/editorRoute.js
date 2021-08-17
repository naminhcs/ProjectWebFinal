const express = require('express');
const bodyParser = require('body-parser')
const postModel = require('../models/postController');
const tagModel = require('../models/tagController')
const auth = require('../middlewares/authMethod')

const userModel = require('../models/userController')
const waitingModel = require('../models/waitingPostController')
const drafModel = require('../models/DrafPostController')
const rejectModel = require('../models/RejectPostController')

const router = express.Router();
router.use(bodyParser.json())


router.get('/',auth.isEditor , function(req, res){
    res.render('vwEditor/vieweditor',{layout:'editor.hbs'});
})

// Load các bài báo chờ duyệt

router.get('/view/draf-post', auth.isEditor, async function(req, res){
    page = req.query.page || 1
    var user = await userModel.getUserByUserName(req.session.data.userName)
    const list_post = await drafModel.getDrafPostByCat1(user.adminCat, page)
    var totalPage = 20;
    res.render('vwEditor/vieweditordraft',{layout:'editor.hbs',db:list_post,page:page,totalPage:totalPage});
})

router.get('/view/reject-post', async function(req, res){
    page = req.query.page || 1
    // const posts = await rejectModel.getRejectPostByEditor(req.session.data.userName, page)
    // res.send(posts)
    var totalPage = 20;

    res.render('vwEditor/vieweditorreject',{layout:'editor.hbs',db:list_post,page:page,totalPage:totalPage});

})

router.get('/view/post', async function(req, res){
    page = req.query.page || 1
    // const posts = await waitingModel.getPostByEditor(page, req.session.data.userName)
    // res.send(posts)
    var totalPage = 20;
    res.render('vwEditor/vieweditoraccepted',{layout:'editor.hbs',db:list_post,page:page,totalPage:totalPage});
})

router.get('/view/post/:id', async function(req, res){
    status = req.query.status
    id = req.params.id
    // var post
    // if (status === 1){
    //     post = await postModel.getPostByID(id, 1)
    // } else post = await waitingModel.getPostByID(id)
    // res.send(post)
    if (status==1){
        res.render('vwEditor/viewacceptpost',{layout:'editor.hbs',db:_post});
    }
    else{
        res.render('vwEditor/viewrejectpost',{layout:'editor.hbs',db:_post});    
    }
    
})

router.get('/confirm/:id', async function(req, res){
    const id = req.params.id
    // const post = await drafModel.getDrafPostByID(id)
    // res.send(post)
    res.render('vwEditor/confirmpost',{layout:'editor.hbs',db:_post});
})

router.post('/confirm/reject/:id', async function(req, res){
    const data = req.body
    // const data = req.body
    // const result = await drafModel.rejectPost(id, data, req.session.data.userName)
    // res.send(result)
    console.log(data);
    // res.redirect('/reject');
})

router.post('/confirm/accept/:id', async function(req, res){
    const data = req.body
    // const result = await drafModel.acceptPost(id, data, req.session.data.userName)
    // res.send(result)
    console.log(data);
    // res.redirect('/successful');
})

module.exports = router;