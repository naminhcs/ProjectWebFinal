import json
import random
import string
from random import randint
import codecs
import requests


#create account for writer

for i in range(1, 26):
    userName = 'writer' + str(i)
    gmail = 'writer' + str(i) + '@gmail.com'
    objUser = {
        'userName': userName, 
        "nameOfUser": userName,
        "gmail": gmail,
        "password": "admin123",
        "dayOfBirth": "12/12/2000",
        "phoneNumber": "012321312",
        "nickName": userName,
        "permission": 3
    }
    res = requests.post('http://localhost:3000/user/register', json = objUser)
    print('done', i)


#create account for editor

for i in range(1, 13):
    userName = 'editor' + str(i)
    gmail = 'editor' + str(i) + '@gmail.com'
    objUser = {
        'userName': userName, 
        "nameOfUser": userName,
        "gmail": gmail,
        "password": "admin123",
        "dayOfBirth": "12/12/2000",
        "phoneNumber": "012321312",
        "nickName": userName,
        "permission": 2
    }
    res = requests.post('http://localhost:3000/user/register', json = objUser)
    print('done', i)

# create account for admin
for i in range(1, 2):
    userName = 'admin'
    gmail = 'admin' + '@gmail.com'
    objUser = {
        'userName': userName, 
        "nameOfUser": userName,
        "gmail": gmail,
        "password": "admin123",
        "dayOfBirth": "12/12/2000",
        "phoneNumber": "012321312",
        "nickName": userName,
        "permission": 1
    }
    res = requests.post('http://localhost:3000/user/register', json = objUser)
    print('done', i)

