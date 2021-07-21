const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const tag = require('../models/tagModel')


const tagModel = require('../models/tagController');
const router = express.Router();
router.use(bodyParser.json());

router.get('/all', async function(req, res){
    const data = await tagModel.getAllTag();
    res.send(data);
})

router.post('/add', async function(req, res){
    const data = await tagModel.checkTagByName(req.body.name);
    if (data === false){
        res.send('Tag is available');
        return;
    } else{
        await tagModel.addTag(req.body);
        res.send("done");
        return;
    }
})

module.exports = router;