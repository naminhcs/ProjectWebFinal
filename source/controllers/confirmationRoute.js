const jwt = require('jsonwebtoken');
const userModel = require('../models/userController');
const user = require('../models/userModel');
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
router.use(bodyParser.json());

router.get('/confirmation/:token', async function(req, res){
    const data = jwt.verify(req.params.token, process.env.TOKEN_SECRET, async function(err, decode){
        try {
            const userName = decode.userName;
            const userUpdate = userModel.getUserByUserName(userName);
            if (userUpdate === null){
                res.send('user cannot found');
                res.redirect('/login');
                return;
            }
            if (userUpdate.confirmation === true){
                res.send('token is unavailable');
                return;
            }
            var userUpdateData = {
                "confirmation" : true,
            }
            userModel.updateUserByUserName(userName, userUpdateData);
            res.send('success');
            } catch (error) {
                res.send('token is unavailable');
            }
    });
})

module.exports = router;