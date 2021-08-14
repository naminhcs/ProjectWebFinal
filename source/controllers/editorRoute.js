const express = require('express');
const bodyParser = require('body-parser')
const postModel = require('../models/postController');
const tagModel = require('../models/tagController')
const auth = require('../middlewares/authMethod')
const waittingPost = require('../models/waittingPostController')

const router = express.Router();
router.use(bodyParser.json())
//auth.isEditor,

router.get('/view', async function(req, res){
    page = req.query.page
    const posts = await getWaittingPostByUserName(req.session.data.userName, page)
    res.send(posts)
})

module.exports = router;