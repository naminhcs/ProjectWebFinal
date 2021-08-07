const cat = require('../models/categoryController')
module.exports = function (app) {
    app.use(async function (req, res, next) {
        if (typeof (req.session.auth) === 'undefined') {
            req.session.auth = false;
        }
        
       const data = await cat.getAllCategory()
        res.locals.auth = req.session.auth;
        res.locals.dataUser = req.session.data;
        res.locals.lcCategory = data
        // console.log(data)
        next();
    })
}