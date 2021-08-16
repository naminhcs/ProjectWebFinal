const db = require('../db')
const imgUploadModel = require('../models/imgController')

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

    async getSavePostByWriter(writer, page){
        var ans = []
        return ans;
    }

}