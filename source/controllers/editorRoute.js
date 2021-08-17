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
    var totalPage = 1;
    res.render('vwEditor/vieweditordraft',{layout:'editor.hbs',db:list_post,page:page,totalPage:totalPage});
})

// load các bài editor đó đã reject

router.get('/view/reject-post', auth.isEditor, async function(req, res){
    console.log('OKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK')
    page = req.query.page || 1
    const list_post = await rejectModel.getRejectPostByEditor(req.session.data.userName, page)
    var totalPage = await rejectModel.getTotalPageByEditor('RejectPost', req.session.data.userName)
    res.render('vwEditor/vieweditorreject',{layout:'editor.hbs',db:list_post,page:page,totalPage:totalPage});

})

// Load các bài đã duyệt từ editor đó

router.get('/view/post', auth.isEditor, async function(req, res){
    page = req.query.page || 1
    const list_post = await waitingModel.getPostByEditor(req.session.data.userName, page)
    var totalPage = await postModel.getTotalPageByEditor(req.session.data.userName)
    res.render('vwEditor/vieweditoraccepted',{layout:'editor.hbs',db:list_post,page:page,totalPage:totalPage});
})

// load bài đã duyệt
router.get('/view/post/:id', auth.isEditor, async function(req, res){
    status = req.query.status
    id = req.params.id
    var post
    if (status==1){
        post = await postModel.getPostByID(id, 1)
        if (post.userEditor !== req.session.data.userName){
            res.send('You dont have permission')
            return;
        }
        res.render('vwEditor/viewacceptpost',{layout:'editor.hbs',db:post});
    }
    else{
        post = await waitingModel.getPostByID(id)
        if (post.userEditor !== req.session.data.userName){
            res.send('You dont have permission')
            return;
        }
        res.render('vwEditor/viewrejectpost',{layout:'editor.hbs',db:post});    
    }
    
})

// Duyệt bài
router.get('/confirm/:id', auth.isEditor, async function(req, res){
    const id = req.params.id
    const post = await drafModel.getDrafPostByID(id)
    res.render('vwEditor/confirmpost',{layout:'editor.hbs',db:post});
})

router.post('/confirm/reject/:id', auth.isEditor, async function(req, res){
    const data = req.body
    const id = req.params.id
    const result = await drafModel.rejectPost(id, data, req.session.data.userName)
    res.send(result)
})

router.post('/confirm/accept/:id', async function(req, res){
    const data = req.body
    // const result = await drafModel.acceptPost(id, data, req.session.data.userName)
    // res.send(result)
    console.log(data);
    res.send(done)
    // res.redirect('/successful');
})

module.exports = router;