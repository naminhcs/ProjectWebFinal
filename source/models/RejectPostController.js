const db = require('../db')
const imgModel = require('./imgController')

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
    },

    async editRejectPost(id, body, file){
        await db.firestore.collection('RejectPost').doc(id).update(body)
        if (file !== null){
            await imgModel.uploadImg('RejectPost', file, id)
        }
        return 'done'
    },

    async submitRejectPost(id, body, file){
        await db.firestore.collection('RejectPost').doc(id).update(body)
        if (file !== null){
            await imgModel.uploadImg('RejectPost', file, id)
        }
        const post = await db.firestore.collection('RejectPost').doc(id).get()
        var data = post.data()
        delete data['rejectReason']
        delete data['userEditor']
        await db.firestore.collection('RejectPost').doc(id).delete()
        await db.firestore.collection('DrafPost').doc().set(data)
        return 'done'
    }
}