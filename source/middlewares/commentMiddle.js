module.exports = function (app) {
    app.use('/cmt/', require('../controllers/commentRoute'));
}