const db = require('../db');

module.exports = {
    async addPost(post){
        return db.firestore.collection('Post').doc().set(p);  
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
            data.forEach(doc =>{
                val = doc.data();
            })
            return val;
        }
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
    }
}