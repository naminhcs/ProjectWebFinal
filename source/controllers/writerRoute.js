const express = require('express');
const bodyParser = require('body-parser')

const multer = require('multer')
const imgModel = require('../models/imgController')
const postModel = require('../models/postController');
const auth = require('../middlewares/authMethod');
const saveModel = require('../models/SavePostController')
const rejectModel = require('../models/RejectPostController')


const upload = multer({
    sotrage: multer.memoryStorage()
})

const router = express.Router();
router.use(bodyParser.json())
//
router.get('/', async function (req, res) {
    res.render('vwWriter/dashboard', {
        layout: 'writer.hbs'
    });
})

// ======================== add post ===========================
router.get('/add', function (req, res) {
    res.render('vwWriter/createpost', {
        layout: 'writer.hbs'
    })
})

router.post('/add/save', upload.single('file'), async function (req, res) {
    const data = req.body
    const id = req.query.id || -1;
    var file;
    if (!req.file) file = null; else file = req.file
    const result = await saveModel.savePostByID(id, data, file)
    res.send(result)
})

router.post('/add/submit', upload.single('urlPic'), async function (req, res) {
    const data = req.body;
    console.log(data)
    const id = req.query.id || -1
    var file;
    if (!req.file) file = null; else file = req.file
    console.log(req.file)
    // const result = await saveModel.submitPost(id, data, file)
    // res.send(result)
    res.send('ok')
})


// ===================== writing-post(SAVE) ======================
router.get('/view/writing-post', async function (req, res) {
    page = req.query.page || 1
    obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'SavePost')
    var nPages = 1
    res.render('vwWriter/writing-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages
    });
})


router.get('/edit/writing-post', async function (req, res) {
    var id = req.query.id;
    obj = await saveModel.getPostByID(id, 'SavePost')
    res.render('vwWriter/writing/editpost', {
        layout: 'writer.hbs',
        db: obj,
    });
})

//=====================Reject-post ===========================
router.get('/view/reject-post', async function(req, res){
    page = req.query.page || 1
    const obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'RejectPost')
    res.send(obj)
})

router.get('/edit/reject-post/:id', async function(req, res){
    id = req.params.id
    const obj = await saveModel.getPostByID(id, 'RejectPost')
    res.send(obj)
})

// after edit, save post in rejectPost
router.post('/edit/reject-post/save/:id', upload.single('urlPic'), async function(req, res){
    const body = req.body
    var file;
    if (!req.file) file = null; else file = req.file
    const result = await rejectModel.editRejectPost(id, body, file)
    res.send(result)
})

// after edit, submit post to drafPost
router.post('/edit/reject-post/submit/:id', upload.single('urlPic'), async function(req, res){
    const body = req.body
    var file;
    if (!req.file) file = null; else file = req.file
    const result = await rejectModel.submitRejectPost(id, body, file)
    res.send(result)
})

router.post('/del/reject-post/:id', async function(req, res){
    const id = req.params.id
    const result = await saveModel.delelteSavePost(id, 'RejectReason')
    res.send(result)
})

// ===================== waiting-post ======================
router.get('/view/waiting-post', async function (req, res) {
    page = req.query.page || 1
    var obj;
    obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'WaitingPost')
    var nPages = 1
    res.render('vwWriter/waiting-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages
    });
})

router.get('/view/waiting-post/:id', async function(req, res){
    id = req.params.id
    var obj = await saveModel.getPostByID(id, 'WaitingPost')
    res.send(obj)
})

// ======================post================================

router.get('/view/public', async function (req, res) {
    page = req.query.page || 1
    var obj;
    obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'Post')
    var nPages = 1
    res.send({
        db: obj,
        totalPage: nPages
    })
})

router.get('/view/public/:id', async function(req, res){
    id = req.params.id
    var obj = await saveModel.getPostByID(id, 'Post')
    res.send(obj)
})



module.exports = router;