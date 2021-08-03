const db = require('../db');
const admin = require('firebase-admin');

module.exports = {
    async addPost(post){
        const data = await db.firestore.collection('Post').doc();
        var id;
        id = data.id
        const d = new Date(post['dateUpload'])
        const t = d.getTime()
        post['id'] = id
        post['dateUpload'] = t;
        data.set(post);
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
        const data = await db.firestore.collection('Post').orderBy("views", "desc").limit(10).get();
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
    },

    async getPostByCat2(cat2, page){
        page = (page - 1) * 10 - 1;
        if (page > 1){
            var first = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat2', '==', cat2).limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];

            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat2', '==', cat2).startAfter(last.data().dateUpload).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data())
            })
            return ans
        } else {
            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat2', '==', cat2).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data())
            })
            return ans
        }
    },

    async getPostByCat1(cat1, page){
        page = (page - 1) * 10 - 1;
        if (page > 1){
            var first = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat1', '==', cat1).limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];

            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat1', '==', cat1).startAfter(last.data().dateUpload).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data())
            })
            return ans
        } else {
            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat1', '==', cat1).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data())
            })
            return ans
        }
    },

    async getPostByTag(key, page){
        page = (page - 1) * 10 - 1;
        if (page > 1){
            var first = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('listKeyOfTag', 'array-contains', key).limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];

            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('listKeyOfTag', 'array-contains', key).startAfter(last.data().dateUpload).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data())
            })
            return ans
        } else {
            const data = await db.firestore.collection('Post').where('listKeyOfTag', 'array-contains', key).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data())
            })
            return ans
        }
    }
}