const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
const dotenv = require('dotenv');
const fireStorage = require('firebase/storage')
global.XMLHttpRequest = require("xhr2");
// const db = require('./db');
const configDatabase = {
  apiKey: "AIzaSyBplWJSzjQIXRp3EnxGjVCWV1rHMvhVV2g",
  authDomain: "web-app-484e0.firebaseapp.com",
  projectId: "web-app-484e0",
  storageBucket: "web-app-484e0.appspot.com",
  messagingSenderId: "734047821097",
  appId: "1:734047821097:web:d0fcb7b647cf88e9f46b38",
  measurementId: "G-QM2G2JLBQ8"
}
const firebase = require('firebase');
firebase.initializeApp(configDatabase);


dotenv.config();

const app = express();

//logger
app.use(morgan('dev'));


// view engine
app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  helpers: {
    section: hbs_sections()
  }
}));
app.set('view engine', 'hbs');


// url processing
app.use(express.urlencoded({
  extended: true
}));


app.use('/user/assets', express.static('assets'))
app.use('/assets', express.static('assets'))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.TOKEN_SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}))

// require('./middlewares/userMiddle')(app);
// require('./middlewares/confirmationMiddle')(app);


// test upload file and load file
async function getURL(){
  var storageRef = firebase.storage().ref();
  var urlDownloadLink = await storageRef.child('/avatar.png').getDownloadURL();
  console.log(urlDownloadLink);
}
getURL();
//listening at PORT...
const PORT = 3000
app.listen(PORT, function () {
  console.log(`WebMKD app listening at http://localhost:${PORT}`)
})
