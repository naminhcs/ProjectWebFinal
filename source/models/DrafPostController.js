const db = require('../db')
const imgModel = require('./imgController')
module.exports = {

    async getDrafPostFromTo(left, right, keyCat1){
        const posts = await db.firestore.collection('DrafPost').where('keyCat1', '==', keyCat1).limit(right).get()
        right = Math.min(right, posts.docs.length)
        var ans = []
        for (let i = left; i < right; i++){
            var post = posts.docs[i].data()
            ans.push(post)
        }
        return ans
    },

    async getDrafPostByCat1(keyCat1, page){
        const left = (page - 1) * 15
        const right = (page) * 15
        const posts = await this.getDrafPostFromTo(left, right, keyCat1)
        return posts
    },

    async getDrafPostByID(id){
        const post = await db.firestore.collection('DrafPost').doc(id).get()
        if (typeof(post.data()) === 'undefined'){
            return 'cant found'
        } else {
            return post.data()
        }
    },
    
    async rejectPost(id, data, editor){
        var post = await this.getDrafPostByID(id)
        if (post === 'cant found') return post
        post['rejectReason'] = data.rejectReason
        post['userEditor'] = editor
        await db.firestore.collection('DrafPost').doc(id).delete()
        await db.firestore.collection('RejectPost').doc().set(post)
        return 'done'
    },

    async acceptPost(id, data, editor){
        var post = await this.getDrafPostByID(id)
        if (post === 'cant found') return post
        post['rejectReason'] = ''
        post['userEditor'] = editor
        const t = new Date(data.dateUpload)
        post['dateUpload'] = t.getTime()
        post['status'] = 0
        post['view'] = 0
        post['keyCat2'] = data.keyCat2
        post['nameCat2'] = data.nameCat2
        post['listNameOfTag'] = data.listNameOfTag
        post['listKeyOfTag'] = data.listKeyOfTag
        await db.firestore.collection('DrafPost').doc(id).delete()
        await db.firestore.collection('WaitingPost').doc().set(post)
        return 'done'
    },
    
    async editDraftPost(id, data, file){
        await db.firestore.collection('DrafPost').doc(id).update(data)
        if (file !== null){
            await imgModel.uploadImg('DrafPost', file, id)
        }
        return 'done'
    }
}