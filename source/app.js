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


app.use('/user/assets', express.static('assets'))
app.use('/assets', express.static('assets'))


require('./middlewares/userMiddle')(app);
require('./middlewares/confirmationMiddle')(app);

//listening at PORT...
const PORT = 3000
app.listen(PORT, function () {
  console.log(`WebMKD app listening at http://localhost:${PORT}`)
})
