const user = require('./userModel');
const db = require('../db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    async getAllUser(){
        const data = await db.firestore.collection('User').get();
        if (data.empty){
            return "data is empty";
        } else {
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data());
                ans[ans.length - 1]["Id"] = doc.id; 
            })
            return ans;
        }
    },

    async getUserByID(userID){
        var data = await db.firestore.collection('User').doc(userID).get();
        if (data.empty){
            return "User not found"
        } else{
            return data.data()
        }
    },

    async getUserByUserName(userName){
        const data = await db.firestore.collection('User').where('userName', '==', userName).get();
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
        const data = await db.firestore.collection('User').where('nickName', '==', nickName).get();
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
        const data = await db.firestore.collection('User').where('gmail', '==', gmail).get();
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
        return db.firestore.collection('User').doc().set(user);  
    },

    async delUser(user){
        const data = await db.firestore.collection('User').where('userName', '==', userName).get();
        if (data.empty){
            return 'dont have user';
        }
        data.forEach(async doc=>{
            await db.firestore.collection('User').doc(doc.id).delete();
        })
        return 'success'; 
    },

    async updateUserByUserName(userName, userDataUpdate){
        const data = await db.firestore.collection('User').where('userName', '==', userName).get();
        if (data.empty){
            return 'user cannot find'
        }
        var userID;
        data.forEach(doc =>{
            userID = doc.id;
        })
        db.firestore.collection('User').doc(userID).update(userDataUpdate);
        return 'success';
    }
}