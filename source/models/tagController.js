const db = require('../db');

module.exports = {
    async addTag(tag){
        const check = await this.checkTagByName(tag.key);
        if (check === false){
            return "Key of Tag is available";
        }
        await db.firestore.collection('Tag').doc().set(tag);
        const amount = await db.firestore.collection('CountTag').doc('LnPsax2Ap2o6ZPiHtAOw').get()
        amountTag = amount.data().amount + 1
        await db.firestore.collection('CountTag').doc('LnPsax2Ap2o6ZPiHtAOw').update({amount: amountTag})
        return "done" 
    },

    async getAllTag(page){
        if (page == 1){
            const data = await db.firestore.collection('Tag').orderBy('key').limit(15).get();
            if (data.empty){
                return "data is empty";
            } else {
                var ans = [];
                data.forEach(doc =>{
                    ans.push(doc.data());
                    ans[ans.length - 1]["id"] = doc.id; 
                })
                return ans;
            }
        } else {
            page = (page - 1) * 15;
            const first = await db.firestore.collection('Tag').orderBy('key').limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];
            const data = await db.firestore.collection('Tag').orderBy('key').startAfter(last.data().key).limit(15).get();
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data())
            })
            return ans
        }
    },

    async getAmountTag(){
        const amount = await db.firestore.collection('CountTag').doc('LnPsax2Ap2o6ZPiHtAOw').get()
        amountTag = amount.data().amount
        return amountTag
    },

    async checkTagByName(key){
        const data = await db.firestore.collection('Tag').where('key', '==', key).get();
        if (data.empty){
            return true;
        } else return false;
    },
    
    async getTagByID(id){
        const data = await db.firestore.collection('Tag').doc(id).get();
        if (data.empty){
            return "null"
        } else return data.data();
    },

    async editTag(id, body){
        var data = await db.firestore.collection('Tag').doc(id).get()
        if (typeof(data.data()) === 'undefined'){
            return "can't find tag"
        } else {
            const posts = await db.firestore.collection('Post').where('listKeyOfTag', 'array-contains', data.data().key).get()
            if (!posts.empty){
                posts.forEach(async function(post){
                    const doc = post.data()
                    const idPost = post.id
                    var listKeyTag = []
                    var listNameTag = []
                    for (let i = 0; i < doc.listKeyOfTag.length; i++){
                        var keyTag = doc.listKeyOfTag[i]
                        var nameTag = doc.listNameOfTag[i]
                        if (keyTag === data.data().key){
                            listKeyTag.push(body.key)
                            listNameTag.push(body.name)
                        } else {
                            listKeyTag.push(keyTag)
                            listNameTag.push(nameTag)
                        }
                    }
                    await db.firestore.collection('Post').doc(idPost).update({listKeyOfTag: listKeyTag, listNameOfTag: listNameTag})
                })
            }
            await db.firestore.collection('Tag').doc(id).update(body)
            return 'done'
        }
    },

    async delTag(id){
        data = await db.firestore.collection('Tag').doc(id).get();
        const type = typeof data.data();
        if (type === "undefined"){
            return "can't find tag"
        } else {
            const posts = await db.firestore.collection('Post').where('listKeyOfTag', 'array-contains', data.data().key).get()
            if (!posts.empty){
                posts.forEach(async function(post){
                    const doc = post.data()
                    const idPost = post.id
                    var listKeyTag = []
                    var listNameTag = []
                    for (let i = 0; i < doc.listKeyOfTag.length; i++){
                        var keyTag = doc.listKeyOfTag[i]
                        var nameTag = doc.listNameOfTag[i]
                        if (keyTag === data.data().key){
                            continue
                        } else {
                            listKeyTag.push(keyTag)
                            listNameTag.push(nameTag)
                        }
                    }
                    await db.firestore.collection('Post').doc(idPost).update({listKeyOfTag: listKeyTag, listNameOfTag: listNameTag})
                })
            }
            await db.firestore.collection('Tag').doc(id).delete();
            const amount = await db.firestore.collection('CountTag').doc('LnPsax2Ap2o6ZPiHtAOw').get()
            amountTag = amount.data().amount - 1
            await db.firestore.collection('CountTag').doc('LnPsax2Ap2o6ZPiHtAOw').update({amount: amountTag})
            return 'done'
        }
    }
}