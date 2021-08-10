const db = require('../db')

module.exports = {
    async addComment(data){
        const result = await db.firestore.collection('Comment').doc().set(data)
        return 'done';
    },

    async getAllComment(postID){
        var ans = []
        const data = await db.firestore.collection('Comment').where('postID', '==', postID).orderBy('dateComment', 'desc').get();
        data.forEach(doc =>{
            var val = doc.data();
            const d = new Date(val['dateComment']);
            val['dateComment'] = d.toString();
            ans.push(val)
        })
        return ans;
    }
}