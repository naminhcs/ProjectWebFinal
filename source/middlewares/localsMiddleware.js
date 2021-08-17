const cat = require('../models/categoryController')
const wait = require('../models/waitingPostController')

module.exports = function (app) {
    app.use(async function (req, res, next) {
        if (typeof (req.session.auth) === 'undefined') {
            req.session.auth = false;
        }

        const data = await cat.getAllCategory()

    //    await wait.updateWaitingPost();
        res.locals.auth = req.session.auth;
        res.locals.dataUser = req.session.data;
        res.locals.lcCategory = data

        if (typeof (req.session.successMessage) === 'undefined') {
            req.session.successMessage = '';
        }

        next();
    })
}