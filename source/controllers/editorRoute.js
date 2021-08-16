const express = require('express');
const bodyParser = require('body-parser')
const postModel = require('../models/postController');
const tagModel = require('../models/tagController')
const auth = require('../middlewares/authMethod')

const userModel = require('../models/userController')
const waitingModel = require('../models/waitingPostController')
const drafModel = require('../models/DrafPostController')
const rejectModel = require('../models/RejectPostController')

const router = express.Router();
router.use(bodyParser.json())
//auth.isEditor,

router.get('/', function(req, res){
    res.render('vwEditor/vieweditor',{layout:'editor.hbs'});
})
// router.get('/view/post', function(req, res){
//     res.render('vwEditor/vieweditor',{layout:'editor.hbs'});
// })
// router.get('/view/draft', function(req, res){
//     res.render('vwEditor/vieweditordraft',{layout:'editor.hbs'});
// })
// router.get('/view/post', function(req, res){
//     res.render('vwEditor/viewpost',{layout:'editor.hbs'});
// })
// router.get('/confirm', function(req, res){
//     res.render('vwEditor/confirmpost',{layout:'editor.hbs'});
// })
// Các bài báo đang chờ duyệt
const list_post={
    "0": {
        "id": 0,
        "title": "Thiếu úy công an bắt quả tang nghi can định vứt bỏ ma túy đá",
        "summary": " Sau khi mua ma túy đá, trên đường quay về nhà, Đoàn bị lực lượng tuần tra kiểm soát xử lý vi phạm phòng chống Covid-19 Công an TP.Bà Rịa bắt giữ cùng tang vật.\n  ",
        "urlPic": "https://image.thanhnien.vn/uploaded/longnt/2021_08_01/14384d6be44713194a56_ezwo.jpg",
        "content": "<div class=\"cms-body detail\" id=\"abody\" itemprop=\"articleBody\"> <p>  Ngày 1.8, Tổ công tác tuần tra kiểm soát và xử lý vi phạm phòng chống dịch Covid-19 Công an TP.Bà Rịa (Bà Rịa – Vũng Tàu) đã bàn giao Đinh Viết Đoàn (26 tuổi, ngụ xã Châu Pha, TX.Phú Mỹ, Bà Rịa-Vũng Tàu) cho Công an P.Kinh Dinh xử lý về hành vi tàng trữ trái phép chất  <a href=\"https://thanhnien.vn/thoi-su/bo-doi-bien-phong-ba-ria-vung-tau-lien-tiep-triet-pha-2-vu-tang-tru-trai-phep-ma-tuy-1400299.html\" rel=\"\" target=\"_blank\">   ma túy  </a>  . </p> <p>  Khoảng 9 giờ 45 cùng ngày, Tổ công tác tuần tra kiểm soát và xử lý vi phạm  <a href=\"https://thanhnien.vn/thoi-su/bat-giu-2-nghi-can-van-chuyen-ma-tuy-bang-taxi-xuong-ba-ria-vung-tau-ban-1352118.html\" rel=\"\" target=\"_blank\">   phòng chống dịch Covid-19  </a>  Công an TP.Bà Rịa đang làm nhiệm vụ tại ngã tư Lê Đại Hành – Trịnh Đình Thảo (P.Kim Dinh) thì phát hiện Đoàn điều khiển xe máy biển kiểm soát 38P1 – 646.08 có biểu hiện nghi vấn nên ra hiệu lệnh dừng phương tiện để kiểm tra. </p> <p>  Trong quá trình làm việc với lực lượng, Đoàn đã móc trong túi quần ra 2 gói bột màu trắng để vứt bỏ thì bị thiếu úy Nguyễn Quốc Cường, công tác tại Đội CSGT-TT Công an TP.Bà Rịa làm Tổ trưởng tổ tuần tra nhanh chóng chụp tay Đoàn lại. </p> <p>  Đoàn khai nhận 2 gói bột trên là  <a href=\"https://thanhnien.vn/thoi-su/da-nang-bi-cao-van-chuyen-ma-tuy-biet-danh-vo-anh-cuoc-lanh-an-1402235.html\" rel=\"\" style=\"color: #00739f;\" target=\"_blank\">   ma túy đá  </a>  mới đi mua từ TP.Vũng Tàu để đưa về nhà sử dụng. </p> <!-- Bắt đầu Dable / Để được giải đáp, hãy truy cập http://dable.io --> <div data-widget_id=\"goPj6JlQ\" id=\"dablewidget_goPj6JlQ\"> </div> <!-- Kết thúc / Để được giải đáp, hãy truy cập http://dable.io --></div>",
        "dateUpload": "Sun, 01 Aug 2021 08:14:58 GMT",
        "nameCat1": "Thời sự",
        "keyCat1": "thoi-su",
        "nameCat2": "Pháp luật",
        "keyCat2": "phap-luat",
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
        "rejectingReason": ""
    }
};

const _post={
    
        "id": 0,
        "title": "Thiếu úy công an bắt quả tang nghi can định vứt bỏ ma túy đá",
        "summary": " Sau khi mua ma túy đá, trên đường quay về nhà, Đoàn bị lực lượng tuần tra kiểm soát xử lý vi phạm phòng chống Covid-19 Công an TP.Bà Rịa bắt giữ cùng tang vật.\n  ",
        "urlPic": "https://image.thanhnien.vn/uploaded/longnt/2021_08_01/14384d6be44713194a56_ezwo.jpg",
        "content": "<div class=\"cms-body detail\" id=\"abody\" itemprop=\"articleBody\"> <p>  Ngày 1.8, Tổ công tác tuần tra kiểm soát và xử lý vi phạm phòng chống dịch Covid-19 Công an TP.Bà Rịa (Bà Rịa – Vũng Tàu) đã bàn giao Đinh Viết Đoàn (26 tuổi, ngụ xã Châu Pha, TX.Phú Mỹ, Bà Rịa-Vũng Tàu) cho Công an P.Kinh Dinh xử lý về hành vi tàng trữ trái phép chất  <a href=\"https://thanhnien.vn/thoi-su/bo-doi-bien-phong-ba-ria-vung-tau-lien-tiep-triet-pha-2-vu-tang-tru-trai-phep-ma-tuy-1400299.html\" rel=\"\" target=\"_blank\">   ma túy  </a>  . </p> <p>  Khoảng 9 giờ 45 cùng ngày, Tổ công tác tuần tra kiểm soát và xử lý vi phạm  <a href=\"https://thanhnien.vn/thoi-su/bat-giu-2-nghi-can-van-chuyen-ma-tuy-bang-taxi-xuong-ba-ria-vung-tau-ban-1352118.html\" rel=\"\" target=\"_blank\">   phòng chống dịch Covid-19  </a>  Công an TP.Bà Rịa đang làm nhiệm vụ tại ngã tư Lê Đại Hành – Trịnh Đình Thảo (P.Kim Dinh) thì phát hiện Đoàn điều khiển xe máy biển kiểm soát 38P1 – 646.08 có biểu hiện nghi vấn nên ra hiệu lệnh dừng phương tiện để kiểm tra. </p> <p>  Trong quá trình làm việc với lực lượng, Đoàn đã móc trong túi quần ra 2 gói bột màu trắng để vứt bỏ thì bị thiếu úy Nguyễn Quốc Cường, công tác tại Đội CSGT-TT Công an TP.Bà Rịa làm Tổ trưởng tổ tuần tra nhanh chóng chụp tay Đoàn lại. </p> <p>  Đoàn khai nhận 2 gói bột trên là  <a href=\"https://thanhnien.vn/thoi-su/da-nang-bi-cao-van-chuyen-ma-tuy-biet-danh-vo-anh-cuoc-lanh-an-1402235.html\" rel=\"\" style=\"color: #00739f;\" target=\"_blank\">   ma túy đá  </a>  mới đi mua từ TP.Vũng Tàu để đưa về nhà sử dụng. </p> <!-- Bắt đầu Dable / Để được giải đáp, hãy truy cập http://dable.io --> <div data-widget_id=\"goPj6JlQ\" id=\"dablewidget_goPj6JlQ\"> </div> <!-- Kết thúc / Để được giải đáp, hãy truy cập http://dable.io --></div>",
        "dateUpload": "Sun, 01 Aug 2021 08:14:58 GMT",
        "nameCat1": "Thời sự",
        "keyCat1": "thoi-su",
        "nameCat2": "Pháp luật",
        "keyCat2": "phap-luat",
        "listNameOfTag": ["#Ma túy1","#Ma túy2","#Ma 3túy","#M4a túy","#Ma 5úy","#Ma t6úy","#Ma 7túy","#Ma 8túy","#ma9 túy đá"],
        "listKeyOfTag": ["#Ma túy","#ma túy đá"],
        "permission": 1,
        "status": 1,
        "views": 1,
        "nickName": "admin",
        "rejectingReason": ""
   
};

router.get('/view/draf-post', async function(req, res){
    page = req.query.page || 1
    // var user = await userModel.getUserByUserName(req.session.data.userName)
    // const posts = await drafModel.getDrafPostByCat1(user.adminCat, page)
    // res.send(posts)
    
    res.render('vwEditor/vieweditordraft',{layout:'editor.hbs',db:list_post,page:page});
})

router.get('/view/reject-post', async function(req, res){
    page = req.query.page || 1
    // const posts = await rejectModel.getRejectPostByEditor(req.session.data.userName, page)
    // res.send(posts)
    res.render('vwEditor/vieweditorreject',{layout:'editor.hbs',db:list_post});

})

router.get('/view/post', async function(req, res){
    page = req.query.page || 1
    // const posts = await waitingModel.getPostByEditor(page, req.session.data.userName)
    // res.send(posts)

    res.render('vwEditor/vieweditoraccepted',{layout:'editor.hbs',db:list_post});
})

router.get('/view/post/:id', async function(req, res){
    status = req.query.status
    id = req.params.id
    var post
    if (status === 1){
        post = await postModel.getPostByID(id, 1)
    } else post = await waitingModel.getPostByID(id)
    res.send(post)
})

router.get('/confirm/:id', async function(req, res){
    const id = req.params.id
    // const post = await drafModel.getDrafPostByID(id)
    // res.send(post)
    res.render('vwEditor/confirmpost',{layout:'editor.hbs',db:_post});
})

router.post('/confirm/reject/:id', async function(req, res){
    const data = req.body
    // const data = req.body
    // const result = await drafModel.rejectPost(id, data, req.session.data.userName)
    // res.send(result)
    console.log(data);
    // res.redirect('/reject');
})

router.post('/confirm/accept/:id', async function(req, res){
    const data = req.body
    // const result = await drafModel.acceptPost(id, data, req.session.data.userName)
    // res.send(result)
    console.log(data);
    // res.redirect('/successful');
})

module.exports = router;