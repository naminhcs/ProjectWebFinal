const db = require('../db')

module.exports = {
    async addCategory(cate){
        const data = await db.firestore.collection('Category').where('keyCat1', '==', cate.keyCat1).get()
        if (data.empty){
            await db.firestore.collection('Category').doc().set(cate)
            return "done"
        } else {
            return "category is available"
        }
    },

    async getAllCategory(){
        const data = await db.firestore.collection('Category').get()
        var ans = []
        data.forEach(doc => {
            ans.push(doc.data())
        })
        var stringAns = JSON.stringify(Object.assign({}, ans));
        var jsonAns = JSON.parse(stringAns)
        return jsonAns;
    },

    async getAllCat2ByCat1(cat1){
        const data = await db.firestore.collection('Category').where('keyCat1', '==', cat1).get()
        if (data.empty){
            return 'null'
        } else {
            return(data.docs[0].data().listCat)
        }
    },

    async updateCat1(cat1, data){
        const cat = await db.firestore.collection('Category').where('keyCat1', '==', cat1).get();
        if (cat.empty){
            return null
        } else {
            id = cat.docs[0].id
            await db.firestore.collection('Category').doc(id).update(data)
            // update post
            await db.firestore.collection('Post').where('keyCat1', '==', cat1).update(data)
            // update count 
            await db.firestore.collection('Count').where('key', '==', cat1).update({key: data.keyCat1})
            // update CountPremium
            await db.firestore.collection('CountPremium').where('key', '==', cat1).update({key: data.keyCat1})
            return 'done'
        }
    }
}