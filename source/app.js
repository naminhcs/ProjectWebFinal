const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
const moment = require('moment');

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


app.use('/assets', express.static('assets'))


//route
app.get('/', function (req, res) {
  res.render('home');

})

app.get('/post-detail', function (req, res) {
  res.render('post-detail')
})

app.get('/register', function (req, res) {
  res.render('register')
})

app.post('/register', function (req, res) {
  console.log(req.body)
})

app.get('/is-available-username', function (req, res) {
  const username = req.query.username;
  //Kiem tra co ton tai account voi username = req.query.username hay chua
})

app.get('/login', function (req, res) {
  res.render('login')
})

app.post('/login', function (req, res) {
  console.log(req.body)
  //check username/email + password
})

//listening at PORT...
const PORT = 3000
app.listen(PORT, function () {
  console.log(`WebMKD app listening at http://localhost:${PORT}`)
})
