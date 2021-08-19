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

router.get('/', auth.isEditor, async function (req, res) {
    page = 1
    var user = await userModel.getUserByUserName(req.session.data.userName)
    const list_post = await drafModel.getDrafPostByCat1(user.adminCat, page)
    var totalPage = 1;
    res.render('vwEditor/vieweditordraft', { layout: 'editor.hbs', db: list_post, page: page, totalPage: totalPage });
})

// Load các bài báo chờ duyệt

router.get('/view/draf-post', auth.isEditor, async function (req, res) {
    res.locals.successMsg = req.session.successMsg;
    req.session.successMsg = ''
    page = req.query.page || 1
    var user = await userModel.getUserByUserName(req.session.data.userName)
    const list_post = await drafModel.getDrafPostByCat1(user.adminCat, page)
    var totalPage = drafModel.getTotalPageDraftPost(user.adminCat)
    console.log(list_post);
    res.render('vwEditor/vieweditordraft',{layout:'editor.hbs',db:list_post,page:page,totalPage:totalPage});
})

// load các bài editor đó đã reject

router.get('/view/reject-post', auth.isEditor, async function (req, res) {
    page = req.query.page || 1
    const list_post = await rejectModel.getRejectPostByEditor(page, req.session.data.userName)
    var totalPage = await rejectModel.getTotalPageByEditor('RejectPost', req.session.data.userName)
    res.render('vwEditor/vieweditorreject', { layout: 'editor.hbs', db: list_post, page: page, totalPage: totalPage });
})

router.get('/view/reject-post/:id', auth.isEditor, async function (req, res) {
    id = req.params.id
    const post = await rejectModel.getRejectPostByID(id);
    if (post.userEditor !== req.session.data.userName){
        res.send('you dont have permission')
        return;
    }
    res.render('vwEditor/viewRejectedPost', {layout: 'editor.hbs', db: post})
})

// Load các bài đã duyệt từ editor đó

router.get('/view/post', auth.isEditor, async function (req, res) {
    page = req.query.page || 1
    const list_post = await waitingModel.getPostByEditor(req.session.data.userName, page)
    var totalPage = await postModel.getTotalPageByEditor(req.session.data.userName)
    res.render('vwEditor/vieweditoraccepted', { layout: 'editor.hbs', db: list_post, page: page, totalPage: totalPage });
})

// load bài đã duyệt
router.get('/view/post/:id', auth.isEditor, async function (req, res) {
    status = req.query.status
    id = req.params.id
    var post
    console.log(id, status)
    if (status == 1) {
        post = await postModel.getPostByID(id, 1)
        if (post.userEditor !== req.session.data.userName) {
            res.send('You dont have permission')
            return;
        }
        res.render('vwEditor/viewPost', { layout: 'editor.hbs', db: post });
    }
    else {
        post = await waitingModel.getPostByID(id)
        if (post.userEditor !== req.session.data.userName) {
            res.send('You dont have permission')
            return;
        }
        res.render('vwEditor/viewPost', { layout: 'editor.hbs', db: post });
    }

})

// Duyệt bài
router.get('/confirm/:id', auth.isCensor, async function (req, res) {
    const id = req.params.id
    const post = await drafModel.getDrafPostByID(id)
    res.render('vwEditor/confirmpost', { layout: 'editor.hbs', db: post });
})

router.post('/confirm/reject/:id', auth.isCensor, async function (req, res) {
    const data = req.body
    const id = req.params.id
    const result = await drafModel.rejectPost(id, data, req.session.data.userName)
    if (req.session.data.permission === 1){
        req.session.successMsg = "Đã từ chối bài viết."
        res.redirect('/admin/view/draft-post')

    } else {
        req.session.successMsg = "Đã từ chối bài viết."
        res.redirect('/editor/view/draf-post')
    }
})

router.post('/confirm/accept/:id', auth.isCensor, async function (req, res) {
    var data = req.body
    const id = req.params.id
    const t = new Date(data.dateUpload)
    var hour = data.timeUpload[0] + data.timeUpload[1]
    var minute = data.timeUpload[3] + data.timeUpload[4]
    data.dateUpload = t.getTime() + hour * 60 * 60 * 1000 + minute * 60 * 1000;
    delete data['timeUpload']
    const result = await drafModel.acceptPost(id, data, req.session.data.userName)
    if (req.session.data.permission === 1){
        req.session.successMsg = "Đã duyệt thành công."
        res.redirect('/admin/view/draft-post')

    } else {
        req.session.successMsg = "Đã duyệt thành công."
        res.redirect('/editor/view/draf-post')
    }
})

module.exports = router;