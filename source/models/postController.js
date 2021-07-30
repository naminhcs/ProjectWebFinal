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

    async getPostById(id){
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
        var data = await db.firestore.collection('Post').where("dateUpload", ">=" , time).orderBy('dateUpload').orderBy("view", "desc").limit(3).get();
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
    }
}