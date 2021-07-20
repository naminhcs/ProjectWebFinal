const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const user = require('../models/userModel')


const userModel = require('../models/userController');
const router = express.Router();
router.use(bodyParser.json());

function isAdmin(req){
  if (req.session.auth != true){
    return false;
  }
  if (req.session.data.permission == 10) return true;
  return false;
}

router.post('/users', async function(req, res){
  if (isAdmin(req) == false){
    res.send("U aren't permission")
    return;
  }
  var allUser = await userModel.getAllUser();
  res.send(allUser)
})

router.get('/user', async function(req, res){
  if (isAdmin(req) == false){
    res.send("U aren't permission")
    return;
  }
  var query = require('url').parse(req.url,true).query;
  id = query.id
  var data = await userModel.getUserByID(id)
  res.send(data);
})

module.exports = router;