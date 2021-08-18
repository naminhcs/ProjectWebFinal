const db = require('../db')
const postModel = require('./postController')
const tagModel = require('./tagController')
module.exports = {
    async getWaitingPostFromTo(left, right, userEditor){
        const posts = await db.firestore.collection('WaitingPost').where('userEditor', '==', userEditor).limit(right).get()
        right = Math.min(posts.docs.length, right)
        var ans = []
        for (let i = left; i < right; i++){
            const post = posts.docs[i].data()
            ans.push(post)
        }  
        return ans
    },

    async getPostByEditor(userEditor, page){
        var ans = await postModel.getPostByEditor(userEditor, page)
        var topPost = ans.topPost
        var amountPostWaiting = 15 - ans.posts.length
        var right = page * 15 - topPost
        var left = Math.max(0, right - amountPostWaiting)
        var waitingPost
        if (right > 0) {
            waitingPost = await db.firestore.collection('WaitingPost').where('userEditor', '==', userEditor).limit(right).get()
            right = Math.min(right, waitingPost.docs.length)
        }
        for (let i = left; i < right; i++){
            var post = waitingPost.docs[i].data()
            post['id'] = waitingPost.docs[i].id
            ans.posts.push(post)
        }
        return ans.posts
    },

    async getPostByID(id){
        const data = await db.firestore.collection('WaitingPost').doc(id).get();
        if (data.empty){
            return "Post cann't found";
        }
        var val;
        val = data.data();
        console.log(val)
        time = new Date(val['dateUpload'])
        time = time.toGMTString();
        val['dateUpload'] = time
        val['id'] = id;
        return val;
    },

    async updateWaitingPost(){
        const t = new Date()
        const time = t.getTime()
        const posts = await db.firestore.collection('WaitingPost').where('dateUpload', '<=', time).get()
        posts.forEach(async function(doc){
            var dataPublic = doc.data()
            for (let i = 0; i < dataPublic.listKeyOfTag; i++){
                var key = dataPublic.listKeyOfTag[i]
                var name = dataPublic.listNameOfTag[i]
                var tag = {
                    key: key,
                    name: name
                }
                await tagModel.addTag(tag)
            }
            dataPublic['status'] = 1;
            dataPublic['view'] = 0;
            if (dataPublic['permission'] === '1') dataPublic['permission'] = 1; else dataPublic['permission'] = 0;
            await postModel.addPost(dataPublic)
            await db.firestore.collection('WaitingPost').doc(doc.id).delete()
        })
    }
}