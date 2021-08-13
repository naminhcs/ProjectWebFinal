const db = require('../db')
const postModel = require('./postController')

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

    async getCat1ByKeyCat1(keyCat1){
        const data = await db.firestore.collection('Category').where('keyCat1', '==', keyCat1).get()
        var ans;
        data.forEach(doc=>{
            ans = doc.data()
        })
        return ans
    },

    async getAllCat2ByCat1(cat1){
        const data = await db.firestore.collection('Category').where('keyCat1', '==', cat1).get()
        if (data.empty){
            return 'null'
        } else {
            return(data.docs[0].data().listCat)
        }
    },

    async updateCat1(keyCat1, data){
        const isAvailable = await db.firestore.collection('Count').where('key', '==', data.keyCat1).get()
        if (!isAvailable.empty){
            return 'key cat1 is available'
        }
        var cat1 = await db.firestore.collection('Category').where('keyCat1', '==', keyCat1).get()
        if (cat1.empty){
            return 'can not find cat1 to update'
        } else{
            id = cat1.docs[0].id
            
            console.log(id)
            console.log(data)
            //update Category
            await db.firestore.collection('Category').doc(id).update(data)

            //update Post
            const posts = await db.firestore.collection('Post').where('keyCat1', '==', keyCat1).get();
            posts.forEach(async function(doc){
                await db.firestore.collection('Post').doc(doc.id).update({keyCat1: data.keyCat1})
            })

            //update Count
            const count = await db.firestore.collection('Count').where('key', '==', keyCat1).get()
            count.forEach(async function (doc){
                await db.firestore.collection('Count').doc(doc.id).update({key: data.keyCat1})
            })

            //update CountPremium
            const countPremium = await db.firestore.collection('CountPremium').where('key', '==', keyCat1).get()
            countPremium.forEach(async function(doc){
                await db.firestore.collection('CountPremium').doc(doc.id).update({key: data.keyCat1})
            })
            return 'done'
        }
    },

    async updateCat2(keyCat1, cat2, data){
        const isAvailable = await db.firestore.collection('Count').where('key', '==', data.keyCat2).get()
        if (!isAvailable.empty){
            return 'key cat2 is available'
        }
        var cat1 = await db.firestore.collection('Category').where('keyCat1', '==', keyCat1).get()
        if (cat1.empty){
            return 'can not found cat1'
        } else{
            id = cat1.docs[0].id
            var newListCat2 = []
            Object.keys(cat1.docs[0].data().listCat).forEach(key =>{
                var objCat2 = cat1.docs[0].data().listCat[key]
                if (objCat2.keyCat2 === cat2){
                    newListCat2.push(data)
                } else {
                    newListCat2.push(objCat2)
                }
            })
            //update Category
            await db.firestore.collection('Category').doc(id).update({listCat: newListCat2})

            //update Post
            const posts = await db.firestore.collection('Post').where('keyCat2', '==', cat2).get();
            posts.forEach(async function(doc){
                await db.firestore.collection('Post').doc(doc.id).update({keyCat2: data.keyCat2})
            })

            //update Count
            const count = await db.firestore.collection('Count').where('key', '==', cat2).get()
            count.forEach(async function (doc){
                await db.firestore.collection('Count').doc(doc.id).update({key: data.keyCat2})
            })

            //update CountPremium
            const countPremium = await db.firestore.collection('CountPremium').where('key', '==', cat2).get()
            countPremium.forEach(async function(doc){
                await db.firestore.collection('CountPremium').doc(doc.id).update({key: data.keyCat2})
            })
            return 'done'
        }
    },

    async addCat1(data){
        var result = 'done'
        var listKeyCat2 = []
        Object.keys(data.listCat).forEach(key =>{
            var objCat2 = data.listCat[key]
            listKeyCat2.push(objCat2)
        })

        for (let i = 0; i < listKeyCat2.length; i++){
            const cat2 = await db.firestore.collection('Count').where('key', '==', listKeyCat2[i].keyCat2).get()
            if (!cat2.empty){
                result = 'keyCat2 is available'
                break;
            }
        }
        if (result !== 'done'){
            return result
        }
        const cat1 = await db.firestore.collection('Category').where('keyCat1', '==', data.keyCat1).get()
        if (cat1.empty){
            await db.firestore.collection('Category').doc().set(data)
            await db.firestore.collection('Count').doc().set({key: data.keyCat1, amount: 0})
            await db.firestore.collection('CountPremium').doc().set({key: data.keyCat1, amount: 0})
            for (let i = 0; i < listKeyCat2.length; i++){
                var objCat2 = listKeyCat2[i]
                await db.firestore.collection('Count').doc().set({key: objCat2.keyCat2, amount: 0})
                await db.firestore.collection('CountPremium').doc().set({key: objCat2.keyCat2, amount: 0})
            }
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
            console.log(newListCat2)
            await db.firestore.collection('Category').doc(id).update({listCat: newListCat2})
            await db.firestore.collection('Count').doc().set({key: data.keyCat2, amount: 0})
            await db.firestore.collection('CountPremium').doc().set({key: data.keyCat2, amount: 0})
            return 'done'
        }
    },

    async delCat1(keyCat1){
        var cat1 = await db.firestore.collection('Category').where('keyCat1', '==', keyCat1).get()
        var listCat2 = []
        if (cat1.empty){
            return 'cat1 can not found'
        } else {
            cat1.forEach(async function(doc){
                Object.keys(doc.data().listCat).forEach(key =>{
                    var keyCat2 = doc.data().listCat[key].keyCat2;
                    listCat2.push(keyCat2)
                })
                listCat2.push(doc.data().keyCat1)
                
                //del category
                await db.firestore.collection('Category').doc(doc.id).delete()

                //del post
                const posts = await db.firestore.collection('Post').where('keyCat1', '==', doc.data().keyCat1).get()
                posts.forEach(async function(post){
                    await db.firestore.collection('Post').doc(post.id).delete()
                })

                // del count cat1 + cat2
                for (let i = 0; i < listCat2.length; i++){
                    const count = await db.firestore.collection('Count').where('key', '==', listCat2[i]).get()
                    count.forEach(async function(doc){
                        await db.firestore.collection('Count').doc(doc.id).delete()
                    })
                }
                // del countpremium cat1 + cat2
                for (let i = 0; i < listCat2.length; i++){
                    const count = await db.firestore.collection('CountPremium').where('key', '==', listCat2[i]).get()
                    count.forEach(async function(doc){
                        await db.firestore.collection('CountPremium').doc(doc.id).delete()
                    })
                }
            })
            return 'done'
        }
    },

    async delCat2(keyCat1, keyCat2){
        var cat1 = await db.firestore.collection('Category').where('keyCat1', '==', keyCat1).get()
        if (cat1.empty){
            return 'cat1 is not available'
        } else {
            id = cat1.docs[0].id
            var newListCat2 = []
            var isAvailable = false
            Object.keys(cat1.docs[0].data().listCat).forEach(key =>{
                var objCat2 = cat1.docs[0].data().listCat[key]
                if (objCat2.keyCat2 !== keyCat2) {
                    newListCat2.push(objCat2);
                } else{
                        isAvailable = true
                    }
            })
            if (isAvailable === false){
                return 'cat2 is not available'
            }
            await db.firestore.collection('Category').doc(id).update({listCat: newListCat2})
            
            // delete all posts have keyCat2
            const posts = await db.firestore.collection('Post').where('keyCat2', '==', keyCat2).get()
            posts.forEach(async function(doc){
                const result = await postModel.delPost(doc.id)
                if (result !== 'done'){
                    console.log(result);
                }
            })
            //delete Count and CountPremium has key == keyCat2
            const nor = await db.firestore.collection('Count').where('key', '==', keyCat2).get()
            nor.forEach(async function(doc){
                await db.firestore.collection('Count').doc(doc.id).delete()
            })
            const pre = await db.firestore.collection('CountPremium').where('key', '==', keyCat2).get()
            pre.forEach(async function(doc){
                await db.firestore.collection('CountPremium').doc(doc.id).delete()
            })
            return 'done'
        }
    }
}