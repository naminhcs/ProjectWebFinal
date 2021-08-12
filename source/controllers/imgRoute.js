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
    console.log(req.file)
    console.log(req.body)
    if(!req.file) {
        return res.status(400).send("Error: No files found");
    } 
    // res.send('aaa');
    // result = await imgModel.uploadImg('User', req.file, req.body.id)
    result = await imgModel.uploadImg('User', req.file, 'mbYsNdmQdxlntaVgEg7j')
    res.send(result)
})

module.exports = router
// test upload file and load file
// async function getURL(){
//   var storageRef = firebase.storage().ref();
//   var urlDownloadLink = await storageRef.child('/avatar.png').getDownloadURL();
//   console.log(urlDownloadLink);
// }
// getURL()

