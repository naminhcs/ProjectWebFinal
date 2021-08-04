const db = require('../db');
const tagModel = require('./tagController')
const catModel = require('./categoryController')

module.exports = {
    async updateAmountPost(keyCat1, keyCat2, value){
        var cat1 = await db.firestore.collection('Count').where('key', '==', keyCat1).get()
        var cat2 = await db.firestore.collection('Count').where('key', '==', keyCat2).get()
        var all = await db.firestore.collection('Count').where('key', '==', 'all-post').get()
        var Cat1, Cat2, All, idCat1, idCat2, idAll;

        cat1.forEach(doc =>{
            Cat1 = doc.data()
            idCat1 = doc.id
        })
        cat2.forEach(doc =>{
            Cat2 = doc.data()
            idCat2 = doc.id
        })
        all.forEach(doc =>{
            All = doc.data()
            idAll = doc.id
        })

        var val1 = Cat1['amount'] + value
        var val2 = Cat2['amount'] + value
        var valAll = All['amount'] + value

        await db.firestore.collection('Count').doc(idCat1).update({'amount': val1});
        await db.firestore.collection('Count').doc(idCat2).update({'amount': val2});
        await db.firestore.collection('Count').doc(idAll).update({'amount': valAll});
    },

    async addPost(post){
        const data = await db.firestore.collection('Post').doc();
        var id;
        id = data.id
        const d = new Date(post['dateUpload'])
        const t = d.getTime()
        post['id'] = id
        post['dateUpload'] = t;
        await data.set(post);
        await this.updateAmountPost(post['keyCat1'], post['keyCat2'], 1)
        return 'done'
    },

    async updateView(id, view){
        await db.firestore.collection('Post').doc(id).update({'views': view})
    },

    async getPostByID(id){
        const data = await db.firestore.collection('Post').doc(id).get();
        if (data.empty){
            return "Post cann't found";
        } else {
            var val;
            val = data.data();
            time = new Date(val['dateUpload'])
            time = time.toGMTString();
            val['dateUpload'] = time
        }
        await this.updateView(val['id'], val['views'] + 1)
        return val;
    },

    async getHighlighByView(){
        const data = await db.firestore.collection('Post').orderBy("views", "desc").limit(10).get();
        if (data.empty){
            return "null"
        } else {
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        }
    },

    async getNew(){
        const data = await db.firestore.collection('Post').orderBy("dateUpload", "desc").limit(10).get();
        if (data.empty){
            return "null"
        } else {
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        }
    },

    async getPostInWeek(time){
    //    var data = await db.firestore.collection('Post').orderBy('views', 'desc').where('views', '>', 0).orderBy('dateUpload', 'desc').where('dateUpload', '>=', time).limit(4).get();
        var data = await db.firestore.collection('Post').where('dateUpload', '>=', time).get();
        if (data.empty){
            return "null"
        } else {
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            var res = []
            ans.sort(function cmp(obj1, obj2){
                return obj1['views'] - obj2['views'];
            });
            for (let i = ans.length - 1; i >= 0; i--){
                res.push(ans[i]);
                if (res.length == 4) break;
            }
            return res;
        }
    },

    async editPost(post, id){
        var data = await db.firestore.collection('Post').doc(id).get()
        const type = typeof data.data();
        if (type === "undefined"){
            return "can't find post"
        } else {
            await db.firestore.collection('Post').doc(id).update(post);
            return 'done'
        }
    },

    async delPost(id){
        var data = await db.firestore.collection('Post').doc(id).get()
        const type = typeof data.data();
        if (type === "undefined"){
            return "can't find post"
        } else {
            await this.updateAmountPost(data.data()['keyCat1'], data.data()['keyCat2'], -1)
            await db.firestore.collection('Post').doc(id).delete();
            return 'done'
        }
    },

    async getAllPostByNickName(nickName){
        var data = await db.firestore.collection('Post').where('nickName', '==', nickName).get();
        if (data.empty){
            return "can't find post"
        } else {
            var ans = []
            data.forEach(doc =>{
                ans.push(doc.data());
                ans[ans.length - 1]["id"] = doc.id; 
            })
            return ans;
        }
    },
    
    async updateStatusById(id, stt){
        var data = await db.firestore.collection('Post').doc(id).get();
        const type = typeof data.data();
        if (type === "undefined"){
            return "can't find post"
        } else {
            await db.firestore.collection('Post').doc(id).update({'status': stt});
            return 'done'
        }
    },

    async getPostByCat2(cat2, page){
        page = (page - 1) * 10;
        if (page > 1){
            var first = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat2', '==', cat2).limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];

            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat2', '==', cat2).startAfter(last.data().dateUpload).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        } else {
            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat2', '==', cat2).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        }
    },

    async getPostByCat1(cat1, page){
        page = (page - 1) * 10;
        if (page > 1){
            var first = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat1', '==', cat1).limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];

            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat1', '==', cat1).startAfter(last.data().dateUpload).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        } else {
            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat1', '==', cat1).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        }
    },

    async getPostByTag(key, page){
        page = (page - 1) * 10;
        if (page > 1){
            var first = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('listKeyOfTag', 'array-contains', key).limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];

            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('listKeyOfTag', 'array-contains', key).startAfter(last.data().dateUpload).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        } else {
            const data = await db.firestore.collection('Post').where('listKeyOfTag', 'array-contains', key).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        }
    },

    async getAPostByCat1(key){
        const data = await db.firestore.collection('Post').where('keyCat1', '==', key).orderBy('views', 'desc').limit(1).get();
        var ans = [];
        data.forEach(doc =>{
            var val = doc.data()
            time = new Date(['dateUpload'])
            time = time.toGMTString();
            val['dateUpload'] = time
            ans.push(val);
        })
        return ans;
    },

    async getTopOfPostInEachCat1(body){
        var Cat1 = []
        Object.keys(body).forEach(async function(key) {
            var value = body[key];
            Cat1.push(value['keyCat1'])
        });
        var res = []
        console.log(Cat1)
        for (let i = 0 ; i < Cat1.length; i++){
            var data = await this.getAPostByCat1(Cat1[i])
            res.push(data)
        }
        return res
    },
}