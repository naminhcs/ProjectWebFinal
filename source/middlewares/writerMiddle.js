module.exports = function (app) {
    app.use('/writer/', require('../controllers/writerRoute'));
}
  