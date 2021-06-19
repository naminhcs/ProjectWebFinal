const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars');

const app = express();

//logger
app.use(morgan('dev'));


// view
app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs'
}));
app.set('view engine', 'hbs');


// url processing
app.use(express.urlencoded({
  extended: true
}));


app.use('/assets', express.static('assets'))


//route
app.get('/', function (req, res) {
    // res.render('home');
    res.render('home', )
})



//listening at PORT...
const PORT = 3000
app.listen(PORT, function () {
    console.log(`WebMKD app listening at http://localhost:${PORT}`)
})