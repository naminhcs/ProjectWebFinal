const user = require('./userModel');
const db = require('../db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports = {

    async getAllUser(){
        const data = db.collection('User').doc().get();
        if (data.empty){
            return "data is empty";
        } else {
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data());
            })
            return ans;
        }
    },

    async getUserByUserName(userName){
        console.log(userName);
        const data = await db.collection('User').where('userName', '==', userName).get();
        if (data.empty){
            return null;
        }
        var user;
        data.forEach(doc =>{
            user = doc.data();
        })
        return user;
    },

    async getUserByNickName(nickName){
        const data = await db.collection('User').where('nickName', '==', nickName).get();
        if (data.empty){
            return null;
        }
        var user;
        data.forEach(doc =>{
            user = doc.data();
        })
        return user;
    },

    async getUserByGmail(gmail){
        const data = await db.collection('User').where('gmail', '==', gmail).get();
        if (data.empty){
            return null;
        }
        var user;
        data.forEach(doc =>{
            user = doc.data();
        })
        return user;
    },
    async addUser(user){
        return db.collection('User').doc().set(user);  
    },

    async delUser(user){
        const data = await db.collection('User').where('userName', '==', userName).get();
        if (data.empty){
            return 'dont have user';
        }
        data.forEach(async doc=>{
            await db.collection('User').doc(doc.id).delete();
        })
        return 'success'; 
    },

    async updateUserByUserName(userName, userDataUpdate){
        const data = await db.collection('User').where('userName', '==', userName).get();
        if (data.empty){
            return 'user cannot find'
        }
        for (x in userDataUpdate){
            await db.collection('User').doc(data.id).update({x: userDataUpdate[x]});
        }
        return 'success';
    }
}