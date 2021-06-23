const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars');
<<<<<<< HEAD
const bodyParser = require('body-parser');
=======
var hbs_sections = require('express-handlebars-sections');
const moment = require('moment');


>>>>>>> cafd584093e70ac06e8e9d98e9cb519cf62c35f1
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