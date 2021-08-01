const db = require('../db');
const {expect} = require('chai');
module.exports = {
    async addPost(post){
        return db.firestore.collection('Post').doc().set(post);  
    },

    async getAllPost(){
        const data = await db.firestore.collection('Post').get();
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

    async getPostByID(id){
        const data = await db.firestore.collection('Post').doc(id).get();
        if (data.empty){
            return "Post cann't found";
        } else {
            var val;
            val = data.data();
        }
        return val;
    },

    async getAllPostWithTag(tag){
        const data = await db.firestore.collection('Post').where('listTag', 'array-contains', tag).get();
        if (data.empty){
            return "Post cann't found"
        } else {
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data());
                ans[ans.length - 1]["id"] = doc.id; 
            })
            return ans;
        }
    },

    async getHighlighByView(){
        const data = await db.firestore.collection('Post').orderBy("view", "desc").limit(10).get();
        if (data.empty){
            return "null"
        } else {
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data());
                ans[ans.length - 1]["id"] = doc.id; 
            })
            return ans;
        }
    },

    async getNew(){
        const data = await db.firestore.collection('Post').orderBy("dateUpload", "desc").limit(10).get();
        if (data.empty){
            return "null"
        } else {
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data());
                ans[ans.length - 1]["id"] = doc.id; 
            })
            return ans;
        }
    },

    async getPostInWeek(time){
        var data = await db.firestore.collection('Post').orderBy('dateUpload').get();
        if (data.empty){
            return "null"
        } else {
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data());
                ans[ans.length - 1]["id"] = doc.id; 
            })
            return ans;
        }
    },

    async editPost(post, id){
        var data = await db.firestore.collection('Post').doc(id).get()
        const type = typeof data.data();
        if (type === "undefined"){
            return "can't find post"
        } else {
            await db.firestore.collection('Post').doc(id).update(post);
            return 'done'
        }
    },

    async delPost(id){
        var data = await db.firestore.collection('Post').doc(id).get()
        const type = typeof data.data();
        if (type === "undefined"){
            return "can't find post"
        } else {
            await db.firestore.collection('Post').doc(id).delete();
            return 'done'
        }
    },

    async getAllPostByNickName(nickName){
        var data = await db.firestore.collection('Post').where('nickName', '==', nickName).get();
        if (data.empty){
            return "can't find post"
        } else {
            var ans = []
            data.forEach(doc =>{
                ans.push(doc.data());
                ans[ans.length - 1]["id"] = doc.id; 
            })
            return ans;
        }
    },
    
    async updateStatusById(id, stt){
        var data = await db.firestore.collection('Post').doc(id).get();
        const type = typeof data.data();
        if (type === "undefined"){
            return "can't find post"
        } else {
            await db.firestore.collection('Post').doc(id).update({'status': stt});
            return 'done'
        }
    }
}