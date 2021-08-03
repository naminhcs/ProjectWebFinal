import json
import random
import string
from random import randint
import codecs
import requests

listPost = []
listCategory = []
listTag = []
f = open('post.json', encoding="utf8")

postJson = json.loads(f.read())

for key in postJson.keys():
    newObj = postJson[key]
    arrKey = []
    arrName = []
    for keyOfTag in newObj['listTag'].keys():
        arrKey.append(newObj['listTag'][keyOfTag]['key'])
        arrName.append(newObj['listTag'][keyOfTag]['name'])
    del newObj['listTag']
    newObj['listKeyOfTag'] = arrKey
    newObj['listNameOfTag'] = arrName
    listPost.append(newObj)

f.close()

cnt = 0
for Aobj in listPost:
    cnt = cnt + 1
    stringObj = Aobj
    res = requests.post('http://localhost:3000/post/upload', json = stringObj, timeout=5)
    print(cnt)