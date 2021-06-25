const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const user = require('../models/userModel')
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  }
});

const userModel = require('../models/userController');
const router = express.Router();
router.use(bodyParser.json());

function generateAccessToken(userName) {
  return jwt.sign(userName, process.env.TOKEN_SECRET, {
    expiresIn: '60s'
  });
};

router.get('/login', function (req, res) {
  res.render('vwAccount/login');
})


router.get('/register', function (req, res) {
  res.render('vwAccount/register');
})

router.post('/register', async function (req, res) {
  const data = req.body;
  console.log(data)

  data.nickName = "";
  const checkUserName = await userModel.getUserByUserName(data.userName);
  //const checkNickName = await userModel.getUserByNickName(data.nickName);
  const checkGmail = await userModel.getUserByGmail(data.gmail);

  //console.log(checkNickName);
  console.log(checkGmail);
  console.log(checkUserName);
  if (checkGmail !== null) {

    res.end('Gmail is used');
    return;
  }

  // if (checkNickName !== null) {
  //   res.end('NickName is used');
  //   return;
  // }

  if (checkUserName !== null) {
    res.end('UserName is used');
    return;
  }

  const hash = bcrypt.hashSync(data.password, 10);
  data.password = hash;
  var dataUser = new user(data);
  const dataPush = {};
  for (x in dataUser) {
    dataPush[x] = dataUser[x];
  }
  // Sending Email
  const token = generateAccessToken({
    userName: data.userName
  });
  const s = `http://localhost:3000/confirmation/${token}`;

  const mailOption = {
    from: 'noreply@webapp.com',
    to: data.gmail,
    subject: 'Confirm email',
    text: s
  }
  await transporter.sendMail(mailOption)
  // ---- Add user into database
  await userModel.addUser(dataPush);


  res.send(data);
})


router.post('/login', async function (req, res) {
  console.log(req.body)

  const user = await userModel.getUserByUserName(req.body.userName);
  if (user === null) {
    res.send("userName isn't avaiable")
  }

  const ret = bcrypt.compareSync(req.body.password, user.password);
  if (ret === true) {
    if (user.comfirmation === false) {
      res.send('U need to confirm your email.')
    }
    res.send("ok")
  }
})

router.post('/update', async function (req, res) {
  userModel.updateUserByUserName(req.body.userName, req.body);
  res.send("ok /update user");
})

module.exports = router;