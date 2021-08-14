const db = require('../db')

module.exports = {
    async getWaittingPostFromTo(left, right, keyCat){
        const posts = await db.firestore.collection('WaittingPost').where('keyCat1', '==', keyCat).limit(right).get()
        right = Math.min(posts.docs.length, right)
        for (let i = left; i < right; i++){
            const post = posts.docs[i].data()
            
        }  
    },
    async getWaittingPostByUserName(userName, page){
        const left = (page - 1) * 15;
        const right = page * 15;

    }
}