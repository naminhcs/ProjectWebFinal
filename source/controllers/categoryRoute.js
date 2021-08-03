const express = require('express');
const bodyParser = require('body-parser')
const cateModel = require('../models/categoryController')

const router = express.Router();
router.use(bodyParser.json());

router.post('/add', async function(req, res){
    const data = req.body;
    result = await cateModel.addCategory(data)
    res.send(result)
})

router.get('/getall', async function(req, res){
    const data = await cateModel.getAllCategory()
    res.send(data)
})

module.exports = router;