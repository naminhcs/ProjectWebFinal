module.exports = {
    isLogin(req, res, next){
        if (req.session.auth !== true){
            req.session.urlRedirect = req.originalUrl;
            return res.redirect('/user/login');
        }
        next();
    },
    isAdmin(req, res, next){
        if (req.session.auth !== true){
            req.session.urlRedirect = req.originalUrl;
            return res.redirect('/user/login');
        }
        if (req.session.permission !== -1){
            return res.redirect('/');
        }
        next();
    },
    isNotLogin(req, res, next){
        if (req.session.auth === true){
            return res.redirect('/');
        }
        next();
    }
}