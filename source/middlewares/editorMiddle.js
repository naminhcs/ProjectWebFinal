module.exports = function (app) {
    app.use('/editor/', require('../controllers/editorRoute'));
}
  