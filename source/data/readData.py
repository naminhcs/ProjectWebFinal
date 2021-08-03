import json
import random
import string
from random import randint
import codecs
import requests

listPost = []
listCategory = []
listTag = []
f = open('tag.json', encoding="utf8")

postJson = json.loads(f.read())

for key in postJson.keys():
    newObj = postJson[key]
    listPost.append(newObj)

f.close()

cnt = 0
for Aobj in listPost:
    cnt = cnt + 1
    stringObj = Aobj
    if (cnt <= 1276): continue
    res = requests.post('http://localhost:3000/tag/add', json = stringObj, timeout=5)
    print(cnt)