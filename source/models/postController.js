const db = require('../db');
const tagModel = require('./tagController')
const catModel = require('./categoryController')

module.exports = {
    async updateAmountPost(val, keyCat1, keyCat2, value){
        var cat1 = await db.firestore.collection(val).where('key', '==', keyCat1).get()
        var cat2 = await db.firestore.collection(val).where('key', '==', keyCat2).get()
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

        await db.firestore.collection(val).doc(idCat1).update({'amount': val1});
        await db.firestore.collection(val).doc(idCat2).update({'amount': val2});
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
        var value = 'Count'; 
        if (post['permission'] === 1){value = 'CountPremium'}
        await this.updateAmountPost(value, post['keyCat1'], post['keyCat2'], 1)
        return 'done'
    },

    async updateView(id, view){
        await db.firestore.collection('Post').doc(id).update({'views': view})
    },

    async getPostByID(id, premium){
        const data = await db.firestore.collection('Post').doc(id).get();
        if (data.empty){
            return "Post cann't found";
        }
        if (data.data()['permission'] === 1){
            if (premium === 0){
                return "you need up your account to premium";
            }
        }
        var val;
        val = data.data();
        time = new Date(val['dateUpload'])
        time = time.toGMTString();
        val['dateUpload'] = time
        await this.updateView(val['id'], val['views'] + 1)
        return val;
    },

    async getHighlighByView(){
        const data = await db.firestore.collection('Post').where('permission', '==', 0).orderBy("views", "desc").limit(10).get();
        if (data.empty){
            return "null"
        } else {
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(val['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        }
    },

    async getNew(){
        const data = await db.firestore.collection('Post').where('permission', '==', 0).orderBy("dateUpload", "desc").limit(10).get();
        if (data.empty){
            return "null"
        } else {
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(val['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        }
    },

    async getPostInWeek(time){
        var data = await db.firestore.collection('Post').where('permission', '==', 0).orderBy('dateUpload','desc').where('dateUpload', '>=', time).get();
        if (data.empty){
            return "null"
        } else {
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(val['dateUpload'])
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
            var value = 'Count'
            if (data.data()['permission'] === 1){value = 'CountPremium'}
            await this.updateAmountPost(value, data.data()['keyCat1'], data.data()['keyCat2'], -1)
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

// -------------------------------------------------GET AMOUNT Post ----------------------------------------------------------------------------------------------------------------------------
    async getAmountPostPremiumByCat(cat){
        var data = await db.firestore.collection('CountPremium').where('key', '==', cat).get()
        if (data.empty){
            return null
        } else {
            return data.docs[0].data().amount
        }
    },

    async getAmountPostByCat(cat){
        var data = await db.firestore.collection('Count').where('key', '==', cat).get()
        if (data.empty){
            return null
        } else {
            return data.docs[0].data().amount
        }
    },

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------GET post with permission = 0 --------------------------------------------------------------------------------------------
    async getPostByCat2(cat2, page){
        page = (page - 1) * 10;
        if (page > 1){
            var first = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat2', '==', cat2).where('permission', '==', 0).limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];

            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat2', '==', cat2).where('permission', '==', 0).startAfter(last.data().dateUpload).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(val['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        } else {
            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat2', '==', cat2).where('permission', '==', 0).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(val['dateUpload'])
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
            var first = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat1', '==', cat1).where('permission', '==', 0).limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];

            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat1', '==', cat1).where('permission', '==', 0).startAfter(last.data().dateUpload).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(val['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        } else {
            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('keyCat1', '==', cat1).where('permission', '==', 0).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(val['dateUpload'])
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
            var first = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('listKeyOfTag', 'array-contains', key).where('permission', '==', 0).limit(page);
            const snapshot = await first.get();
            const last = snapshot.docs[snapshot.docs.length - 1];

            const data = await db.firestore.collection('Post').orderBy('dateUpload', 'desc').where('listKeyOfTag', 'array-contains', key).where('permission', '==', 0).startAfter(last.data().dateUpload).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(val['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        } else {
            const data = await db.firestore.collection('Post').where('listKeyOfTag', 'array-contains', key).where('permission', '==', 0).limit(10).get();
            var ans = [];
            data.forEach(doc =>{
                var val = doc.data()
                time = new Date(val['dateUpload'])
                time = time.toGMTString();
                val['dateUpload'] = time
                ans.push(val);
            })
            return ans;
        }
    },

    async getAPostByCat1(key){
        const data = await db.firestore.collection('Post').where('keyCat1', '==', key).where('permission', '==', 0).orderBy('views', 'desc').limit(1).get();
        var ans = [];
        data.forEach(doc =>{
            var val = doc.data()
            time = new Date(val['dateUpload'])
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
        for (let i = 0 ; i < Cat1.length; i++){
            var data = await this.getAPostByCat1(Cat1[i])
            res.push(data)
        }
        return res
    },

    async getPage(key){
        const data = await db.firestore.collection('Count').where('key', '==', key).get();
        ans = {}
        data.forEach(doc =>{
            ans = doc.data()
        })
        return ans['amount'];
    },

    async getRandomPostByCat2(key){
        const data = await db.firestore.collection('Post').where('keyCat2', '==', key).where('permission', '==', 0).get();
        var arr = []
        for (let i = 0; i < data.docs.length; i++) arr.push(i);
        const shuffled = arr.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 5);
        var ans = []
        for (let i = 0; i < 5; i++){
            var val = data.docs[selected[i]].data();
            time = new Date(val['dateUpload'])
            time = time.toGMTString();
            val['dateUpload'] = time
            ans.push(val);
        }
        return ans;
    },

    async getRandomPost(cat){
        var arrCat = []
        Object.keys(cat).forEach((key)=>{
            var val = cat[key]['listCat']
            Object.keys(val).forEach((key2)=>{
                var val2 = val[key2]['keyCat2'];
                arrCat.push(val2)
            })
        })
        const shuffled = arrCat.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 5);
        ansPosts = []
        for (let i = 0; i < 5; i++){
            const rnd = await this.getRandomPostByCat2(selected[i])
            ansPosts.push(rnd)
        }
        return ansPosts;
    },

// --------------------------------------------------------------------------------------END------------------------------------------------------------------------------------------------------------------------------------------
  
//-------------------------------------------------------------------------GET POST Premium ------------------------------------------------------------------------------------------------------------------------------------------
    
    async getPostPremiumFromTo(left, right, key, value){
        var ans = []
        if (right === 0) return ans;
        const data = await db.firestore.collection('Post').where('permission', '==', 1).where(key, '==', value).orderBy('dateUpload', 'desc').limit(right).get();
        var ans = []
        for (let i = left; i < right; i++){
            ans.push(data.docs[i].data())
        }
        return ans;
    },

    async getPostFromTo(left, right, key, value){
        var ans = []
        if (right === 0) return ans;
        const data = await db.firestore.collection('Post').where(key, '==', value).orderBy('dateUpload', 'desc').limit(right).get();
        for (let i = left; i < right; i++){
            ans.push(data.docs[i].data())
        }
        return ans;
    },

    async getPostPremiumByCat2(cat2, page){
        page = (page - 1) * 10;
        var ans = []
        const x = await db.firestore.collection('CountPremium').where('key', '==', cat2).get()
        const amountPremium = x.docs[0].data().amount;
        var numberPostPremium = 0;
        var indexFromPremium = 0;
        var indexToPremium = 0;

        var numberPost = 0;
        var indexFromPost = 0;
        var indexToPost = 0;

        if (page < amountPremium) {
            numberPostPremium = Math.min(10, amountPremium - page);
            indexFromPremium = page;
            indexToPremium = page + numberPostPremium;
            numberPost = 10 - numberPostPremium;
            indexFromPost = 0;
            indexToPost = numberPost;
        } else {
            indexFromPost = page - amountPremium;
            indexToPost = indexFromPost + 10;
        }
        const pre = await this.getPostPremiumFromTo(indexFromPremium, indexToPremium, 'keyCat2', cat2);
        const post = await this.getPostFromTo(indexFromPost, indexToPost, 'keyCat2', cat2);
        for (let i = 0; i < pre.length; i++){
            ans.push(pre[i]);
        }
        for (let i = 0; i < post.length; i++){
            ans.push(post[i])
        }
        for (let i = 0; i < ans.length; i++){
            const time = new Date(ans[i]['dateUpload'])
            ans[i]['dateUpload'] = time.toGMTString();
        }
        return ans;
    },

    async getPostPremiumByCat1(cat1, page){
        page = (page - 1) * 10;
        var ans = []
        const x = await db.firestore.collection('CountPremium').where('key', '==', cat1).get()
        const amountPremium = x.docs[0].data().amount;
        var numberPostPremium = 0;
        var indexFromPremium = 0;
        var indexToPremium = 0;

        var numberPost = 0;
        var indexFromPost = 0;
        var indexToPost = 0;

        if (page < amountPremium) {
            numberPostPremium = Math.min(10, amountPremium - page);
            indexFromPremium = page;
            indexToPremium = page + numberPostPremium;
            numberPost = 10 - numberPostPremium;
            indexFromPost = 0;
            indexToPost = numberPost;
        } else {
            indexFromPost = page - amountPremium;
            indexToPost = indexFromPost + 10;
        }
        const pre = await this.getPostPremiumFromTo(indexFromPremium, indexToPremium, 'keyCat1', cat1);
        const post = await this.getPostFromTo(indexFromPost, indexToPost, 'keyCat1', cat1);
        for (let i = 0; i < pre.length; i++){
            ans.push(pre[i]);
        }
        for (let i = 0; i < post.length; i++){
            ans.push(post[i])
        }
        for (let i = 0; i < ans.length; i++){
            const time = new Date(ans[i]['dateUpload'])
            ans[i]['dateUpload'] = time.toGMTString();
        }
        return ans;
    },

    async getPostPremiumByTag(key){
        const dataPre = await db.firestore.collection('Post').where('permission', '==', 1).where('listKeyOfTag', 'array-contains', key).limit(10).get();
        var countPost = 10 - dataPre.docs.length;
        const dataPost = await db.firestore.collection('Post').where('permission', '==', 0).where('listKeyOfTag', 'array-contains', key).limit(countPost).get();
        var ans = []
        for (let i = 0; i < dataPre.docs.length; i++){
            ans.push(dataPre.docs[i].data())
        }
        for (let i = 0; i < dataPost.docs.length; i++){
            ans.push(dataPost.docs[i].data())
        }
        for (let i = 0; i < ans.length; i++){
            const time = new Date(ans[i]['dateUpload'])
            ans[i]['dateUpload'] = time.toGMTString();
        }
        return ans;
    },


    async getPagePremium(key){
        const data = await db.firestore.collection('Count').where('key', '==', key).get();
        const dataPremium = await db.firestore.collection('CountPremium').where('key', '==', key).get()
        return data.docs[0].data().amount + dataPremium.docs[0].data().amount;
    },

// ---------------------------------------------------------------------------UPDATE database --------------------------------------------------------------------------------------------------------------------------
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    async update(post){
        const id = post['id']
        const keyCat1 = post['keyCat1']
        const keyCat2 = post['keyCat2']
        await db.firestore.collection('Post').doc(id).update({permission: 1})
        await this.updateAmountPost(keyCat1, keyCat2, -1)
    },

    async makePostToPremiumByCat2(key){
        const count = await this.getRandomInt(3,8);
        var indexArray = []
        const data = await db.firestore.collection('Post').where('keyCat2', '==', key).get()
        for (let i = 0; i < data.docs.length; i++){
            indexArray.push(i)
        }
        const shuffled = indexArray.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, count);
        for (let i = 0; i < count; i++){
            const post = data.docs[selected[i]].data()
            await this.update(post)
        }
    },

    async createPremiumPost(cat){
        var arrCat = []
        Object.keys(cat).forEach((key)=>{
            var val = cat[key]['listCat']
            Object.keys(val).forEach((key2)=>{
                var val2 = val[key2]['keyCat2'];
                arrCat.push(val2)
            })
        })
        for (let i = 0 ; i < arrCat.length; i++){
            await this.makePostToPremiumByCat2(arrCat[i]);
        }
        return 'done'
    },

    async amountPremiumPostByCat2(key){
        const data = await db.firestore.collection('Post').where('permission', '==', 1).where('keyCat2', '==', key).get()
        const amount = data.docs.length;
        const obj = {
            'key' : key,
            'amount': amount
        }
        await db.firestore.collection('CountPremium').doc().set(obj);
    },

    async amountPremiumPostByCat1(key){
        const data = await db.firestore.collection('Post').where('permission', '==', 1).where('keyCat1', '==', key).get()
        const amount = data.docs.length;
        const obj = {
            'key' : key,
            'amount': amount
        }
        await db.firestore.collection('CountPremium').doc().set(obj);
    },

    async amountPremiumPost(cat){
        var arrCat = []
        var arrCat1 = []
        Object.keys(cat).forEach((key)=>{
            var val = cat[key]['listCat']
            var cat1 = cat[key]['keyCat1']
            arrCat1.push(cat1)
            Object.keys(val).forEach((key2)=>{
                var val2 = val[key2]['keyCat2'];
                arrCat.push(val2)
            })
        })
        for (let i = 0 ; i < arrCat.length; i++){
            await this.amountPremiumPostByCat2(arrCat[i]);
        }
        for (let i = 0; i < arrCat1.length; i++){
            await this.amountPremiumPostByCat1(arrCat1[i])
        }
        return 'done'
    },

    async setWriterForPost(){
        const data = await db.firestore.collection('Post').get()
        var writer = 'writer'
        var nickName = ''
        var cnt = 141;
        var idWriter = 1
        for (let i = 0; i < data.docs.length; i++){
            if (cnt === 141){
                nickName = writer + idWriter.toString()
                idWriter++;
                cnt = 0
            }
            const id = data.docs[i].id;
            await db.firestore.collection('Post').doc(id).update({'nickName': nickName});
            cnt++;
        }
        return 'ok'
    },

    async setEditorForCat(){
        const data = await db.firestore.collection('Category').get()
        var editor = 'editor'
        var nickName = ''
        for (let i = 0; i < 12; i++){
            var idEditor = i + 1;
            nickName = editor + idEditor.toString();
            const id = data.docs[i].id
            await db.firestore.collection('Category').doc(id).update({'adminCat': nickName})
        }
    },

// --------------------------------------------------------------ADMIN------------------------------------------------------------------------------

    async editPostForAdmin(id, data){
        const post = await db.firestore.collection('Post').doc(id).get()
        if (typeof(post.data()) === 'undefined'){
            return 'post is unavailable'
        } else {
            // update count
            var isPremium = post.data().permission;
            var keyCat1 = post.data().keyCat1;
            var keyCat2 = post.data().keyCat2;
            if (isPremium){
                await this.updateAmountPost('CountPremium', keyCat1, keyCat2, -1)
            } else{
                await this.updateAmountPost('Count', keyCat1, keyCat2, -1)
            }
            isPremium = data.permission
            keyCat1 = data.keyCat1;
            keyCat2 = data.keyCat2;
            if (isPremium){
                await this.updateAmountPost('CountPremium', keyCat1, keyCat2, 1)
            } else{
                await this.updateAmountPost('Count', keyCat1, keyCat2, 1)
            }
            await db.firestore.collection('Post').doc(id).update(data)
        }
        return 'done'
    }
}