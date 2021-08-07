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
                ans[ans.length - 1]["id"] = doc.id; 
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
        await db.firestore.collection('User').doc().set(user);
        return "ok"
    },

    async delUser(id){
        const data = await db.firestore.collection('User').doc(id).get();
        const type = typeof data.data();
        if (type === "undefined"){
            return "can't find tag"
        } else {
            await db.firestore.collection('User').doc(id).delete();
            return 'done'
        }
    },

    async updateUserByUserName(userName, userDataUpdate){
        const data = await db.firestore.collection('User').where('userName', '==', userName).get();
        console.log(data.empty)
        if (data.empty){
            return 'user cannot find'
        }
        var userID;
        data.forEach(doc =>{
            userID = doc.id;
        })
        db.firestore.collection('User').doc(userID).update(userDataUpdate);
        return 'success';
    },

    async editUser(user){
        const data = await db.firestore.collection('User').where("userName", "==", user.userName).get();
        check = data.empty
        if (check === true){
            return "user not found"
        } else {
            var id
            data.forEach(doc =>{
                id = doc.id
            })
            await db.firestore.collection('User').doc(id).update(user);
            return 'ok'
        }
    }
}