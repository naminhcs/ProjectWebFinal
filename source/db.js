const configDatabase = {
    apiKey: "AIzaSyBplWJSzjQIXRp3EnxGjVCWV1rHMvhVV2g",
    authDomain: "web-app-484e0.firebaseapp.com",
    projectId: "web-app-484e0",
    storageBucket: "web-app-484e0.appspot.com",
    messagingSenderId: "734047821097",
    appId: "1:734047821097:web:d0fcb7b647cf88e9f46b38",
    measurementId: "G-QM2G2JLBQ8"
}

const firebase = require('firebase')
const db = firebase.initializeApp(configDatabase)
const firestore = firebase.firestore();

module.exports = firestore;