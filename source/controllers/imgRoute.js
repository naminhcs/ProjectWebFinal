const db = require('../db')
const multer = require('multer')
const bodyParser = require('body-parser')
const admin = require('firebase-admin')
const express = require('express')
const router = express.Router();
const imgModel = require('../models/imgController')

router.use(bodyParser.json())

const upload = multer({
    sotrage: multer.memoryStorage()
})

router.post('/upload', upload.single('file'), async function (req, res) {
    if (!req.file) {
        // return res.status(400).send("Error: No files found");
        return res.redirect('/user/profile');
    }
    console.log(req.session.data.id)
    result = await imgModel.uploadImg('User', req.file, req.session.data.id)
    //res.send(result)
    req.session.successMessage = 'Đổi ảnh đại diện thành công'
    res.redirect('/user/profile');
})

module.exports = router