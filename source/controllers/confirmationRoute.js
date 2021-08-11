const jwt = require('jsonwebtoken');
const userModel = require('../models/userController');

const express = require('express');
const bodyParser = require('body-parser')
const tokenModel = require('../models/tokenController');

const router = express.Router();
router.use(bodyParser.json());

router.get('/confirmation/:token', async function(req, res){
    jwt.verify(req.params.token, process.env.TOKEN_SECRET, async function(err, decode){
        if (err){
            res.send("token is experied");
            return;
        }
        token = req.params.token;
        isAvailable = await tokenModel.checkTokenIsAvailable(token);
        console.log(isAvailable);
        if (isAvailable){
            res.send('token is unavailble')
            return;
        } else {
            obj = {"token" : token};
            await tokenModel.addToken(obj);
        }
        const userName = decode.userName;
        var userUpdateData = {};
        const type = req.query.type;
        if (type === 'confirm-account'){
            userUpdateData = {
                'confirmation': true
            }
        } else{
            userUpdateData = {
                'gmail': req.query.gmail
            }
            isGmailAvailable = await userModel.getUserByGmail(req.query.gmail)
            if (isGmailAvailable !== null){
                res.send('Gmail is available')
                return;
            }
        }
        userModel.updateUserByUserName(userName, userUpdateData);
        req.session.data.gmail = req.query.gmail
        res
        res.send('success');
    }) 
})

module.exports = router;