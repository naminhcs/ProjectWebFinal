const db = require('../db');

module.exports = {
    async addToken(token){
        return db.firestore.collection('Token').doc().set(token);  
    },

    async checkTokenIsAvailable(token){
        const data = await db.firestore.collection('Token').where('token', '==', token).get();
        if (data.empty){
            return false;
        } else return true;
    }
}