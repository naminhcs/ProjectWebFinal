const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const user = require('../models/userModel')
const auth = require('../middlewares/authMethod')

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
    expiresIn: '200s'
  });
};  

//--------------Register-------------------
router.get('/register', auth.isNotLogin, function (req, res) {
  res.render('vwAccount/register');
})

router.post('/register', auth.isNotLogin, async function (req, res) {
  const data = req.body;
  const checkUserName = await userModel.getUserByUserName(data.userName);
  const checkGmail = await userModel.getUserByGmail(data.gmail);

  if (checkGmail !== null) {
    console.log('Gmail is used')
    res.render('vwAccount/register', {
      data: data,
      error: 'Gmail is used',
      errorGmail: true
    })
    return;
  }

  if (checkUserName !== null) {
    console.log('Username is used')
    res.render('vwAccount/register', {
      data: data,
      error: 'Username is used',
      errorUserName: true
    })

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

  //res.send(data);
  const successNotification = 'Check your mail and click link to confirm account!';
  res.redirect(`./login?successNotification=${successNotification}`);
})

//--------------Login-------------------
router.get('/login', auth.isNotLogin, function (req, res) {
  const successNotification = req.query.successNotification;
  res.render('vwAccount/login', {
    successNotification: successNotification
  });

})

router.post('/login', auth.isNotLogin, async function (req, res) {
  const user = await userModel.getUserByUserName(req.body.userName);
  if (user === null) {
    res.render('vwAccount/login', {
      error: "Username isn't avaiable"
    })
    return;
  }

  const ret = bcrypt.compareSync(req.body.password, user.password);
  console.log("nfsdahfjasnv");
  if (ret === true) {
    if (user.confirmation === false) {
      // res.send('U need to confirm your email.')
      res.render('vwAccount/login', {
        error: "You need to confirm your email to active account"
      })
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
    res.redirect('/')
    return;
  } else {
    // res.send('password incorrect');
    res.render('vwAccount/login', {
      error: "password is not correct"
    })
    return;
  }
})

//-----------------Logout---------------------------------------
router.post('/logout', auth.isLogin, async function (req, res) {
  req.session.auth = false;
  req.session.data = null;
  res.locals.auth = false;
  res.locals.data = null;
  res.send("ok");
  return;
})

//--------------------Forget-----------------------------------
router.get('/forget', auth.isNotLogin, function (req, res) {
  res.render('vwAccount/forgetPassword')
})

router.post('/forget',  auth.isNotLogin , async function (req, res) {
  const type = String(req.body.select);
  const data = req.body;

  var user;

  if (type.localeCompare('gmail') === 0) {
    user = await userModel.getUserByGmail(data.gmail);
  } else {
    user = await userModel.getUserByUserName(data.userName);
  }

  if (user === null) {
    res.render('vwAccount/forgetPassword',{
      error: 'User does not exists!'
    })
    return;
  }

  //generate Token and send email.
  const token = generateAccessToken({
    userName: user.userName
  });
  const s = `http://localhost:3000/user/forget/${token}`;

  const mailOption = {
    from: 'noreply@webapp.com',
    to: user.gmail,
    subject: 'Change password',
    text: s
  }
  await transporter.sendMail(mailOption);
  const successNotification = 'Check your mail and click link to confirm account!';
  res.redirect(`./login?successNotification=${successNotification}`);
})

//----------------------------Change password via token-------------------------------------------
router.get('/forget/:token', function (req, res) {
  res.render('vwAccount/changeForgetPassword')
})

router.post('/forget/:token', async function (req, res) {
  const dataNewPassword = req.body;
  const data = jwt.verify(req.params.token, process.env.TOKEN_SECRET, async function (err, decode) {
    try {
      const userName = decode.userName;
      const hash = bcrypt.hashSync(dataNewPassword.password, 10);
      var dataChange = {
        password: hash
      }
      userModel.updateUserByUserName(userName, dataChange);
      res.redirect('../login');
      return;
    } catch (error) {
      res.send('token is unavailable');
    }
  });
})

//--------------------------Profile---------------------------------------------------------
router.get('/profile', auth.isLogin , function (req, res) {
  res.send(req.session.data);
})

//--------------------------Resend Token----------------------------------------------------
router.post('/resend', async function (req, res){
  const data = req.body;
  const user = await userModel.getUserByUserName(data.userName)
  if (user === null){
    res.send("Can not find user")
  }

  const token = generateAccessToken({
    userName: user.userName
  });

  const s = `http://localhost:3000/confirmation/${token}`;

  const mailOption = {
    from: 'noreply@webapp.com',
    to: data.gmail,
    subject: 'Confirm email',
    text: s
  }
  await transporter.sendMail(mailOption)
  res.send("OK")
})

module.exports = router;

// test upload file and load file
// async function getURL(){
//   var storageRef = firebase.storage().ref();
//   var urlDownloadLink = await storageRef.child('/avatar.png').getDownloadURL();
//   console.log(urlDownloadLink);
// }
// getURL();