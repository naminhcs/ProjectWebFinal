module.exports = function (app) {
    app.use('/post/', require('../controllers/postRoute'));
}
  