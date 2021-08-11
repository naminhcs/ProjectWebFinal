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


}