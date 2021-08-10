const express = require('express');
const bodyParser = require('body-parser')
const cateModel = require('../models/categoryController');
const postModel = require('../models/postController');

const router = express.Router();
router.use(bodyParser.json());

// util function
function processingNumberOfPagesToView(nPages, page) { // needing to get total pages of cat
    var page_numbers = [];
    nPages = Math.floor(nPages)
    page = +page
    // console.log(page)
    // console.log(nPages)
    if (nPages <= 6) {
        for (i = 1; i <= nPages; i++) {
            page_numbers.push({
                value: i,
                isCurrent: i === +page
            });
        }
    } else {

        if (page < 3) {
            // 3 pages dau
            for (i = 1; i <= 3; i++) {
                page_numbers.push({
                    value: i,
                    isCurrent: i === +page
                });
            }
            page_numbers.push({
                isThreeDots: true,
            });
            // 2 pages cuoi
            for (i = nPages - 1; i <= nPages; i++) {
                page_numbers.push({
                    value: i,
                    isCurrent: i === +page
                });
            }
        } else {
            if (page >= nPages - 4) {
                if (page == nPages - 4) {
                    for (i = nPages - 5; i <= nPages; i++) {
                        page_numbers.push({
                            value: i,
                            isCurrent: i === +page
                        });
                    }

                } else {
                    // 5 pages cuoi
                    for (i = nPages - 4; i <= nPages; i++) {
                        page_numbers.push({
                            value: i,
                            isCurrent: i === +page
                        });
                    }
                }
            } else {
                for (i = page - 1; i <= page + 1; i++) {
                    page_numbers.push({
                        value: i,
                        isCurrent: i === +page
                    });
                }
                page_numbers.push({
                    isThreeDots: true,
                });

                for (i = nPages - 2; i <= nPages; i++) {
                    page_numbers.push({
                        value: i,
                        isCurrent: i === +page
                    });
                }
            }
        }
    }
    // console.log(page_numbers)
    return {
        page_numbers
    }
}

// get 10post/page    (category2
async function getPostPremiumByCat2(cat2, page) {
    var ans = await postModel.getPostPremiumByCat2(cat2, page)
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)
    const cnt = await postModel.getPagePremium(cat2);
    var nPages = Math.floor(cnt / 10);
    if (cnt % 10 !== 0) nPages++;
    var paging = processingNumberOfPagesToView(nPages, page);
    const obj = {
        data: jsonAns,
        isEmpty: jsonAns.length,
        page_numbers: paging.page_numbers,
        pageCurrent: page,
        nameCat1: jsonAns['0']['nameCat1'],
        nameCat2: jsonAns['0']['nameCat2'],
    }
    return obj
}

async function getPostByCat2(cat2, page) {
    var ans = await postModel.getPostByCat2(cat2, page);
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)
    const cnt = await postModel.getPage(cat2)
    var nPages = Math.floor(cnt / 10);
    if (cnt % 10 !== 0) nPages++;
    console.log(+cnt)
    console.log(nPages)
    var paging = processingNumberOfPagesToView(nPages, page);
    const obj = {
        data: jsonAns,
        isEmpty: jsonAns.length,
        page_numbers: paging.page_numbers,
        pageCurrent: page,
        nameCat1: jsonAns['0']['nameCat1'],
        nameCat2: jsonAns['0']['nameCat2'],
    }
    return obj
}

async function getPostPremiumByCat1(cat1, page) {
    var ans = await postModel.getPostPremiumByCat1(cat1, page)
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)
    const cnt = await postModel.getPagePremium(cat1);
    var nPages = Math.floor(cnt / 10);
    if (cnt % 10 !== 0) nPages++;
    var paging = processingNumberOfPagesToView(nPages, page);
    const obj = {
        data: jsonAns,
        isEmpty: jsonAns.length,
        page_numbers: paging.page_numbers,
        pageCurrent: page,
        nameCat1: jsonAns['0']['nameCat1'],
    }
    return obj
}

async function getPostByCat1(cat1, page) {
    var ans = await postModel.getPostByCat1(cat1, page);
    var stringAns = JSON.stringify(Object.assign({}, ans));
    var jsonAns = JSON.parse(stringAns)
    const cnt = await postModel.getPage(cat1)
    var nPages = Math.floor(cnt / 10);
    if (cnt % 10 !== 0) nPages++;
    var paging = processingNumberOfPagesToView(nPages, page)
    const obj = {
        data: jsonAns,
        isEmpty: jsonAns.length,
        page_numbers: paging.page_numbers,
        pageCurrent: page,
        nameCat1: jsonAns['0']['nameCat1'],
    }
    return obj;
}


router.get('/:cat1/:cat2', async function (req, res) {
    const cat1 = req.params.cat1
    const cat2 = req.params.cat2
    const page = req.query.page || 1
    var obj = {}
    var premium = 0;
    console.log(typeof(req.session.data));
    if (typeof(req.session.data) === 'undefined' || req.session.data === null){
        premium = 0
    } else premium = req.session.data.premium;
    
    console.log(premium)
    if (premium){
        obj = await getPostPremiumByCat2(cat2, page)
    } else {
        obj = await getPostByCat2(cat2, page)
    }
    // res.send(jsonAns)
    res.render('posts/categories', obj)
})



// get 10 posts/page (category1)
router.get('/:cat1', async function (req, res) {
    const cat1 = req.params.cat1
    const page = req.query.page || 1
    var obj = {}
    var premium = 0;
    if (typeof(req.session.data) === 'undefined' || req.session.data === null){
        premium = 0
    } else premium = req.session.data.premium;
    console.log(req.session.data)
    if (premium){
        obj = await getPostPremiumByCat1(cat1, page)
    } else {
        obj = await getPostByCat1(cat1, page)
    }
    // res.send(jsonAns)
    res.render('posts/categories', obj)
})

module.exports = router;