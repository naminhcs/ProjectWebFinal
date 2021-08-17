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
            var post = posts.docs[i].data()
            post['id'] = posts.docs[i].id
            ans.push(post)
        }
        return ans;
    },

    async getTotalPageByEditor(type, userEditor){
        const posts = await db.firestore.collection(type).where('userEditor', '==', userEditor).get()
        const cnt = posts.docs.length
        var nPage = Math.floor(cnt / 15)
        if (cnt % 15 !== 0) nPage++;
        return nPage
    },

    async getRejectPostByID(id){
        const post = await db.firestore.collection('RejectPost').doc(id).get()
        var ans = post.data()
        ans['id'] = id;
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