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

router.get('/', async function (req, res) {
    // const data = await postModel.getAllPostByNickName(req.session.data.nickName)
    // res.send(data)
    res.render('vwWriter/writing/writing-posts', {
        layout: 'writer.hbs',
        isWritingPosts: true,
    });
})

// =========================================== add post =================================================
router.get('/add', function (req, res) {
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
            res.send('You dont have permission for edit this post')
            return;
        }
    }
    var file;
    if (!req.file) file = null;
    else file = req.file
    const result = await saveModel.savePostByID(id, data, file)
    res.send(result)
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
            res.send('You dont have permission for edit this post')
            return;
        }
    }
    var file;
    if (!req.file) file = null;
    else file = req.file
    const result = await saveModel.submitPost(id, data, file)
    res.send(result)
})

// ======================================== writing-post(SAVE) ============================================
router.get('/view/writing-post', auth.isWriter, async function (req, res) {
    page = req.query.page || 1
    var obj = ''
    obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'SavePost')
    var nPages = await saveModel.getTotalPage('SavePost', req.session.data.userName)

    res.render('vwWriter/writing/writing-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages,
        isWritingPosts: true,
    });
})


router.get('/edit/writing-post', auth.isWriter, async function (req, res) {
    var id = req.query.id;
    const post = await saveModel.getPostByID(id, 'SavePost')
    if (post.userWriter !== req.session.data.userName) {
        res.send('you dont have permisson to edit this post')
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
    if (post.userWriter !== req.session.data.userName){
        res.send('you dont have permisson to edit this post')
        return;
    }
    const result = await saveModel.delelteSavePost(id, 'SavePost')
    res.send(result)
})



// ======================================== draft-post================================================
router.get('/view/draft-post', auth.isWriter, async function (req, res) {
    page = req.query.page || 1
    var obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'DrafPost')
    var nPages = await saveModel.getTotalPage('DrafPost', req.session.data.userName)
    //console.log('list post: ', obj)
    res.render('vwWriter/draft/draft-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages,
        isDraftPosts: true,
    });
})


router.get('/edit/draft-post', auth.isWriter, async function (req, res) {
    var id = req.query.id;
    var obj;
    obj = await saveModel.getPostByID(id, 'DrafPost')
    if (obj.userWriter !== req.session.data.userName) {
        res.send('you dont have permisson to edit this post')
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
        res.send('you dont have permisson to edit this post')
        return;
    }
    var file = null;
    if (!req.file) file = null;
    else file = req.file
    const result = await draftModel.editDraftPost(id, data, file);
    res.send(result)
})

router.post('/del/draft-post/:id', auth.isWriter, async function (req, res) {
    const obj = await saveModel.getPostByID(id, 'DrafPost')
    if (obj.userWriter !== req.session.data.userName) {
        res.send('you dont have permisson to edit this post')
        return;
    }
    const result = await saveModel.delelteSavePost(id, 'DrafPost')
    res.send(result)
})

//===============================================Reject-post ==============================================
router.get('/view/reject-post', auth.isWriter, async function (req, res) {
    page = req.query.page || 1
    const obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'RejectPost')
    const nPages = await saveModel.getTotalPage('RejectPost', req.session.data.userName)
    res.render('vwWriter/reject/reject-posts', {
        layout: 'writer.hbs',
        db: obj,
        isRejectPosts: true,
    });
})

router.get('/edit/reject-post/:id', auth.isWriter, async function (req, res) {
    id = req.params.id
    // const obj = await saveModel.getPostByID(id, 'RejectPost')
    // if (obj.userWriter !== req.session.data.userName) {
    //     res.send('you dont have permisson to edit this post')
    //     return;
    // }
    var obj = {
        "id": 0,
        "title": "Thiếu úy công an bắt quả tang nghi can định vứt bỏ ma túy đá",
        "summary": " Sau khi mua ma túy đá, trên đường quay về nhà, Đoàn bị lực lượng tuần tra kiểm soát xử lý vi phạm phòng chống Covid-19 Công an TP.Bà Rịa bắt giữ cùng tang vật.",
        "urlPic": "https://image.thanhnien.vn/uploaded/longnt/2021_08_01/14384d6be44713194a56_ezwo.jpg",
        "content": "<div class=\"cms-body detail\" id=\"abody\" itemprop=\"articleBody\"> <p>  Ngày 1.8, Tổ công tác tuần tra kiểm soát và xử lý vi phạm phòng chống dịch Covid-19 Công an TP.Bà Rịa (Bà Rịa – Vũng Tàu) đã bàn giao Đinh Viết Đoàn (26 tuổi, ngụ xã Châu Pha, TX.Phú Mỹ, Bà Rịa-Vũng Tàu) cho Công an P.Kinh Dinh xử lý về hành vi tàng trữ trái phép chất  <a href=\"https://thanhnien.vn/thoi-su/bo-doi-bien-phong-ba-ria-vung-tau-lien-tiep-triet-pha-2-vu-tang-tru-trai-phep-ma-tuy-1400299.html\" rel=\"\" target=\"_blank\">   ma túy  </a>  . </p> <p>  Khoảng 9 giờ 45 cùng ngày, Tổ công tác tuần tra kiểm soát và xử lý vi phạm  <a href=\"https://thanhnien.vn/thoi-su/bat-giu-2-nghi-can-van-chuyen-ma-tuy-bang-taxi-xuong-ba-ria-vung-tau-ban-1352118.html\" rel=\"\" target=\"_blank\">   phòng chống dịch Covid-19  </a>  Công an TP.Bà Rịa đang làm nhiệm vụ tại ngã tư Lê Đại Hành – Trịnh Đình Thảo (P.Kim Dinh) thì phát hiện Đoàn điều khiển xe máy biển kiểm soát 38P1 – 646.08 có biểu hiện nghi vấn nên ra hiệu lệnh dừng phương tiện để kiểm tra. </p> <p>  Trong quá trình làm việc với lực lượng, Đoàn đã móc trong túi quần ra 2 gói bột màu trắng để vứt bỏ thì bị thiếu úy Nguyễn Quốc Cường, công tác tại Đội CSGT-TT Công an TP.Bà Rịa làm Tổ trưởng tổ tuần tra nhanh chóng chụp tay Đoàn lại. </p> <p>  Đoàn khai nhận 2 gói bột trên là  <a href=\"https://thanhnien.vn/thoi-su/da-nang-bi-cao-van-chuyen-ma-tuy-biet-danh-vo-anh-cuoc-lanh-an-1402235.html\" rel=\"\" style=\"color: #00739f;\" target=\"_blank\">   ma túy đá  </a>  mới đi mua từ TP.Vũng Tàu để đưa về nhà sử dụng. </p> <!-- Bắt đầu Dable / Để được giải đáp, hãy truy cập http://dable.io --> <div data-widget_id=\"goPj6JlQ\" id=\"dablewidget_goPj6JlQ\"> </div> <!-- Kết thúc / Để được giải đáp, hãy truy cập http://dable.io --></div>",
        "dateUpload": "Sun, 01 Aug 2021 08:14:58 GMT",
        "nameCat1": "Thời sự",
        "keyCat1": "thoi-su",
        "nameCat2": "Pháp luật",
        "keyCat2": "phap-luat",
        "listNameOfTag": {
            '0': '#Ma túy',
            '1': "#ma túy đá"

        },
        "listKeyOfTag": {
            '0': "ma-tuy",
            '1': "ma-tuy-da",
        },
        "listTag": {
            "0": {
                "key": "ma-tuy",
                "name": "#Ma túy"
            },
            "1": {
                "key": "ma-tuy-da",
                "name": "#ma túy đá"
            },
            "2": {
                "key": "gian-cach",
                "name": "#giãn cách"
            },
            "3": {
                "key": "covid-19",
                "name": "#Covid-19"
            },
            "4": {
                "key": "to-tuan-tra",
                "name": "#tổ tuần tra"
            }
        },
        "permission": 0,
        "status": 1,
        "views": 1,
        "nickName": "admin",
        "rejectingReason": "anbc xxj kahd alsdjlad kahd adlka ahdlajd lajd adlasjd askjla;sdj lasdjlad asd aksdkhad akhdak dhk kahsdka kahdkasd",
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
    var post = await rejectModel.getRejectPostByID(id)
    if (post.userWriter !== req.session.data.userName) {
        res.send('you dont have permisson to edit this post')
        return;
    }
    var file = null;
    if (!req.file) file = null;
    else file = req.file
    const result = await rejectModel.editRejectPost(id, body, file)
    res.send(result)
})

// after edit, submit post to drafPost
router.post('/edit/reject-post/submit/:id', auth.isWriter, upload.single('urlPic'), async function (req, res) {
    const body = req.body
    const id = req.params.id
    var post = await rejectModel.getRejectPostByID(id)
    if (post.userWriter !== req.session.data.userName) {
        res.send('you dont have permisson to edit this post')
        return;
    }
    var file;
    if (!req.file) file = null;
    else file = req.file
    const result = await rejectModel.submitRejectPost(id, body, file)
    res.send(result)
})

router.post('/del/reject-post/:id', auth.isWriter, async function (req, res) {
    const id = req.params.id
    var post = await rejectModel.getRejectPostByID(id)
    if (post.userWriter !== req.session.data.userName) {
        res.send('you dont have permisson to edit this post')
        return;
    }
    const result = await saveModel.delelteSavePost(id, 'RejectReason')
    res.send(result)
})


// ================================================ waiting-post =============================================
router.get('/view/waiting-post', auth.isWriter, async function (req, res) {
    page = req.query.page || 1
    obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'WaitingPost')
    var nPages = await saveModel.getTotalPage('WaitingPost', req.session.data.userName)
    res.render('vwWriter/waiting/waiting-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages,
        isWaitingPosts: true,
    });
})

router.get('/view/waiting-post/:id', auth.isWriter, async function (req, res) {
    id = req.params.id
    var obj = await saveModel.getPostByID(id, 'WaitingPost')
    if (obj.userWriter !== req.session.data.userName) {
        res.send('you dont have permission to read this post')
        return;
    }
    res.send(obj)
})


// ======================================================= Public =================================================
router.get('/view/public', auth.isWriter, async function (req, res) {
    page = req.query.page || 1
    obj = await saveModel.getPostByWriter(req.session.data.userName, page, 'Post')
    var nPages = await saveModel.getTotalPage('Post', req.session.data.userName)
    res.render('vwWriter/public/public-posts', {
        layout: 'writer.hbs',
        db: obj,
        totalPage: nPages,
        isPublicPosts: true,
    })
})

router.get('/view/public/:id', auth.isWriter, async function (req, res) {
    id = req.params.id
    var obj = await saveModel.getPostByID(id, 'Post')
    if (obj.userWriter !== req.session.data.userName) {
        res.send('you dont have permission to read this post')
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