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
const draftModel = require('../models/DrafPostController')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const db = require('../db');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    }
});

const router = express.Router();
router.use(bodyParser.json());

function generateAccessToken(userName) {
    return jwt.sign(userName, process.env.TOKEN_SECRET, {
        expiresIn: '2000000s'
    });
};
//--------------------------Category---------------------------------
router.get('/view/cat',auth.isAdmin , async function (req, res) {
    const listCat = await catModel.getAllCategory();
    var data = []
    for (let key in Object.keys(listCat)) {
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
    res.render('vwAdmin/view/category', {
        layout: 'admin.hbs',
        db: data,
        page: 1
    });
})

router.get('/view/cat/:cat1',auth.isAdmin, async function (req, res) {
    res.locals.successMsg = req.session.successMsg;
    req.session.successMsg = '';
    console.log(res.locals.successMsg)

    const cat1 = req.params.cat1;
    const listCat = await catModel.getAllCat2ByCat1(cat1)

    var data = []
    for (let key in Object.keys(listCat)) {
        cat2 = listCat[key]
        var val = {}
        val['amountPre'] = await postModel.getAmountPostPremiumByCat(cat2.keyCat2)
        val['amountNor'] = await postModel.getAmountPostByCat(cat2.keyCat2)
        console.log(val['amountNor'], val['amountPre'])
        val['keyCat2'] = cat2.keyCat2
        val['nameCat2'] = cat2.nameCat2
        data.push(val)
    }
    res.render('vwAdmin/view/category1', {
        layout: 'admin.hbs',
        db: data,
        keycat1: cat1
    });
})
// --------------------------------------Add cat-------------------------------------------------

//add cat 1
router.get('/add/cat/',auth.isAdmin, async function (req, res) {
    res.render('vwAdmin/add/addcat1', {
        layout: 'admin.hbs'
    });
})

//add cat 2
router.get('/add/cat/:cat1',auth.isAdmin, async function (req, res) {
    const data = await catModel.getCat1ByKeyCat1(req.params.cat1)
    console.log(data);
    res.render('vwAdmin/add/addcat2', {
        layout: 'admin.hbs',
        db: data
    });
})
// --------------------------------------Edit cat 1-------------------------------------------------
router.get('/edit/cat/:cat1',auth.isAdmin, async function (req, res) {
    const data = await catModel.getCat1ByKeyCat1(req.params.cat1)
    console.log(data);
    res.render('vwAdmin/edit/editcat1', {
        layout: 'admin.hbs',
        db: data
    });
})

router.post('/edit/cat/:cat1',auth.isAdmin, async function (req, res) {
    const cat1 = req.params.cat1
    const data = {
        keyCat1: req.body.keyCat1,
        nameCat1: req.body.nameCat1,
        adminCat: req.body.adminCat1
    }
    const result = await catModel.updateCat1(cat1, data)
    res.redirect('/admin/view/cat')
})

// -----------------------------------Edit cat2 ------------------------------------------------------
router.get('/edit/cat/:cat1/:cat2',auth.isAdmin, async function (req, res) {
    const keyCat1 = req.params.cat1
    const keyCat2 = req.params.cat2
    var namecat1 = '';
    var nameCat2 = '';
    const allCat = res.locals.lcCategory;
    Object.keys(allCat).forEach(key => {
        var cat1 = allCat[key]
        if (cat1.keyCat1 === keyCat1) {
            Object.keys(cat1.listCat).forEach(key2 => {
                var objCat2 = cat1.listCat[key2]
                if (objCat2.keyCat2 === keyCat2) {
                    nameCat2 = objCat2.nameCat2
                }
            })
            nameCat1 = cat1.nameCat1
        }
    })
    res.render('vwAdmin/edit/editcat2', {
        layout: 'admin.hbs',
        keyCat1: keyCat1,
        keyCat2: keyCat2,
        nameCat1: nameCat1,
        nameCat2: nameCat2
    });
})

router.post('/edit/cat/:cat1/:cat2',auth.isAdmin, async function (req, res) {
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    const data = {
        keyCat2: req.body.keyCat2,
        nameCat2: req.body.nameCat2
    }
    const result = await catModel.updateCat2(cat1, cat2, data)
    res.redirect('/admin/view/cat')
})

//-------------------Delete Cat1-----------------------------------------------
router.post('/del/cat/:cat1',auth.isAdmin, async function (req, res) {
    const cat1 = req.params.cat1
    result = await catModel.delCat1(cat1)
    res.redirect('/admin/view/cat')
})

//-------------------Delete cat2------------------------------------------------

router.post('/del/cat/:cat1/:cat2',auth.isAdmin, async function (req, res) {
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    const result = await catModel.delCat2(cat1, cat2)
    res.redirect('/admin/view/cat')
})

// -----------------------------Add Cat2 ------------------------------------------------

router.post('/add/cat/:cat1',auth.isAdmin , async function (req, res) {
    const cat1 = req.params.cat1
    const data = {
        keyCat2: req.body.keyCat2,
        nameCat2: req.body.nameCat2
    }
    const result = await catModel.addCat2(cat1, data)
    req.session.successMsg = 'Th??m chuy??n m???c th??nh c??ng'
    res.redirect('/admin/view/cat/' + cat1)
})

// ----------------------------Add cat1 ------------------------------------------------

router.post('/add/cat',auth.isAdmin, async function (req, res) {
    const data = req.body
    var listCat2 = []
    for (let i = 0; i < data.listKey2.length; i++) {
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
    const result = await catModel.addCat1(objCat1)
    res.redirect('/admin/view/cat')
})
// //--------------------------End category-----------------------------

// //--------------------------Tag--------------------------------------
// //auth.isAdmin,



router.get('/view/tag',auth.isAdmin, async function (req, res) {
    page = req.query.page || 1
    var data = await tagModel.getAllTag(page)
    var cnt = await tagModel.getAmountTag()
    var nPage = Math.floor(cnt / 15)
    if (cnt % 15 !== 0) nPage++
    res.render('vwAdmin/view/tag', {
        layout: 'admin.hbs',
        db: data,
        totalPage: nPage,
        page: page
    });
})

router.get('/edit/tag/:id',auth.isAdmin, async function (req, res) {
    id = req.params.id;
    console.log(id);
    result = await tagModel.getTagByID(id)
    console.log(result);
    res.render('vwAdmin/edit/edittag', {
        layout: 'admin.hbs',
        db: result
    });
})
router.post('/edit/tag/:id',auth.isAdmin, async function (req, res) {
    id = req.params.id;
    result = await tagModel.editTag(id, req.body)
    res.redirect('/admin/view/tag')
})

router.post('/del/tag/:id',auth.isAdmin, async function (req, res) {
    id = req.params.id;
    result = await tagModel.delTag(id)
    res.redirect('/admin/view/tag')
})


router.get('/add/tag',auth.isAdmin, async function (req, res) {
    res.render('vwAdmin/add/addtag', {
        layout: 'admin.hbs'
    });
})

router.post('/add/tag',auth.isAdmin, async function (req, res) {
    result = await tagModel.addTag(req.body)
    //const result = "testok";
    res.redirect('/admin/view/tag')
})

//-------------------------User------------------------------------------
router.get('/view/user/:type',auth.isAdmin, async function (req, res) {
    res.locals.successMsg = req.session.successMsg
    req.session.successMsg = ''
    const type = req.params.type
    const page = req.query.page || 1
    var data;
    console.log(type, typeof (type))
    if (type === 'upgrade') {
        console.log('Ok')
        const data = await userModel.getAllAccountUpgrade();
        const nPage = 1;

        res.render('vwAdmin/view/user_accept_upgrade', {
            layout: 'admin.hbs',
            db: data,
            totalPage: nPage,
            page: page,
            urlType: type
        });
        return;
    }
    
    if (type === 'all') {
        data = await userModel.getAllUser(page)
    } else {
        data = await userModel.getUserByPermission(type, page)
    }
    var cnt = await userModel.countUserByPermission(type)
    var nPage = Math.floor(cnt / 15)
    if (cnt % 15 !== 0) nPage++



    res.render('vwAdmin/view/user', {
        layout: 'admin.hbs',
        db: data,
        totalPage: nPage,
        page: page,
        urlType: type
    });
})

router.get('/edit/user/:id',auth.isAdmin, async function (req, res) {
    id = req.params.id;
    var data = await userModel.getUserByID(id)
    delete data['password']
    res.render('vwAdmin/edit/edituser', {
        layout: 'admin.hbs',
        db: data
    });
})

router.post('/edit/user/:id',auth.isAdmin, async function (req, res) {
    var data = req.body;
    data.permission = parseInt(data.permission)
    result = await userModel.updateUserByUserName(data.userName, data)
    req.session.successMsg = result;
    res.redirect('/admin/view/user/all')
})

router.post('/add/user',auth.isAdmin, async function (req, res) {
    const data = req.body;
    console.log(data);
    const checkUserName = await userModel.getUserByUserName(data.userName);
    const checkGmail = await userModel.getUserByGmail(data.gmail);

    if (checkGmail !== null) {
        req.session.successMsg = 'Gmail ???? ???????c s??? d???ng';
        res.redirect('/admin/view/user/all')
        return;
    }

    if (checkUserName !== null) {
        req.session.successMsg = 'T??n t??i kho???n ???? t???n t???i';
        res.redirect('/admin/view/user/all')
        return;
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
    req.session.successMsg = 'Ki???m tra t??i kho???n ????? x??c nh???n';
    res.redirect('/admin/view/user/all')
})

router.post('/del/user/:id',auth.isAdmin, async function (req, res) {
    id = req.params.id
    result = await userModel.delUser(id)
    req.session.successMsg = result
    res.redirect('/admin/view/user/all')
})


// //-------------------------Post-------------------------------------------
router.get('/view/post/:cat1',auth.isAdmin, async function (req, res) {
    cat1 = req.params.cat1
    page = req.query.page
    console.log(page);
    const data = await postModel.getPostPremiumByCat1(cat1, page)
    var obj = []
    for (let i = 0; i < data.length; i++) {
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
    res.render('vwAdmin/view/post_cat1', {
        layout: 'admin.hbs',
        db: obj,
        totalPage: nPages,
        cat1: cat1,
        page: page
    });
})

// //--------------------------------dat--------------------//

router.get('/post',auth.isAdmin, async function (req, res) {
    res.render('vwAdmin/view/post_cat_select', {
        layout: 'admin.hbs'
    });
})
router.get('/',auth.isAdmin, async function (req, res) {
    res.render('vwAdmin/view/cat_select', {
        layout: 'admin.hbs'
    });
})
router.get('/cat',auth.isAdmin, async function (req, res) {
    res.render('vwAdmin/view/cat_select', {
        layout: 'admin.hbs'
    });
})

router.get('/add/post',auth.isAdmin, async function (req, res) {
    res.render('vwAdmin/add/addpost', {
        layout: 'admin.hbs'
    });
})
router.get('/category',auth.isAdmin, async function (req, res) {
    res.render('vwAdmin/view/cat_select', {
        layout: 'admin.hbs'
    });
})
router.get('/add/user',auth.isAdmin, async function (req, res) {
    res.render('vwAdmin/add/adduser', {
        layout: 'admin.hbs'
    });
})

// ------------------------------------------------------Post

router.get('/view/post/:cat1/:cat2',auth.isAdmin, async function (req, res) {
    cat1 = req.params.cat1;
    cat2 = req.params.cat2;
    page = req.query.page;
    const data = await postModel.getPostPremiumByCat2(cat2, page)
    var obj = []
    for (let i = 0; i < data.length; i++) {
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
    console.log(cat2);
    res.render('vwAdmin/view/post_cat2', {
        layout: 'admin.hbs',
        db: obj,
        totalPage: nPages,
        cat1: cat1,
        cat2: cat2,
        page: page
    });
})

router.get('/edit/post/:id',auth.isAdmin, async function (req, res) {
    id = req.params.id;
    var data = await postModel.getPostByID(id)
    console.log(data);
    res.render('vwAdmin/edit/editpost', {
        layout: 'admin.hbs',
        db: data
    });
})

router.post('/edit/post/:id',auth.isAdmin, async function (req, res) {
    const id = req.params.id
    var data = req.body;
    result = await postModel.editPostForAdmin(id, data)
    res.redirect('/admin/post')
})


router.post('/add/post',auth.isAdmin, async function (req, res) {
    const data = req.body;
    result = await postModel.addPost(data)
    res.redirect('/admin/post')
})

router.post('/del/post/:id',auth.isAdmin, async function (req, res) {
    const id = req.params.id
    result = await postModel.delPost(id);
    res.redirect('/admin/post')
})

// --------------------------------------------------DraftPost-----------------------------------------------------------------

router.get('/view/draft-post',auth.isAdmin, async function (req, res) {
    res.locals.successMsg = req.session.successMsg
    req.session.successMsg = ''
    console.log(res.locals.successMsg)
    var page = req.query.page || 1
    const posts = await draftModel.getAllDraftPostByPage(page)
    res.render('vwAdmin/view/draftPost', {
        layout: 'admin.hbs',
        db: posts.posts,
        totalPage: posts.totalPage,
        page: page
    })
})

router.get('/view/draft-post/:id',auth.isAdmin, async function (req, res) {
    var id = req.params.id
    const post = await draftModel.getDrafPostByID(id);
    res.render('vwEditor/confirmpost', {
        layout: 'admin.hbs',
        db: post
    });
})

router.post('/del/draft-post/:id',auth.isAdmin, async function (req, res) {
    var id = req.params.id
    const result = await draftModel.deletePostByAdmin(id)
    req.session.successMsg = result;
    res.redirect('/admin/view/draft-post')
})

// --------------------------------------------Upgrade----------------------------------------------------------------

router.post('/upgrade/accept/:id',auth.isAdmin, async function (req, res) {
    const userName = req.body.userName
    const days = req.body.days
    const id = req.params.id
    const result = await userModel.upgradeAccount(userName, days, id)
    req.session.successMsg = result;
    res.redirect('/admin/view/user/upgrade')
})

router.post('/upgrade/reject/:id',auth.isAdmin, async function (req, res) {
    const id = req.params.id
    result = await userModel.rejectAccount(id)
    req.session.successMsg = result;
    res.redirect('/admin/view/user/upgrade')
})
module.exports = router;



// {edit, view, add, del}/{cat, post, tag, user}/:  /:   