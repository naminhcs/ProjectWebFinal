const db = require('../db')
const imgUploadModel = require('../models/imgController')
const { getPostByID } = require('./postController')

module.exports = {

    async savePostByID(id, post, file){
        if (id === -1){
            const post = await db.firestore.collection('SavePost').doc().set(post)
            console.log(post.id)
            id = post.id
            if (file !== null){
                await imgUploadModel.uploadImg('SavePost', file, id)
            }
            return 'done'
        } else {
            await db.firestore.collection('SavePost').doc(id).update(post)
            if (file !== null){
                await imgUploadModel.uploadImg('SavePost', file, id)
            }
            return 'done'
        }
    },

    async submitPost(id, post){
        if (id === -1){
            const data = await db.firestore.collection('DrafPost').doc().set(post)
            id = data.id
            await imgUploadModel.uploadImg('DrafPost', file, id)
            return 'done'
        } else {
            // xóa post trong savepost
            await db.firestore.collection('SavePost').doc(id).delete()
            if (file !== null){
                //savepost -> drafPost
                const data = await db.firestore.collection('DrafPost').doc().set(post)
                id = data.id
                // add img nếu img thay đổi
                await imgUploadModel.uploadImg('DrafPost', file, id)
                return 'done'
            } else {
                await db.firestore.collection('DrafPost').doc().set(post)
                return 'done'
            }
        }
    },

    async getPostByWriter(writer, page, type){
        var ans = []
        var left = (page - 1) * 15
        var right = left + 15
        const posts = await db.firestore.collection(type).where('userWriter', '==', writer).limit(right).get()
        right = Math.min(right, posts.docs.length)
        for (let i = left; i < right; i++){
            const post = posts.docs[i].data()
            ans.push(post)
        }
        return ans;
    },

    async delelteSavePost(id, type){
        await db.firestore.collection(type).doc(id).delete()
        return 'done'
    },

    async getPostByID(id, type){
        const post = await db.firestore.collection(type).doc(id).get()
        if (typeof(post.data()) === 'undefined'){
            return 'cant found'
        } else {
            return post.data()
        }
    },

}