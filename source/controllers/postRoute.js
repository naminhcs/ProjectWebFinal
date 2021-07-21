const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const post = require('../models/postModel')
const auth = require('../middlewares/authMethod')

const postModel = require('../models/postController');
const router = express.Router();
router.use(bodyParser.json());

