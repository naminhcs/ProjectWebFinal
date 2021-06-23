const user = require('./userModel');
const db = require('../db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports = {

    getAllUser(){
        const data = []
        data = db.collection('User').doc().get();
        return data;
    },

    getUserByID(ID){
        const data = []
        data = db.collection('User').doc().get(ID);
        if (data === null){
            return null;
        } else return data[0];
    },

    getUserByUserName(userNAme){
        const data = []
        data = db.collection('User').doc().get(userName);
        if (data === null){
            return null;
        } else return data[0];
    },

    addUser(user){
        return db.collection('User').doc().set(user);  
    },

    delUser(user){
        db.collection('User').doc().delete(user);
        return 'success'; 
    },
}