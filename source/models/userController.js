const user = require('./userModel');
const db = require('../db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    async getUserFromToForAllUser(left, right){
        const data = await db.firestore.collection('User').limit(right).get()
        const ans = []
        for (let i = left; i < Math.min(right, data.docs.length); i++){
            var obj = {}
            obj = data.docs[i].data()
            delete obj.password
            obj['id'] = data.docs[i].id
            ans.push(obj)
        }
        return ans;
    },

    async getAllUser(page){
        const left = (page - 1) * 15
        const right = page * 15
        const data = this.getUserFromToForAllUser(left, right)
        return data
    },

    async countUserByPermission(type){
        if (type === 'all'){
            const data = await db.firestore.collection('User').get()
            return data.docs.length
        }
        if (type === 'user'){
            const data = await db.firestore.collection('User').where('permission', '==', 0).get()
            return data.docs.length
        }
        if (type === 'admin'){
            const data = await db.firestore.collection('User').where('permission', '==', 1).get()
            return data.docs.length
        }
        if (type === 'editor'){
            const data = await db.firestore.collection('User').where('permission', '==', 2).get()
            return data.docs.length
        }
        if (type === 'writer'){
            const data = await db.firestore.collection('User').where('permission', '==', 3).get()
            return data.docs.length
        }
    },

    async getUserFromTo(left, right, permission){
        const data = await db.firestore.collection('User').where('permission', '==', permission).limit(right).get()
        const ans = []
        for (let i = left; i < Math.min(right, data.docs.length); i++){
            var obj = {}
            obj = data.docs[i].data()
            delete obj.password
            obj['id'] = data.docs[i].id
            ans.push(obj)
        }
        return ans;
    },

    async getUserByPermission(type, page){
        var permission = 0
        const left = (page - 1) * 15
        const right = page * 15
        if (type === 'admin') permission = 1
        if (type === 'editor') permission = 2
        if (type === 'writer') permission = 3 
        const data = this.getUserFromTo(left, right, permission)
        return data;
    },

    async getUserByID(userID){
        var data = await db.firestore.collection('User').doc(userID).get();
        var val ={};
        if (data.empty){
            return "User not found"
        } else{
            val = data.data()
            val['id'] = userID
        }
        return val;
    },

    async getUserByUserName(userName){
        const data = await db.firestore.collection('User').where('userName', '==', userName).get();
        if (data.empty){
            return null;
        }
        var val;
        data.forEach(doc =>{
            val = doc.data()
            val['id'] = doc.id
        })
        return val;
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
        var val;
        data.forEach(doc =>{
            val = doc.data()
            val['id'] = doc.id
        })
        return val;
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
            const categories = await db.firestore.collection('Category').where('adminCat','==', data.data().userName).get()
            categories.forEach(async function(category){
                id = category.id
                await db.firestore.collection('Category').doc(id).update({adminCat: ''})
            })
            await db.firestore.collection('User').doc(id).delete();
            return 'done'
        }
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