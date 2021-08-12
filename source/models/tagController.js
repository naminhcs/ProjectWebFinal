const db = require('../db');

module.exports = {
    async addTag(tag){
        const check = await this.checkTagByName(tag.key);
        if (check === false){
            return "Key of Tag is available";
        }
        await db.firestore.collection('Tag').doc().set(tag); 
        return "done" 
    },

    async getAllTag(page){
        if (page == 1){
            const data = await db.firestore.collection('Tag').limit(25).get();
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
            page = (page - 1) * 25 - 1;
            const first = await db.firestore.collection('Tag').limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];

            const data = await db.firestore.collection('Tag').startAfter(last.data()).limit(25).get();
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data())
            })
            return ans
        }
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

    async editTag(body){
        data = await db.firestore.collection('Tag').where("key", "==", body.key).get();
        check = data.empty
        if (check === true){
            return "user not found"
        } else {
            var id
            data.forEach(doc =>{
                id = doc.id
            })
            await db.firestore.collection('Tag').doc(id).update(body);
            return 'ok'
        }
    },

    async delTag(id){
        tag = await db.firestore.collection('Tag').doc(id).get();
        const type = typeof tag.data();
        if (type === "undefined"){
            return "can't find tag"
        } else {
            await db.firestore.collection('Tag').doc(id).delete();
            return 'done'
        }
    }
}