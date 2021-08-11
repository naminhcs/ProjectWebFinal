const express = require('express')
const bodyParser = require('body-parser');
const auth = require('../middlewares/authMethod')

const commentModel = require('../models/commentController')
const comment = require('../models/commentModel')

const router = express.Router();
router.use(bodyParser.json());

router.post('/add', auth.isLogin, async function (req, res) {
    var data = req.body
    console.log(data)
    const cmt = new comment(data)
    var dataPush = {}
    for (x in cmt) {
        dataPush[x] = cmt[x]
    }
    const result = await commentModel.addComment(dataPush)
    res.redirect('/post?id=' + String(data.postID))
})

router.get('/allcmt', async function (req, res) {
    var id = req.query.id
    const result = await commentModel.getAllComment(id)
    res.send(result)
})

module.exports = router;