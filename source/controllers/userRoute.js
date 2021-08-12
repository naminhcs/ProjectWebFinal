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
const tokenModel = require('../models/tokenController')
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
  var dataUser = new user(data);
  const dataPush = {};
  for (x in dataUser) {
    dataPush[x] = dataUser[x];
  }
  // Sending Email
  const token = generateAccessToken({
    userName: data.userName
  });
  const s = `http://localhost:3000/confirmation/${token}?type=confirm-account`;

  const mailOption = {
    from: 'noreply@webapp.com',
    to: data.gmail,
    subject: 'Confirm email',
    text: s
  }
  await transporter.sendMail(mailOption)
  // ---- Add user to database
  await userModel.addUser(dataPush);

  //res.send(data);
  const successNotification = 'Check your mail and click link to confirm account!';
  res.redirect(`/login?successNotification=${successNotification}`);
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
  console.log(req.body)
  if (user === null) {
    res.render('vwAccount/login', {
      error: "Username isn't avaiable"
    })
    return;
  }
  console.log(user)
  const ret = bcrypt.compareSync(req.body.password, user.password);
  if (ret === true) {
    if (user.confirmation === false) {
      // res.send('U need to confirm your email.')
      res.render('vwAccount/login', {
        error: "You need to confirm your email to active account"
      })
      return;
    }
    const d = new Date();
    var isPremium = 0;
    if (user.dayEndPremium > d.getTime()) isPremium = 1;
    console.log('user', user.dayEndPremium, isPremium)
    req.session.data = {
      id: user.id,
      userName: user.userName,
      permission: user.permission,
      premium: isPremium,
      dayEndPremium: user.dayEndPremium,
      nameOfUser: user.nameOfUser,
      gmail: user.gmail,
      dayOfBirth: user.dayOfBirth,
      nickName: user.nickName,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
    }
    req.session.auth = true;

    res.locals.auth = req.session.auth;
    res.locals.dataUser = req.session.data;

    console.log(req.session.urlRedirect)
    url = req.session.urlRedirect || '/'
    res.redirect(url)
    return;
  } else {
    // res.send('password incorrect');
    res.render('vwAccount/login', {
      error: "Password is not correct"
    })
    return;
  }
})

//-----------------Logout---------------------------------------
router.post('/logout', auth.isLogin, async function (req, res) {
  req.session.auth = false;
  req.session.data = null;
  res.locals.auth = false;
  res.locals.dataUser = null;
  // get previous url
  const url = req.headers.referer || '/';
  res.redirect(url)
  return;
})

//--------------------Forget-----------------------------------
router.get('/forget', auth.isNotLogin, function (req, res) {
  res.render('vwAccount/forgetPassword')
})

router.post('/forget', auth.isNotLogin, async function (req, res) {
  const type = String(req.body.select);
  const data = req.body;

  var user;

  if (type.localeCompare('gmail') === 0) {
    user = await userModel.getUserByGmail(data.gmail);
  } else {
    user = await userModel.getUserByUserName(data.userName);
  }

  if (user === null) {
    res.render('vwAccount/forgetPassword', {
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
  jwt.verify(req.params.token, process.env.TOKEN_SECRET, async function (err) {
    if (err) {
      res.send("token is expired")
      return;
    }
    res.render('vwAccount/changeForgetPassword')
  })
})

router.post('/forget/:token', async function (req, res) {

  jwt.verify(req.params.token, process.env.TOKEN_SECRET, async function (err, decode) {
    if (err) {
      res.send("token is expired")
    }
    const dataNewPassword = req.body;
    token = req.params.token;
    isAvailable = await tokenModel.checkTokenIsAvailable(token);
    console.log(isAvailable)
    if (isAvailable) {
      res.send('token is unavailable')
      return;
    } else {
      obj = {
        "token": token
      };
      await tokenModel.addToken(obj);
    }
    const userName = decode.userName;
    const hash = bcrypt.hashSync(dataNewPassword.password, 10);
    var dataChange = {
      password: hash
    }
    userModel.updateUserByUserName(userName, dataChange);
    res.redirect('/user/login');
    return;
  });
})

//--------------------------Profile---------------------------------------------------------
router.get('/profile', auth.isLogin, async function (req, res) {
  var user = await userModel.getUserByID(req.session.data.id)

  const successMessage = String(req.session.successMessage);
  req.session.successMessage = ''
  res.locals.successMessage = successMessage
  // console.log('success message 1: ', successMessage)
  // console.log('success message 2: ', res.locals.successMessage)


  var isPremium = 0;
  const d = new Date()
  if (d.getTime() < user.dayEndPremium) isPremium = 1;

  req.session.data = {
    id: user.id,
    userName: user.userName,
    permission: user.permission,
    premium: isPremium,
    dayEndPremium: user.dayEndPremium,
    nameOfUser: user.nameOfUser,
    gmail: user.gmail,
    dayOfBirth: user.dayOfBirth,
    nickName: user.nickName,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture,
  }

  res.locals.dataUser = req.session.data
  // res.send(req.session.data);
  // console.log(res.locals.dataUser)
  res.render('vwAccount/profileUser')
})

//-------------------------------Update Profile----------------------------------------------------------------
router.post('/update-profile', async function (req, res) {
  const dataUpdate = {
    nameOfUser: req.body.nameOfUser,
    phoneNumber: req.body.phoneNumber,
    dayOfBirth: req.body.dayOfBirth,
    nickName: req.body.nickName
  }
  console.log(req.body)
  const result = await userModel.updateUserByUserName(req.session.data.userName, dataUpdate)

  req.session.data.nameOfUser = req.body.nameOfUser
  req.session.data.nameOfUser = req.body.nameOfUser
  req.session.data.phoneNumber = req.body.phoneNumber
  req.session.data.dayOfBirth = req.body.dayOfBirth
  req.session.data.nickName = req.body.nickName

  res.locals.dataUser = req.session.data

  req.session.successMessage = 'Your personal detail haved been updated!'
  res.redirect('/user/profile')
})


//--------------------------Change Password in Profile---------------------------------------------------------
router.post('/change-password', auth.isLogin, async function (req, res) {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const data = await userModel.getUserByID(req.session.data.id);
  const ret = bcrypt.compareSync(oldPassword, data.password);
  if (ret === true) {
    const password = bcrypt.hashSync(newPassword, 10);
    var dataChange = {
      password: password
    }
    await userModel.updateUserByUserName(data['userName'], dataChange);
    req.session.successMessage = 'Your password haved been changed!'
    res.redirect('/user/profile')
  } else {
    res.locals.errorMessage = 'Current password is not correct!'
    res.render('vwAccount/changePassword')
  }
})


router.get('/change-password', auth.isLogin, async function (req, res) {
  res.render('vwAccount/changePassword')
})




//--------------------------Resend Token----------------------------------------------------
router.post('/resend', async function (req, res) {
  const data = req.body;
  const user = await userModel.getUserByUserName(data.userName)
  if (user === null) {
    res.send("Can not find user")
  }

  const token = generateAccessToken({
    userName: user.userName
  });

  const s = `http://localhost:3000/confirmation/${token}?type=confirm-account`;

  const mailOption = {
    from: 'noreply@webapp.com',
    to: data.gmail,
    subject: 'Confirm email',
    text: s
  }
  await transporter.sendMail(mailOption)
  res.send("OK")
})

//-------------------------Change Gmail--------------------------------------------------------
router.get('/change-gmail', auth.isLogin, function (req, res) {
  // res.send(req.session.data);
  res.render('vwAccount/changeGmail')
})
router.post('/change-gmail', auth.isLogin, async function (req, res) {
  const data = req.body;
  const userName = req.session.data.userName
  const user = await userModel.getUserByUserName(userName);
  const ret = bcrypt.compareSync(data.password, user.password);
  if (ret === 'false') {
    res.send('wrong password');
    return;
  }

  isGmailAvailable = await userModel.getUserByGmail(data.gmail)
  if (isGmailAvailable !== null) {
    // res.send('Gmail is available')
    res.locals.errorMessage = 'This gmail is used!'
    res.render('vwAccount/changeGmail')
    return;
  }
  const token = generateAccessToken({
    userName: user.userName
  })

  const s = `http://localhost:3000/confirmation/${token}?type=gmail&gmail=${data.newGmail}`;
  const mailOption = {
    from: 'noreply@webapp.com',
    to: data.newGmail,
    subject: 'Confirm change gmail',
    text: s
  }
  await transporter.sendMail(mailOption)
  req.session.successMessage = 'Your gmail haved been changed!';
  res.redirect('/user/profile')
})

//-------------------------Upgrade account to premium---------------------------------------------
router.get('/upgrade-to-premium', auth.isLogin, function (req, res) {
  // res.send(req.session.data);
  res.render('vwAccount/register-premium')
})

router.post('/upgrade', auth.isLogin, async function (req, res) {
  const data = req.body.days * 24 * 3600 * 1000;
  const d = new Date();
  const now = d.getTime();
  dayEndPremium = Math.max(req.session.data.dayEndPremium, now)
  const newTime = dayEndPremium + data;
  const updateData = {
    'dayEndPremium': newTime
  }
  result = await userModel.updateUserByUserName(req.session.data.userName, updateData)
  req.session.data.dayEndPremium = newTime;
  req.session.data.premium = 1
  // res.send(result)
  req.session.successMessage = 'Your account have been upgraded!';
  res.redirect('/user/profile')
})
module.exports = router;