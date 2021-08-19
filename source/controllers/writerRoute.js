const express = require('express');
const bodyParser = require('body-parser')

const multer = require('multer')
const imgModel = require('../models/imgController')
const postModel = require('../models/postController');
const auth = require('../middlewares/authMethod');
const saveModel = require('../models/SavePostController')
const rejectModel = require('../models/RejectPostController');
const draftModel = require('../models/DrafPostController')
const db = require('../db');


const upload = multer({
    sotrage: multer.memoryStorage()
})

const router = express.Router();
router.use(bodyParser.json())

router.get('/', auth.isWriter, async function (req, res) {
    // const data = await postModel.getAllPostByNickName(req.session.data.nickName)
    // res.send(data)
    res.render('vwWriter/writing/writing-posts', {
        layout: 'writer.hbs',
        isWritingPosts: true,
    });
})

// =========================================== add post =================================================
router.get('/add', auth.isWriter, function (req, res) {
    var obj = ''
    res.render('vwWriter/CreatePOst/createPost', {
        layout: 'writer.hbs',
        db: obj,
        isCreatePost: true,
    })
})

router.post('/add/save', auth.isWriter, upload.single('urlPic'), async function (req, res) {
    const data = req.body
    const id = req.query.id || -1;
    if (id === -1) {
        data['userWriter'] = req.session.data.userName
        data['nickName'] = req.session.data.nickName
    } else {
        var post = await saveModel.getPostByID(id, 'SavePost')
        if (post.userWriter !== req.session.data.userName) {
            req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
            res.redirect('/writer/view/writing-post')
            //res.send('You dont have permission for edit this post')
            return;
        }
    }
    var file;
    if (!req.file) file = null;
    else file = req.file
    const result = await saveModel.savePostByID(id, data, file)
    req.session.successMsg = 'Đã lưu bài báo'
    res.redirect('/writer/view/writing-post')
    //res.send(result)
})

router.post('/add/submit', auth.isWriter, upload.single('urlPic'), async function (req, res) {
    const data = req.body;
    const id = req.query.id || -1
    if (id === -1) {
        data['userWriter'] = req.session.data.userName
        data['nickName'] = req.session.data.nickName
    } else {
        var post = await saveModel.getPostByID(id, 'SavePost')
        if (post.userWriter !== req.session.data.userName) {
            req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
            res.redirect('/writer/view/draft-post')
            //res.send('You dont have permission for edit this post')
            return;
        }
    }
    var file;
    if (!req.file) file = null;
    else file = req.file
    const result = await saveModel.submitPost(id, data, file)

    req.session.successMsg = 'Đã nộp bài báo để duyệt!'
    res.redirect('/writer/view/draft-post')
    // res.send(result)
})

// ======================================== writing-post(SAVE) ============================================
router.get('/view/writing-post', auth.isWriter, async function (req, res) {
    page = req.query.page || 1
    var obj = ''
    obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'SavePost')
    var nPages = await saveModel.getTotalPage('SavePost', req.session.data.userName)

    res.locals.successMsg = req.session.successMsg;
    req.session.successMsg = ''

    res.locals.errorMsg = req.session.errorMsg;
    req.session.errorMsg = ''

    res.render('vwWriter/writing/writing-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages,
        page: page,
        isWritingPosts: true,
    });
})


router.get('/edit/writing-post', auth.isWriter, async function (req, res) {
    var id = req.query.id;
    const post = await saveModel.getPostByID(id, 'SavePost')
    if (post.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/draft-post')
        // res.send('you dont have permisson to edit this post')
        return;
    }

    post['id'] = id;
    // console.log(post)
    res.render('vwWriter/writing/edit-writing-post', {
        layout: 'writer.hbs',
        db: post,
        isWritingPosts: true,
    });
})

router.post('/del/writing-post/:id', auth.isWriter, async function (req, res) {
    var id = req.params.id;
    const post = await saveModel.getPostByID(id, 'SavePost')
    if (post.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/writing-post')
        // res.send('you dont have permisson to edit this post')
        return;
    }
    const result = await saveModel.delelteSavePost(id, 'SavePost')
    req.session.successMsg = 'Đã xóa bài báo'
    res.redirect('/writer/view/writing-post')
    //res.send(result)
})



// ======================================== draft-post================================================
router.get('/view/draft-post', auth.isWriter, async function (req, res) {
    page = req.query.page || 1
    var obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'DrafPost')
    var nPages = await saveModel.getTotalPage('DrafPost', req.session.data.userName)
    //console.log('list post: ', obj)

    res.locals.successMsg = req.session.successMsg;
    req.session.successMsg = ''

    res.locals.errorMsg = req.session.errorMsg;
    req.session.errorMsg = ''

    res.render('vwWriter/draft/draft-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages,
        page: page,
        isDraftPosts: true,
    });
})


router.get('/edit/draft-post', auth.isWriter, async function (req, res) {
    var id = req.query.id;
    var obj;
    obj = await saveModel.getPostByID(id, 'DrafPost')
    if (obj.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/draft-post')
        // res.send('you dont have permisson to edit this post')
        return;
    }

    obj['id'] = id;
    res.render('vwWriter/draft/edit-draft-post', {
        layout: 'writer.hbs',
        db: obj,
        isDraftPosts: true,
    });
})

router.post('/edit/draft-post', auth.isWriter, upload.single('urlPic'), async function (req, res) {
    var id = req.query.id;
    const data = req.body
    var obj;
    obj = await saveModel.getPostByID(id, 'DrafPost')
    if (obj.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/draft-post')
        // res.send('you dont have permisson to edit this post')
        return;
    }
    var file = null;
    if (!req.file) file = null;
    else file = req.file
    const result = await draftModel.editDraftPost(id, data, file);
    req.session.successMsg = 'Đã nộp bài báo để duyệt!'
    res.redirect('/writer/view/draft-post')
    //res.send(result)
})

router.post('/del/draft-post/:id', auth.isWriter, async function (req, res) {
    var id = req.params.id;
    const obj = await saveModel.getPostByID(id, 'DrafPost')
    if (obj.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/draft-post')
        //res.send('you dont have permisson to edit this post')
        return;
    }
    const result = await saveModel.delelteSavePost(id, 'DrafPost')
    req.session.successMsg = 'Đã nộp bài báo để duyệt!'
    res.redirect('/writer/view/draft-post')
    // res.send(result)
})

//===============================================Reject-post ==============================================
router.get('/view/reject-post', auth.isWriter, async function (req, res) {
    page = req.query.page || 1
    const obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'RejectPost')
    const nPages = await saveModel.getTotalPage('RejectPost', req.session.data.userName)

    res.locals.successMsg = req.session.successMsg;
    req.session.successMsg = ''

    res.locals.errorMsg = req.session.errorMsg;
    req.session.errorMsg = ''

    res.render('vwWriter/reject/reject-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages,
        page: page,
        isRejectPosts: true,
    });
})

router.get('/edit/reject-post', auth.isWriter, async function (req, res) {
    id = req.query.id
    const obj = await saveModel.getPostByID(id, 'RejectPost')
    if (obj.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/reject-post')
        // res.send('you dont have permisson to edit this post')
        return;
    }
    res.render('vwWriter/reject/edit-reject-post', {
        layout: 'writer.hbs',
        db: obj,
        isRejectPosts: true,
    });
})

// after edit, save post in rejectPost
router.post('/edit/reject-post/save/:id', auth.isWriter, upload.single('urlPic'), async function (req, res) {
    const body = req.body
    const id = req.params.id
    console.log(id)
    var post = await rejectModel.getRejectPostByID(id)
    console.log(post)
    if (post.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/reject-post')
        // res.send('you dont have permisson to edit this post')
        return;
    }
    var file = null;
    if (!req.file) file = null;
    else file = req.file
    const result = await rejectModel.editRejectPost(id, body, file)
    req.session.successMsg = 'Đã lưu bài báo!'
    res.redirect('/writer/view/reject-post')
    // res.send(result)
})

// after edit, submit post to drafPost
router.post('/edit/reject-post/submit/:id', auth.isWriter, upload.single('urlPic'), async function (req, res) {
    const body = req.body
    const id = req.params.id
    var post = await rejectModel.getRejectPostByID(id)
    if (post.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/reject-post')
        // res.send('you dont have permisson to edit this post')
        return;
    }
    var file;
    if (!req.file) file = null;
    else file = req.file
    const result = await rejectModel.submitRejectPost(id, body, file)
    req.session.successMsg = 'Đã nộp để lưu bài báo!'
    res.redirect('/writer/view/reject-post')
    // res.send(result)
})

router.post('/del/reject-post/:id', auth.isWriter, async function (req, res) {
    const id = req.params.id
    var post = await rejectModel.getRejectPostByID(id)
    if (post.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/reject-post')
        // res.send('you dont have permisson to edit this post')
        return;
    }
    const result = await saveModel.delelteSavePost(id, 'RejectPost')
    req.session.successMsg = 'Đã xóa bài báo!'
    res.redirect('/writer/view/reject-post')
    // res.send(result)
})


// ================================================ waiting-post =============================================
router.get('/view/waiting-post', auth.isWriter, async function (req, res) {
    page = req.query.page || 1
    obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'WaitingPost')
    var nPages = await saveModel.getTotalPage('WaitingPost', req.session.data.userName)

    res.locals.successMsg = req.session.successMsg;
    req.session.successMsg = ''

    res.locals.errorMsg = req.session.errorMsg;
    req.session.errorMsg = ''

    res.render('vwWriter/waiting/waiting-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages,
        page: page,
        isWaitingPosts: true,
    });
})

router.get('/preview/waiting-post/:id', auth.isWriter, async function (req, res) {
    id = req.params.id
    var obj = await saveModel.getPostByID(id, 'WaitingPost')
    if (obj.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/waiting-post')
        // res.send('you dont have permission to read this post')
        return;
    }
    res.render('vwWriter/waiting/view-wating-post.hbs', {
        layout: 'writer.hbs',
        db: obj,
        isWaitingPosts: true,
    })
})


// ======================================================= Public =================================================
router.get('/view/public', auth.isWriter, async function (req, res) {
    page = req.query.page || 1
    obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'Post')
    var nPages = await saveModel.getTotalPage('Post', req.session.data.userName)

    res.locals.successMsg = req.session.successMsg;
    req.session.successMsg = ''

    res.locals.errorMsg = req.session.errorMsg;
    req.session.errorMsg = ''

    res.render('vwWriter/public/public-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages,
        page: page,
        isPublicPosts: true,
    })
})

router.get('/view/public/:id', auth.isWriter, async function (req, res) {
    id = req.params.id
    var obj = await saveModel.getPostByID(id, 'Post')
    if (obj.userWriter !== req.session.data.userName) {
        req.session.errorMsg = 'Bạn không có quyền truy cập vào bài báo!'
        res.redirect('/writer/view/waiting-post')
        // res.send('you dont have permission to read this post')
        return;
    }
    res.render('vwWriter/public/view-public-post', {
        layout: 'writer.hbs',
        db: obj,
        isPublicPosts: true,
    })
    //res.send(obj)
})

module.exports = router;