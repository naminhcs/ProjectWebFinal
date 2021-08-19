module.exports = {
    isLogin(req, res, next){
        console.log(req.user)
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
        if (req.session.data.permission !== 1){
            return res.redirect('/');
        }
        next();
    },
    isNotLogin(req, res, next){
        if (req.session.auth === true){
            return res.redirect('/');
        }
        next();
    },
    isEditor(req, res, next){
        if (req.session.auth !== true){
            req.session.urlRedirect = req.originalUrl;
            return res.redirect('/user/login');
        }
        if (req.session.data.permission !== 2){
            return res.redirect('/');
        }
        next();
    },
    isCensor(req, res ,next){
        if (req.session.auth !== true){
            req.session.urlRedirect = req.originalUrl;
            return res.redirect('/user/login');
        }
        if (req.session.data.permission === 0 || req.session.data.permission === 3){
            return res.redirect('/');
        }
        next();
    },
    
    isWriter(req, res, next){
        if (req.session.auth !== true){
            req.session.urlRedirect = req.originalUrl;
            return res.redirect('/user/login');
        }
        if (req.session.data.permission !== 3){
            return res.redirect('/');
        }
        next();
    }
}