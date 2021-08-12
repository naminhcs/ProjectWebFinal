const express = require('express');
const bodyParser = require('body-parser');
const auth = require('../middlewares/authMethod')

const user = require('../models/userModel')
const post = require('../models/postModel')
const tag = require('../models/tagModel')

const userModel = require('../models/userController');
const postModel = require('../models/postController');
const tagModel = require('../models/tagController');
const catModel = require('../models/categoryController');

const router = express.Router();
router.use(bodyParser.json());


//--------------------------Category---------------------------------
router.get('/view/cat', async function (req, res){
    const listCat = await catModel.getAllCategory();
    var data = []
    for (let key in Object.keys(listCat)){
        var val = {}
        var doc = listCat[key]
        val['adminCat'] = doc.adminCat
        val['keyCat1'] = doc.keyCat1
        val['nameCat1'] = doc.nameCat1
        val['amountPre'] = await postModel.getAmountPostPremiumByCat(doc.keyCat1)
        val['amountNor'] = await postModel.getAmountPostByCat(doc.keyCat1)
        val['amountCat2'] = Object.keys(doc.listCat).length
        data.push(val)
    }
    res.send(data)
})

router.get('/view/cat/:cat1', async function(req, res){
    const cat1 = req.params.cat1;
    const listCat = await catModel.getAllCat2ByCat1(cat1)
    console.log(listCat)
    var data = []
    for (let key in Object.keys(listCat)){
        cat2 = listCat[key]
        var val = {}
        val['amountPre'] = await postModel.getAmountPostPremiumByCat(cat2.keyCat2)
        val['amountNor'] = await postModel.getAmountPostByCat(cat2.keyCat2)
        console.log(val['amountNor'], val['amountPre'])
        val['keyCat2'] = cat2.keyCat2
        val['nameCat2'] = cat2.nameCat2
        data.push(val)
    }
    res.send(data)
})

router.get('/edit/:cat1', async function(req, res){
    res.render('')
})

router.post('/edit/:cat1', async function (req, res){
    const cat1 = req.params.cat1
    const data = req.body;
    res.send('done')
    // const result = await catModel.updateCat1(cat1, req.body)
    // return result;
})

router.get('/edit/:cat1/:cat2', async function(req, res){
    res.render('')
})

router.post('/edit/:cat1/:cat2', async function(req, res){
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    console.log(cat1, cat2)
    const data = req.body
    res.send('done')
})

router.get('/del/:cat1', async function(req, res){
    res.render('')
})

router.post('/del/:cat1', async function (req, res){
    const cat1 = req.params.cat1
    console.log(cat1)
})

router.get('/del/:cat1/:cat2', async function(req, res){
    res.render('')
})

router.post('/del/:cat1/:cat2', async function(req, res){
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    console.log(cat1, cat2)
})

router.get('/add/:cat1', async function(req, res){
    res.render('')
})

router.post('/add/:cat1', async function (req, res){
    const cat1 = req.params.cat1
    const data = req.body
    console.log(cat1, data)
})


router.get('/add', async function(req, res){
    res.render('')
})

router.post('/add/', async function(req, res){
    const data = req.body
    console.log(data)
})
  


//--------------------------End category-----------------------------

//--------------------------Tag--------------------------------------

router.get('/', auth.isAdmin, async function(req, res){
    res.render('/')
})

router.get('/tag/getalltag', auth.isAdmin, async function(req, res){
    page = req.query.page | 1
    var data = await tagModel.getAllTag(page)
    res.send(data);
})

router.get('/tag/gettagbyid/:id', auth.isAdmin, async function(req, res){
    id = req.params.id;
    var data = await tagModel.getTagByID(id)
    res.send(data);
})

router.get('/tag/edit/:id', auth.isAdmin, async function(req, res){
    var data = await tagModel.getTagByID(id)
    res.send(data);
})

router.post('/tag/edit/:id', auth.isAdmin, async function(req, res){
    const data = req.body;
    const result = await tagModel.editTag(data)
    res.send(result)
})

router.get('/tag/add', auth.isAdmin, async function(req, res){
    res.send('/')
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

router.post('/post/edit/:id', auth.isAdmin, async function(req, res){
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