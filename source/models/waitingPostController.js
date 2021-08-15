const db = require('../db')
const postModel = require('./postController')
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
        var waitingPost = await db.firestore.collection('WaitingPost').where('userEditor', '==', userEditor).limit(right).get()
        for (let i = left; i < right; i++){
            const post = waitingPost.docs[i].data()
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
        time = new Date(val['dateUpload'])
        time = time.toGMTString();
        val['dateUpload'] = time
        return val;
    },
}