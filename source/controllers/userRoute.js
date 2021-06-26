const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const user = require('../models/userModel')

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
  return jwt.sign(userName, process.env.TOKEN_SECRET, { expiresIn: '1d' });
};

router.get('/register', function (req, res){
  res.render('register');
})

router.post('/register', async function (req, res) {
    const data = req.body;
    const checkUserName = await userModel.getUserByUserName(data.userName);
    const checkGmail = await userModel.getUserByGmail(data.gmail);

    if (checkGmail !== null){
        res.send('Gmail is used')
        return;
    }

    if (checkUserName !== null){
        res.end('UserName is used');
        return;
    }

    const hash = bcrypt.hashSync(data.password, 10);
    data.password = hash;
    var dataUser = new user(data);
    const dataPush = {};
    for (x in dataUser){
      dataPush[x] = dataUser[x];
    }
    // Sending Email
    const token = generateAccessToken({userName: data.userName});
    const s = `http://localhost:3000/confirmation/${token}`;
    
    const mailOption = {
      from : 'noreply@webapp.com',
      to: data.gmail,
      subject: 'Confirm email', 
      text: s
    }
    await transporter.sendMail(mailOption)
    // ---- Add user into database
    await userModel.addUser(dataPush);
    res.send(data);
})


router.get('/login', function (req, res){
  res.render('login');
})

router.post('/login', async function (req, res) {
  if (req.session.auth === true){
    res.send('u need to logout');
    return;
  }
  const user = await userModel.getUserByUserName(req.body.userName);
  if (user === null) {
    res.send("userName isn't avaiable")
  }
  const ret = bcrypt.compareSync(req.body.password, user.password);
  if (ret === true) {
    if (user.confirmation === false) {
      res.send('U need to confirm your email.')
      return;
    }
    req.session.data = {
      userName: user.userName,
      permission: user.permission,
      dayEndPremium: user.dayEndPremium,
      nameOfUser: user.nameOfUser
    }
    req.session.auth = true;

    res.locals.auth = req.session.auth;
    res.locals.data = req.session.data;
    res.send("ok")
    return;
  } else{
      res.send('password incorrect');
      return;
  }
})

router.post('/logout', async function(req, res){
  if (req.session.auth === false){
    res.send('need to login');
    return;
  }
  req.session.auth = false;
  req.session.data = null;
  res.locals.auth = false;
  res.locals.data = null;
  res.send("ok");
  return;
})

// router.get('/forget', function(req, res){
//   res.render('forget')
// })

router.post('/forget', async function(req,res){
    const data = req.body;
    var user;

    if (data.userName !== null){
      user = await userModel.getUserByUserName(data.userName);
    }
    if (data.gmail !== null){
      user = await userModel.getUserByGmail(data.gmail);
    }
    if (user === null){
      res.send("cant find user");
      return;
    }
    //generate Token and send email.
    const token = generateAccessToken({userName: user.userName});
    const s = `http://localhost:3000/forget/${token}`;
    
    const mailOption = {
      from : 'noreply@webapp.com',
      to: user.gmail,
      subject: 'Change password', 
      text: s
    }
    await transporter.sendMail(mailOption);
    res.send("ok")
})

// router.get('/forget/:token', function(res, req){
//   res.render('formchangepassword');
// })

router.post('/forget/:token', async function(req, res){
  const dataNewPassword = req.body;
  const data = jwt.verify(req.params.token, process.env.TOKEN_SECRET, async function(err, decode){
      try {
          const userName = decode.userName;
          const hash = bcrypt.hashSync(dataNewPassword.password, 10);
          var dataChange = {
            password: hash
          }
          userModel.updateUserByUserName(userName, dataChange);
          res.send('success');
          return;
          } catch (error) {
              res.send('token is unavailable');
          }
  });
})

router.get('/profile', function(req, res){
  res.send(req.session.data);
})

module.exports = router;