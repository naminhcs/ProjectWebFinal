const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const user = require('../models/userModel')
const auth = require('../middlewares/authMethod')

const userModel = require('../models/userController');
const router = express.Router();
router.use(bodyParser.json());

router.post('/users', auth.isAdmin , async function(req, res){
  var allUser = await userModel.getAllUser();
  res.send(allUser)
})

router.get('/user', auth.isAdmin , async function(req, res){
  var query = require('url').parse(req.url,true).query;
  id = query.id
  var data = await userModel.getUserByID(id)
  res.send(data);
})

module.exports = router;