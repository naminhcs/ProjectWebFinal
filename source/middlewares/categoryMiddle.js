module.exports = function (app) {
    app.use('/cat/', require('../controllers/categoryRoute'));
}