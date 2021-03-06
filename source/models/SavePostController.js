const db = require('../db')
const imgUploadModel = require('../models/imgController')
const { getPostByID } = require('./postController')

module.exports = {

    async savePostByID(id, data, file){
        if (id === -1){
            const post = await db.firestore.collection('SavePost').doc()
            id = post.id
            await post.set(data)
            if (file !== null){
                await imgUploadModel.uploadImg('SavePost', file, id)
            }
            return 'done'
        } else {
            await db.firestore.collection('SavePost').doc(id).update(data)
            if (file !== null){
                await imgUploadModel.uploadImg('SavePost', file, id)
            }
            return 'done'
        }
    },

    async submitPost(id, post, file){
        if (id === -1){
            const data = await db.firestore.collection('DrafPost').doc()
            id = data.id
            await data.set(post)
            await imgUploadModel.uploadImg('DrafPost', file, id)
            return 'done'
        } else {
            // update post in savePost
            await db.firestore.collection('SavePost').doc(id).update(post)
            // get data from savePost
            const data = await db.firestore.collection('SavePost').doc(id).get()
            const dataSubmit = data.data()
            // delete post in savePost
            await db.firestore.collection('SavePost').doc(id).delete()
            if (file !== null){
                //savepost -> drafPost
                const data = await db.firestore.collection('DrafPost').doc()
                id = data.id
                await data.set(dataSubmit)
                // add img nếu img thay đổi
                await imgUploadModel.uploadImg('DrafPost', file, id)
                return 'done'
            } else {
                await db.firestore.collection('DrafPost').doc().set(dataSubmit)
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
            var post = posts.docs[i].data()
            post['id'] = posts.docs[i].id
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
            var dataReturn = post.data()
            dataReturn['id'] = id
            return dataReturn
        }
    },

    async getTotalPage(type, writer){
        const posts = await db.firestore.collection(type).where('userWriter', '==', writer).get()
        var cnt = posts.docs.length
        var nPages = Math.floor(cnt / 15)
        if (cnt % 15 !== 0) nPages++;
        return nPages
    },
}