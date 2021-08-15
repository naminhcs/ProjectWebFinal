const db = require('../db')


module.exports = {

    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
       return result;
    },

    async uploadImg(type, file, id){
        fileName = await this.makeid(20)
        var storageRef = db.firestorage.ref(type + '/' + fileName);
        var result = 'err'
        storageRef.put(file.buffer, {
            contentType: file.mimetype
        }).then(() => storageRef.getDownloadURL()).then(async function(url){
            if (type === 'User')
                await db.firestore.collection(type).doc(id).update({profilePicture : url});
            else
                await db.firestore.collection(type).doc(id).update({urlPic: url});
            return 'done'
        })
        return result;
    }
}

