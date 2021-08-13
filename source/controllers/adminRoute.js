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
// router.get('/view/cat', async function (req, res){
//     const listCat = await catModel.getAllCategory();
//     var data = []
//     for (let key in Object.keys(listCat)){
//         var val = {}
//         var doc = listCat[key]
//         val['adminCat'] = doc.adminCat
//         val['keyCat1'] = doc.keyCat1
//         val['nameCat1'] = doc.nameCat1
//         val['amountPre'] = await postModel.getAmountPostPremiumByCat(doc.keyCat1)
//         val['amountNor'] = await postModel.getAmountPostByCat(doc.keyCat1)
//         val['amountCat2'] = Object.keys(doc.listCat).length
//         data.push(val)
//     }
//     // res.send(data)
//     res.render('vwAdmin/category',{layout:'admin.hbs',db:data});

// })

router.get('/edit/:cat1', async function(req, res){
    const data={
        "keyCat1": "thoi-su",
        "nameCat1": "Thời sự",
        "adminCat": "Anh Minh",
        "listCat": {
            "0": {
                "keyCat2": "phap-luat",
                "nameCat2": "Pháp luật"
            },
            "1": {
                "keyCat2": "phong-su-dieu-tra",
                "nameCat2": "Phóng sự / Điều tra"
            },
            "2": {
                "keyCat2": "quoc-phong",
                "nameCat2": "Quốc phòng"
            }
        }
    };
    res.render('vwAdmin/editcat1',{layout:'admin.hbs',db:data});
})

router.post('/edit/:cat1', async function (req, res){
    const cat1 = req.params.cat1
    const data = req.body;
    console.log(data)
    res.send('done')
    // const result = await catModel.updateCat1(cat1, req.body)
    // return result;
})

router.get('/edit/:cat1/:cat2', async function(req, res){
    var category=res.locals.lcCategory;
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    const namecat1="123"
    const namecat2="456"
    res.render('vwAdmin/editcat2',{layout:'admin.hbs',keycat1:cat1,keycat2:cat2,namecat1:namecat1,namecat2:namecat2});
})

router.post('/edit/:cat1/:cat2', async function(req, res){
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    console.log(cat1, cat2)
    const data = req.body
    console.log(data);
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
  


// //--------------------------End category-----------------------------

// //--------------------------Tag--------------------------------------
// //auth.isAdmin,
// router.get('/',  async function(req, res){
//     res.render('vwAdmin/dashboard',{layout:'admin.hbs'});
// })


// router.get('/tag/gettagbyid/:id',  async function(req, res){



//     id = req.params.id;
//     var data = await tagModel.getTagByID(id)
//     res.send(data);
// })

// router.get('/tag/edit/:id',  async function(req, res){
//     id = req.params.id;
//     var data = await tagModel.getTagByID(id);
//     console.log(data);
//     // res.send(data);
//     res.render('vwAdmin/edittag',{layout:'admin.hbs',db:data,id:id});
// })

// router.post('/tag/edit/:id',  async function(req, res){
//     const data = req.body;
//     console.log.data();
//     id = req.params.id;
//     // const result = await tagModel.editTag(data)
//     // res.send(result)
//     var newdir="/admin/tag/view/"+String(id);
//     res.redirect(newdir);
// })

// router.get('/tag/view/:id',  async function(req, res){
//     id = req.params.id;
//     var data = await tagModel.getTagByID(id);
//     console.log(data);
//     // res.send(data);
//     res.render('vwAdmin/viewtag',{layout:'admin.hbs',db:data,id:id});
// })
// router.post('/tag/view/:id',  async function(req, res){
//     const data = req.body;
//     id = req.params.id;
//     // const result = await tagModel.editTag(data)
//     // res.send(result)
//     var newdir="/admin/tag/edit/"+String(id);
//     res.redirect(newdir);
// })

// router.get('/tag/add',  async function(req, res){
//     res.render('vwAdmin/addtag',{layout:'admin.hbs'});
// })

// router.post('/tag/add',  async function(req, res){
//     const data = req.body;
//     const result = await tagModel.addTag(data)
//     res.send(result)
// })

// router.post('/tag/del',  async function(req, res){
//     id = req.body.id
//     const result = await tagModel.delTag(id)
//     res.send(result)
// })

// //-------------------------User------------------------------------------
// router.get('/user',  async function(req, res){
//     // var data = await userModel.getAllUser()
//     // res.send(data);
//     res.render('vwAdmin/usermanagement',{layout:'admin.hbs'});

// })

// router.get('/user/view/:id',  async function(req, res){
//     id = req.params.id;
//     var data = await userModel.getUserByID(id)
//     console.log(data);
//     res.render('vwAdmin/viewuser',{layout:'admin.hbs',db:data});

//     // res.send(data);

// })

// // router.get('/user/edit/:id',  async function(req, res){
// //     id = req.params.id;
// //     var data = await userModel.getUserByID(id)
// //     res.send(data);
// // })

// router.post('/user/edit',  async function(req, res){
//     const data = req.body;
//     result = await userModel.editUser(data)
//     res.send(result);
// })

// router.get('/user/add',  async function(req, res){
//     res.send('direct')
// })

// router.post('/user/add',  async function(req, res){
//     const data = req.body;
//     result = await userModel.addUser(data)
//     res.send(result)
// })

// router.post('/user/del',  async function(req, res){
//     id = req.body.id
//     result = await userModel.delUser(id)
//     res.send(result)
// })


// //-------------------------Post-------------------------------------------
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
router.get('/category',  async function(req, res){
    res.render('vwAdmin/category_select',{layout:'admin.hbs'});
})
router.get('/tag',  async function(req, res){
    res.render('vwAdmin/tag',{layout:'admin.hbs'});
})
router.get('/post',  async function(req, res){
    res.render('vwAdmin/post',{layout:'admin.hbs'});
})
router.get('/user',  async function(req, res){
    res.render('vwAdmin/user',{layout:'admin.hbs'});
})
// //--------------------------------view--------------------//
router.get('/view/tag',  async function(req, res){
    res.render('vwAdmin/viewtag',{layout:'admin.hbs'});
})
router.get('/view/cat1',  async function(req, res){
    res.render('vwAdmin/viewcat1',{layout:'admin.hbs'});
})
router.get('/view/cat2/',  async function(req, res){
    res.render('vwAdmin/viewcat2',{layout:'admin.hbs'});
})
router.get('/view/post/',  async function(req, res){
    res.render('vwAdmin/viewpost',{layout:'admin.hbs'});
})
router.get('/view/user/',  async function(req, res){
    res.render('vwAdmin/viewuser',{layout:'admin.hbs'});
})
// //--------------------------------add--------------------//
router.get('/addd/tag',  async function(req, res){
    res.render('vwAdmin/addtag',{layout:'admin.hbs'});
})
router.get('/addd/cat1',  async function(req, res){
    res.render('vwAdmin/addcat1',{layout:'admin.hbs'});
})
router.get('/addd/cat2/',  async function(req, res){
    res.render('vwAdmin/addcat2',{layout:'admin.hbs'});
})
router.get('/addd/post/',  async function(req, res){
    res.render('vwAdmin/addpost',{layout:'admin.hbs'});
})
router.get('/addd/user/',  async function(req, res){
    res.render('vwAdmin/adduser',{layout:'admin.hbs'});
})

// //--------------------------------edit--------------------//
router.get('/edit/tag',  async function(req, res){
    res.render('vwAdmin/edittag',{layout:'admin.hbs'});
})
router.get('/edit/cat1',  async function(req, res){
    res.render('vwAdmin/editcat1',{layout:'admin.hbs'});
})
router.get('/edit/cat2/',  async function(req, res){
    res.render('vwAdmin/editcat2',{layout:'admin.hbs'});
})
router.get('/edit/post/',  async function(req, res){
    res.render('vwAdmin/editpost',{layout:'admin.hbs'});
})
router.get('/edit/user/',  async function(req, res){
    res.render('vwAdmin/edituser',{layout:'admin.hbs'});
})

// //--------------------------------del--------------------//
router.get('/table',  async function(req, res){
    res.render('vwAdmin/table_test',{layout:'admin.hbs'});
})


module.exports = router;