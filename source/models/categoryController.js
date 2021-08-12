const e = require('express')
const db = require('../db')
const { getPagePremium } = require('./postController')

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
    },

    async updateCat2(allCat, cat2, data){
        var idCat1 = ''
        Object.keys(allCat).forEach(key1 =>{
            var objCat1 = allCat[key1]
            Object.keys(objCat1.listCat).forEach(key2 =>{
                var objCat2 = objCat1.listCat[key2]
                if (objCat2 === cat2){
                    idCat1 = objCat1.keyCat1
                    return
                }
            })
        })
        if (idCat1 === '') return null
        var cat1 = await db.firestore.collection('Category').where('keyCat1', '==', idCat1).get()
        if (cat1.empty){
            return null
        } else{
            id = cat1.docs[0].id
            var newListCat2 = []
            Object.keys(cat1.docs[0].data().listCat).forEach(key =>{
                var objCat2 = cat1.docs[0].data().listCat[key]
                if (objCat2.keyCat2 === data.keyCat2){
                    newListCat2.push(data)
                } else {
                    newListCat2.push(objCat2)
                }
            })
            //update Category
            await db.firestore.collection('Category').doc(id).update({listCat: newListCat2})
            //update Post
            await db.firestore.collection('Post').where('keyCat2', '==', data.keyCat2).update(data)
            //update Count
            await db.firestore.collection('Count').where('key', '==', data.keyCat2).update({key: data.keyCat2})
            //update CountPremium
            await db.firestore.collection('CountPremium').where('key', '==', data.keyCat2).update({key: data.keyCat2})
            return 'done'
        }
    },

    async addCat1(data){
        var result = 'done'
        const cat1 = await db.firestore.collection('Category').where('keyCat1', '==', data.keyCat1).get()
        Object.keys(data.listCat).forEach(key =>{
            var objCat2 = data.listCat[key]
            const cat2 = await db.firestore.collection('Count').where('key', '==', objCat2.keyCat2).get()
            if (!cat2.empty){
                result = 'key Cat2 is available'
                return
            }
        })
        if (result !== 'done'){
            return result
        }
        if (cat1.empty){
            await db.firestore.collection('Category').doc().set(data)
            await db.firestore.collection('Count').doc.set({key: data.keyCat1, amount: 0})
            await db.firestore.collection('CountPremium').doc.set({key: data.keyCat1, amount: 0})
            Object.keys(data.listCat).forEach(key =>{
                var objCat2 = data.listCat[key]
                await db.firestore.collection('Count').doc.set({key: objCat2.keyCat2, amount: 0})
                await db.firestore.collection('CountPremium').doc.set({key: objCat2.keyCat2, amount: 0})
            })
            return result
        } else {
            return 'keycat1 is available'
        }
    },

    async addCat2(keyCat1, data){
        var cat1 = await db.firestore.collection('Category').where('keyCat1', '==', keyCat1).get()
        if (cat1.empty){
            return null
        } else{
            id = cat1.docs[0].id
            var newListCat2 = []
            Object.keys(cat1.docs[0].data().listCat).forEach(key =>{
                var objCat2 = cat1.docs[0].data().listCat[key]
                newListCat2.push(objCat2)
            })
            newListCat2.push(data)
            await db.firestore.collection('Count').doc.set({key: data.keyCat2, amount: 0})
            await db.firestore.collection('CountPremium').doc.set({key: data.keyCat2, amount: 0})
            return 'done'
        }
    },

    async delCat1(keyCat1){
        await db.firestore.collection('Post').where('keyCat1', '==', keyCat1).delete()
        await db.firestore.collection('Category').where('keyCat1', '==', keyCat1).delete()
        await db.firestore.collection('Count').where('key','==', keyCat1).delete()
        await db.firestore.collection('CountPremium').where('key', '==', keyCat1).delete()
        // Chưa delete các count, countPremium có key = keyCat2 trong category
    },

    async delCat2(keyCat2, keyCat1){
        var cat1 = await db.firestore.collection('Category').where('keyCat1', '==', keyCat1).get()
        if (cat1.empty){
            return 'cat1 is not available'
        } else {
            id = cat1.doc[0].id
            var newListCat2 = []
            Object.keys(cat1.docs[0].data().listCat).forEach(key =>{
                var objCat2 = cat1.docs[0].data().listCat[key]
                if (objCat2.keyCat2 !== keyCat2) newListCat2.push(objCat2)
            })
            await db.firestore.collection('Category').doc(id).update({listCat: newListCat2})
            const amountNor = await db.firestore.collection('Count').where('key', '==', keyCat2).get()
            if (amountNor.empty){
                return null
            } else {
                const idNor = amountNor.docs[0].id
                const amount = amountNor.docs[0].data().amount
                await db.firestore.collection('Count').doc(idNor).delete()
                await db.firestore.collection('CountPremium').where('keyCat1', '==', keyCat1).get()
            }
        }
    }
}