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
const { addCat2, delCat2 } = require('../models/categoryController');
const db = require('../db');
const { getAmountTag } = require('../models/tagController');

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
    res.render('vwAdmin/category',{layout:'admin.hbs',db:data});
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

// --------------------------------------Edit cat 1-------------------------------------------------
router.get('/edit/cat/:cat1', async function(req, res){
    const data = catModel.getCat1ByKeyCat1(req.params.cat1)
    res.render('vwAdmin/editcat1',{layout:'admin.hbs',db:data});
})

router.post('/edit/cat/:cat1', async function (req, res){
    const cat1 = req.params.cat1
    const data = {
        keyCat1: req.body.keyCat1,
        nameCat1: req.body.nameCat1,
        adminCat: req.body.adminCat1
    }
    const result = await catModel.updateCat1(cat1, data)
    res.send(result)
})

// -----------------------------------Edit cat2 ------------------------------------------------------
router.get('/edit/cat/:cat1/:cat2', async function(req, res){
    const keyCat1 = req.params.cat1
    const keyCat2 = req.params.cat2
    var namecat1 = '';
    var namecat2 = '';
    const allCat = res.locals.lcCategory;
    Object.keys(allCat).forEach(key =>{
        var cat1 = allCat[key]
        if (cat1.keyCat1 === keyCat1){
            Object.keys(cat1.listCat).forEach(key2 =>{
                var objCat2 = cat1.listCat[key2]
                if (objCat2.keyCat2 === keyCat2){
                    namecat2 = objCat2.nameCat2
                }
            })
            namecat1 = cat1.nameCat1
        }
    })
    res.render('vwAdmin/editcat2',{layout:'admin.hbs', keycat1:keyCat1, keycat2:keyCat2, namecat1:namecat1, namecat2:namecat2});
})

router.post('/edit/cat/:cat1/:cat2', async function(req, res){
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    const data = {
        keyCat2: req.body.keyCat2,
        nameCat2: req.body.nameCat2
    }
    const result = await catModel.updateCat2(cat1, cat2, data)
    res.send(result)
})

//-------------------Delete Cat1-----------------------------------------------
router.get('/del/cat/:cat1', async function(req, res){
    res.render('')
})

router.post('/del/cat/:cat1', async function (req, res){
    const cat1 = req.params.cat1
    result = await catModel.delCat1(cat1)
    res.send(result)
})

//-------------------Delete cat2------------------------------------------------
router.get('/del/cat/:cat1/:cat2', async function(req, res){
    res.render('')
})

router.post('/del/cat/:cat1/:cat2', async function(req, res){
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    const result = await delCat2(cat1, cat2)
    res.send(result)
})

// -----------------------------Add Cat2 ------------------------------------------------
router.get('/add/cat/:cat1', async function(req, res){
    res.render('')
})

router.post('/add/cat/:cat1', async function (req, res){
    const cat1 = req.params.cat1
    const data = {
        keyCat2: req.body.keyCat2,
        nameCat2: req.body.nameCat2
    }
    const result = await addCat2(cat1, data)
    res.send(result)
})

// ----------------------------Add cat1 ------------------------------------------------
// router.get('/add/cat', async function(req, res){
//     res.render('')
// })

router.post('/add/cat', async function(req, res){
    const data = req.body
    var listCat2 = []
    for (let i = 0; i < data.listKey2.length; i++){
        var objCat2 = {
            keyCat2: data.listKey2[i],
            nameCat2: data.listName2[i]
        }
        listCat2.push(objCat2)
    }
    const objCat1 = {
        keyCat1: data.keyCat1,
        nameCat1: data.nameCat1,
        adminCat: data.adminCat1,
        listCat: listCat2
    }
    console.log(objCat1)
    const result = await catModel.addCat1(objCat1)
    res.send(result)
})

// //--------------------------End category-----------------------------

// //--------------------------Tag--------------------------------------
// //auth.isAdmin,
// router.get('/',  async function(req, res){
//     res.render('vwAdmin/dashboard',{layout:'admin.hbs'});
// })


router.get('/view/tag', async function(req, res){
    page = req.query.page || 1
    var data = await tagModel.getAllTag(page)
    var cnt = await tagModel.getAmountTag()
    var nPage = Math.floor(cnt / 15)
    if (cnt % 15 !== 0) nPage++
    res.send({
        data: data,
        totalPage: nPage
    });
})

router.get('/edit/tag/:id', async function(req, res){
    id = req.params.id;
    result = await tagModel.getTagByID(id)
    res.send(result)
})
router.post('/edit/tag/:id', async function(req, res){
    id = req.params.id;
    result = await tagModel.editTag(id, req.body)
    res.send(result);
})

router.post('/del/tag/:id', async function(req, res){
    id = req.params.id;
    result = await tagModel.delTag(id)
    res.send(result)
})


router.get('/add/tag', async function(req, res){
    res.send('/')
})

router.post('/add/tag', async function(req, res){
    result = await tagModel.addTag(req.body)
    res.send(result)
})

//-------------------------User------------------------------------------
router.get('/view/user/:type', async function(req, res){
    const type = req.params.type
    const page = req.query.page || 1
    var data;
    if (type === 'all'){
        data = await userModel.getAllUser(page)
    } else {
        data = await userModel.getUserByPermission(type, page)
    }
    var cnt = await userModel.countUserByPermission(type)
    var nPage = Math.floor(cnt / 15)
    if (cnt % 15 !== 0) nPage++
    res.send({
        data: data,
        totalPage: nPage
    });
})

router.get('/view/user/:id', async function(req, res){
    id = req.params.id;
    var data = await userModel.getUserByID(id)
    delete data['password']
    res.send(data);
})

router.get('/edit/user/:id', async function(req, res){
    id = req.params.id;
    var data = await userModel.getUserByID(id)
    delete data['password']
    res.send(data);
})

router.post('/edit/user/:id', async function(req, res){
    const data = req.body;
    if (req.body.permission === ''){
        delete req.body.permission
    }
    if (req.body.dayEndPremium === ''){
        delete req.body.dayEndPremium
    }
    console.log(req.body)
    var user = await userModel.getUserByID(req.params.id)
    result = await userModel.updateUserByUserName(user.userName, data)
    res.send(result);
})

router.post('/add/user', auth.isAdmin, async function(req, res){
    const data = req.body;
    const checkUserName = await userModel.getUserByUserName(data.userName);
    const checkGmail = await userModel.getUserByGmail(data.gmail);

    if (checkGmail !== null) {
        return 'Gmail is used';
    }

    if (checkUserName !== null) {
        return 'UserName is used';
    }
    var dataUser = new user(data);
    const dataPush = {};
    for (x in dataUser) {
        dataPush[x] = dataUser[x];
    }
    // Sending Email
    const token = generateAccessToken({
        userName: data.userName
    });
    const s = `http://localhost:3000/confirmation/${token}?type=confirm-account`;

    const mailOption = {
        from: 'noreply@webapp.com',
        to: data.gmail,
        subject: 'Confirm email',
        text: s
    }
    await transporter.sendMail(mailOption)
    // ---- Add user to database
    await userModel.addUser(dataPush);
    res.send('Check gmail to confirm')
})

router.post('/del/user/:id', async function(req, res){
    id = req.body.id
    result = await userModel.delUser(id)
    res.send(result)
})


// //-------------------------Post-------------------------------------------
router.get('/view/post/:cat1', async function(req, res){
    cat1 = req.params.cat1
    page = req.query.page | 1
    const data = await postModel.getPostPremiumByCat1(cat1, page)
    var obj = []
    for (let i = 0; i < data.length; i++){
        var val = data[i]
        const t = new Date(val.dateUpload)
        const s = t.toGMTString()
        var dataPush = {
            id: val.id,
            nameCat1: val.nameCat1, 
            nameCat2: val.nameCat2,
            title: val.title, 
            nickName: val.nickName, 
            dateUpload: s, 
            view: val.view, 
            permission: val.permission
        }
        obj.push(dataPush)
    }
    const cnt = await postModel.getPagePremium(cat1);
    var nPages = Math.floor(cnt / 10);
    if (cnt % 10 !== 0) nPages++;
    res.send({
        data: obj,
        totalPage: nPages
    })
})
// router.get('/post',  async function(req, res){
//     // var data = await postModel.getAllPost()
//     // res.send(data);
//     res.render('vwAdmin/post',{layout:'admin.hbs'});
// })

// router.get('/post/view/:id',  async function(req, res){
//     id = req.params.id;
//     var data = await postModel.getPostByID(id);
//     // res.send(data);
//     console.log(data);
//     res.render('vwAdmin/viewpost',{layout:'admin.hbs',db: data});
// })
// router.post('/post/view/:id',  async function(req, res){
//     const data = req.body;
//     id = req.params.id;
//     // const result = await tagModel.editTag(data)
//     // res.send(result)
//     var newdir="/admin/post/edit/"+String(id);
//     res.redirect(newdir);
// })
// router.get('/post/edit/:id',  async function(req, res){
//     id = req.params.id;
//     var data = await postModel.getPostByID(id)
//     // res.send(data);
//     console.log(data);
//     res.render('vwAdmin/editpost',{layout:'admin.hbs',db: data});
//     // res.render('vwAdmin/editpost',{layout:'admin.hbs'});
// })

// router.post('/post/edit/:id',  async function(req, res){
//     const id = req.body.id
//     var data = req.body;
//     delete data['id'] 
//     result = await postModel.editPost(data, id)
//     res.send(result)
// })

// router.get('/post/add',  async function(req, res){
//     res.send('direct')
// })

// router.post('/post/add',  async function(req, res){
//     const data = req.body;
//     result = await postModel.addPost(data)
//     return result;
// })

// router.post('/post/del',  async function(req, res){
//     const id = req.body.id;
//     result = await postModel.delPost(id);
//     res.send(result)
// })

// //--------------------------------Writer----------------------//
// router.get('/writer/getallpost',  async function(req, res){
//     var data = await postModel.getAllPost()
//     res.send(data);
// })
// router.get('/writer',  function(req, res){
    
//     res.render('vwWriter/dashboard',{layout:'writer.hbs'});
// })
// router.get('/writer/upload',  function(req, res){
//     res.render('vwWriter/createpost',{layout:'writer.hbs'});
// })
// router.get('/writer/view/:id',  async function(req, res){
//     id = req.params.id;
//     var data = await postModel.getPostByID(id)
//     // res.send(data);
//     console.log(data);
//     res.render('vwWriter/viewpost',{layout:'writer.hbs',db:data});
// })
// //--------------------------------Category--------------------//
// // router.get('/category',  async function(req, res){

   
// // })

// //--------------------------------muc luc--------------------//
// router.get('/category',  async function(req, res){
//     res.render('vwAdmin/category_select',{layout:'admin.hbs'});
// })
// router.get('/tag',  async function(req, res){
//     res.render('vwAdmin/tag',{layout:'admin.hbs'});
// })
// router.get('/post',  async function(req, res){
//     res.render('vwAdmin/post',{layout:'admin.hbs'});
// })
// router.get('/user',  async function(req, res){
//     res.render('vwAdmin/user',{layout:'admin.hbs'});
// })
// // //--------------------------------view--------------------//
// router.get('/view/tag',  async function(req, res){
//     res.render('vwAdmin/viewtag',{layout:'admin.hbs'});
// })
// router.get('/view/cat1',  async function(req, res){
//     res.render('vwAdmin/viewcat1',{layout:'admin.hbs'});
// })
// router.get('/view/cat2/',  async function(req, res){
//     res.render('vwAdmin/viewcat2',{layout:'admin.hbs'});
// })
// router.get('/view/post/',  async function(req, res){
//     res.render('vwAdmin/viewpost',{layout:'admin.hbs'});
// })
// router.get('/view/user/',  async function(req, res){
//     res.render('vwAdmin/viewuser',{layout:'admin.hbs'});
// })
// // //--------------------------------add--------------------//
// router.get('/addd/tag',  async function(req, res){
//     res.render('vwAdmin/addtag',{layout:'admin.hbs'});
// })
// router.get('/addd/cat1',  async function(req, res){
//     res.render('vwAdmin/addcat1',{layout:'admin.hbs'});
// })
// router.get('/addd/cat2/',  async function(req, res){
//     res.render('vwAdmin/addcat2',{layout:'admin.hbs'});
// })
// router.get('/addd/post/',  async function(req, res){
//     res.render('vwAdmin/addpost',{layout:'admin.hbs'});
// })
// router.get('/addd/user/',  async function(req, res){
//     res.render('vwAdmin/adduser',{layout:'admin.hbs'});
// })

// // //--------------------------------edit--------------------//
// router.get('/edit/tag',  async function(req, res){
//     res.render('vwAdmin/edittag',{layout:'admin.hbs'});
// })
// router.get('/edit/cat1',  async function(req, res){
//     res.render('vwAdmin/editcat1',{layout:'admin.hbs'});
// })
// router.get('/edit/cat2/',  async function(req, res){
//     res.render('vwAdmin/editcat2',{layout:'admin.hbs'});
// })
// router.get('/edit/post/',  async function(req, res){
//     res.render('vwAdmin/editpost',{layout:'admin.hbs'});
// })
// router.get('/edit/user/',  async function(req, res){
//     res.render('vwAdmin/edituser',{layout:'admin.hbs'});
// })

// // //--------------------------------del--------------------//
// router.get('/table',  async function(req, res){
//     res.render('vwAdmin/table_test',{layout:'admin.hbs'});
// })


// module.exports = router;
// router.get('/post/getallpost', auth.isAdmin, async function(req, res){
//     var data = await postModel.getAllPost()
//     res.send(data);
// })

router.get('/view/post/:cat1/:cat2', async function(req, res){
    cat1 = req.params.cat1;
    cat2 = req.params.cat2;
    page = req.query.page | 1
    const data = await postModel.getPostPremiumByCat2(cat2, page)
    var obj = []
    for (let i = 0; i < data.length; i++){
        var val = data[i]
        const t = new Date(val.dateUpload)
        const s = t.toGMTString()
        var dataPush = {
            id: val.id,
            nameCat1: val.nameCat1, 
            nameCat2: val.nameCat2,
            title: val.title, 
            nickName: val.nickName, 
            dateUpload: s, 
            view: val.view, 
            permission: val.permission
        }
        obj.push(dataPush)
    }
    const cnt = await postModel.getPagePremium(cat2);
    var nPages = Math.floor(cnt / 10);
    if (cnt % 10 !== 0) nPages++;
    res.send({
        data: obj,
        totalPage: nPages
    })
})

router.get('/edit/post/:id', async function(req, res){
    id = req.params.id;
    var data = await postModel.getPostByID(id)
    res.send(data);
})

router.post('/edit/post/:id', async function(req, res){
    const id = req.params.id
    var data = req.body;
    
    result = await postModel.editPostForAdmin(id, data)
    res.send(result)
})

router.get('/post/add', async function(req, res){
    res.send('direct')
})

router.post('/add/post', async function(req, res){
    const data = req.body;
    result = await postModel.addPost(data)
    return result;
})

router.post('/post/del/:id', async function(req, res){
    const id = req.params.id
    result = await postModel.delPost(id);
    res.send(result)
})

module.exports = router;



// {edit, view, add, del}/{cat, post, tag, user}/:  /:   
