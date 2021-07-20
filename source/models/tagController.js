const db = require('../db');

module.exports = {
    async addTag(tag){
        return db.firestore.collection('Tag').doc().set(tag);  
    },

    async getAllTag(){
        const data = await db.firestore.collection('Tag').get();
        if (data.empty){
            return "data is empty";
        } else {
            var ans = [];
            data.forEach(doc =>{
                ans.push(doc.data());
                ans[ans.length - 1]["Id"] = doc.id; 
            })
            return ans;
        }
    }
}