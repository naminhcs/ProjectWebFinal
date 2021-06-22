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

app.get('/post_detail', function (req, res) {
  res.render('post_detail')
})

app.get('/register', function (req, res) {
  res.render('register')
})

app.post('/register', function (req, res) {
  console.log(req.body)
})



//listening at PORT...
const PORT = 3000
app.listen(PORT, function () {
  console.log(`WebMKD app listening at http://localhost:${PORT}`)
})