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
    if(!req.file) {
        return res.status(400).send("Error: No files found");
    } 
    result = await imgModel.uploadImg('User', req.file, 'mbYsNdmQdxlntaVgEg7j')
    res.send(result)
})

module.exports = router