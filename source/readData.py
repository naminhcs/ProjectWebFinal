import json
import random
import string
from random import randint
import codecs
import requests

listPost = []
listCategory = []

def Upper_Lower_string(length): 
    result = ''.join((random.choice(string.ascii_lowercase) for x in range(length)))
    return result
for i in range(5):
    S = Upper_Lower_string(10)
    listCategory.append(S)
f = open('data_of_post.json', encoding="utf8")

postJson = json.loads(f.read())

for key in postJson.keys():
    newObj = postJson[key]
    newObj['dateUpload'] = newObj.pop('pubDate')
    newObj['summary'] = newObj.pop('description')
    index = randint(0, 4)
    newObj['category1'] = listCategory[index]
    newObj['category2'] = newObj.pop('catogory_level_2')
    newObj['listTag'] = newObj.pop('tags')
    newObj['permission'] = 1
    listPost.append(newObj)

f.close()

cnt = 0
for Aobj in listPost:
    stringObj = Aobj
    res = requests.post('http://localhost:3000/post/upload', json = stringObj, timeout=2.5)
    cnt = cnt + 1
    if (cnt == 50): break
    print(cnt)
