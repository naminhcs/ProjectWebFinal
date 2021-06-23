const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
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
  return jwt.sign(userName, process.env.TOKEN_SECRET, { expiresIn: '60s' });
};

router.post('/register', async function (req, res) {
    const data = req.body;
    const hash = bcrypt.hashSync(data.passWord, 10);
    data.passWord = hash;
    const token = generateAccessToken({userName: data.userName});
    const s = `http://localhost:3000/confirmation/${token}`;
    
    const mailOption = {
      from : 'noreply@webapp.com',
      to: data.gmail,
      subject: 'Confirm email', 
      text: s
    }
    await transporter.sendMail(mailOption)
    await userModel.addUser(data);
    res.send("ok");
})


router.post('/login', async function (req, res) {
  const user = await userModel.findByUsername(req.body.userName);
  if (user === null) {
    res.send("userName isn't avaiable")
  }
  const ret = bcrypt.compareSync(req.body.passWord, user.passWord);
  if (ret === true) {
    if (user.comfirmation === false) {
      res.send('U need to confirm your email.')
    }
    res.send("ok")
  }
})

module.exports = router;