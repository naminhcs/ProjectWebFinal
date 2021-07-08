const express = require('express');
const postModel = require('../models/postModel');
const router = express.Router();



router.get('/', function (req, res) {
  res.render('vwAdmin/dashboard',{layout:'admin.hbs'});
})
router.get('/dashboard', function (req, res) {
  res.render('vwAdmin/dashboard',{layout:'admin.hbs'});
})
router.get('/tag', function (req, res) {
  res.render('vwAdmin/tag',{layout:'admin.hbs'});
})
router.get('/category', function (req, res) {
  res.render('vwAdmin/category',{layout:'admin.hbs'});
})
router.get('/post', async function (req, res) {
  const list = await postModel.all();

  res.render('vwAdmin/post',{layout:'admin.hbs',db: list});
})
router.get('/editpost', async function (req, res) {
  const list = await postModel.all();

  res.render('vwAdmin/editpost',{layout:'admin.hbs',db: list});
})
router.get('/edituser', async function (req, res) {
  const list = await postModel.all();

  res.render('vwAdmin/edituser',{layout:'admin.hbs',db: list});
})
// router.get('/table/editpost', async function (req, res) {
//   const list = await postModel.all();
//   res.render('vwAdmin/table',{layout:'admin.hbs',db: list});
// })
router.get('/usermanagement', async function (req, res) {
  const list = await postModel.alluser();

  res.render('vwAdmin/usermanagement',{layout:'admin.hbs',db: list});
})



router.get('/post', function (req, res) {
  const list = postModel.all();
  res.render('vwAdmin/post',{
    layout:'admin.hbs',
    posts: list,
    empty: list.length === 0
  });
})

module.exports = router;