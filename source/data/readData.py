import json
import random
import string
from random import randint
import codecs
import requests

f = open('category.json', encoding="utf8")

Cat = json.loads(f.read())

listCat1 = []
cntCat1 = []
listCat2 = []
cntCat2 = []
for key in Cat.keys():
    listCat1.append(Cat[key]['keyCat1'])
    cntCat1.append(0)
    for key2 in Cat[key]['listCat'].keys():
        listCat2.append(Cat[key]['listCat'][key2]['keyCat2'])
        cntCat2.append(0)

f.close()

listPost = []
listCategory = []
listTag = []
f = open('post.json', encoding="utf8")

postJson = json.loads(f.read())

for key in postJson.keys():
    newObj = postJson[key]
    # arrKey = []
    # arrName = []
    # for keyOfTag in newObj['listTag'].keys():
    #     arrKey.append(newObj['listTag'][keyOfTag]['key'])
    #     arrName.append(newObj['listTag'][keyOfTag]['name'])
    # del newObj['listTag']
    # newObj['listKeyOfTag'] = arrKey
    # newObj['listNameOfTag'] = arrName
    # listPost.append(newObj)
    for i in range(0, len(cntCat1)):
        if listCat1[i] == newObj['keyCat1']:
            cntCat1[i] = cntCat1[i] + 1
            break
    for i in range(0, len(cntCat2)):
        if listCat2[i] == newObj['keyCat2']:
            cntCat2[i] = cntCat2[i] + 1
            break

cnt = 0

for i in range(0,len(cntCat2)):
    newObj = {}
    newObj['key'] = listCat2[i]
    newObj['amount'] = cntCat2[i]
    cnt = cnt + 1
    stringObj = newObj
    res = requests.post('http://localhost:3000/post/addcnt', json = stringObj, timeout=5)
    if (res.text != 'done'):
        print('error')
        break
    print(cnt)
# print(listCat1)
# print(cntCat1)

# print(listCat2)
# print(cntCat2)

f.close()

# cnt = 0
# for Aobj in listPost:
#     cnt = cnt + 1
#     stringObj = Aobj
#     if (cnt < ): continue
#     res = requests.post('http://localhost:3000/post/upload', json = stringObj, timeout=5)
#     print(cnt)
#     if (res.text != 'done'):
#         print('error')
#         break



# print(listCat1)
# print(listCat2)