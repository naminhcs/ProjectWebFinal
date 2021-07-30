const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
const dotenv = require('dotenv');

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
app.use('/user/forget/assets', express.static('assets'))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.TOKEN_SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}))



require('./middlewares/localsMiddleware')(app);
require('./middlewares/userMiddle')(app);
require('./middlewares/confirmationMiddle')(app);
require('./middlewares/adminMiddle')(app)
require('./middlewares/tagMiddle')(app)
require('./middlewares/postMiddle')(app)

app.get('/', function (req, res) {
  // console.log(res.locals.data)
  res.render('home')
})

app.get('/post-detail', function (req, res) {
  res.render('post-detail')
})

//listening at PORT...
const PORT = 3000
app.listen(PORT, function () {
  console.log(`WebMKD app listening at http://localhost:${PORT}`)
})