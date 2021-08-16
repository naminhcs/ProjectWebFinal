const express = require('express');
const bodyParser = require('body-parser')

const multer = require('multer')
const imgModel = require('../models/imgController')
const postModel = require('../models/postController');
const auth = require('../middlewares/authMethod');
const saveModel = require('../models/SavePostController')

const upload = multer({
    sotrage: multer.memoryStorage()
})

const router = express.Router();
router.use(bodyParser.json())
//
// router.get('/',  async function(req, res){
//     // const data = await postModel.getAllPostByNickName(req.session.data.nickName)
//     // res.send(data)
//     res.render('vwWriter/dashboard',{layout:'writer.hbs'});
// })
// router.get('/upload',  async function(req, res){
//     // const data = await postModel.getAllPostByNickName(req.session.data.nickName)
//     // res.send(data)
//     res.render('vwWriter/createpost',{layout:'writer.hbs'});
// })
// router.get('/edit',  async function(req, res){
//     // res.render('....')
//     res.render('vwWriter/editpost',{layout:'writer.hbs'});
// })

router.post('/add/save', upload.single('file'), async function(req, res){
    const data = req.body
    const id = req.query.id || -1
    var file;
    if (!req.file) file = null;
    const result = await saveModel.savePostByID(id, data, file)
    res.send(result)
})

router.post('/add/submit', upload.single('file'), async function(req, res){
    const data = req.body
    const id = req.query.id || -1
    var file;
    if (!req.file) file = null
    const result = await saveModel.submitPost(id, data, file)
    res.send(result)
})

router.get('/view/writing-post', async function(req, res){
    const page = req.query.page
    const posts = await saveModel.getSavePostByWriter(req.session.data.userName, page)
    res.send(posts)
})

module.exports = router;