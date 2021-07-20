module.exports = function (app) {
    app.use('/tag/', require('../controllers/tagRoute'));
}
  