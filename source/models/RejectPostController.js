const db = require('../db')

module.exports = {

    async getRejectPostByEditor(page, editor){
        var left = (page - 1) * 15
        var right = left + 15
        const posts = await db.firestore.collection('RejectPost').where('userEditor', '==', editor).limit(right).get()
        var ans = []
        right = Math.min(right, posts.docs.length)
        for (let i = left; i < right; i++){
            const post = posts.docs[i].data()
            ans.push(post)
        }
        return ans;
    },

    async getRejectPostByID(id){
        const post = await db.firestore.collection('RejectPost').doc(id).get()
        const ans = post.data()
        return ans;
    }
}