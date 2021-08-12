const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
const dotenv = require('dotenv');
const postModel = require('./models/postController');


dotenv.config();

const app = express();

//logger
app.use(morgan('dev'));


// view engine
app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  helpers: {
    section: hbs_sections(),
  },
}));
app.set('view engine', 'hbs');

// Start - Helpers handelbars
var hbs = exphbs.create({});
hbs.handlebars.registerHelper("when", (operand_1, operator, operand_2, options) => {
  let operators = { //  {{#when <operand1> 'eq' <operand2>}}
    'eq': (l, r) => l == r || (+l) == (+r), //  {{/when}}
    'noteq': (l, r) => l != r,
    'gt': (l, r) => (+l) > (+r), // {{#when var1 'eq' var2}}
    'gteq': (l, r) => ((+l) > (+r)) || (l == r), //               eq
    'lt': (l, r) => (+l) < (+r), // {{else when var1 'gt' var2}}
    'lteq': (l, r) => ((+l) < (+r)) || (l == r), //               gt
    'or': (l, r) => l || r, // {{else}}
    'and': (l, r) => l && r, //               lt
    '%': (l, r) => (l % r) === 0 // {{/when}}
  }
  // console.log('Helpers log-------')
  // console.log(operand_1)
  // console.log(operator)
  // console.log(operand_2)

  let result = operators[operator](operand_1, operand_2);
  if (result) return options.fn(this);
  return options.inverse(this);
});
hbs.handlebars.registerHelper('break', function (context, options) {
  eachExit.push(true);
});
// End - Helpers handelbars

// url processing
app.use(express.urlencoded({
  extended: true
}));



app.use('/assets', express.static('assets'))


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
require('./middlewares/editorMiddle')(app)
require('./middlewares/writerMiddle')(app)
require('./middlewares/categoryMiddle')(app)
require('./middlewares/imgMiddle')(app)
require('./middlewares/commentMiddle')(app)



app.get('/', async function (req, res) {
  console.log('abc')
  // console.log(res.locals.dataUser)
  const bai_viet_noi_bat_nhat = require('./assets/json_file/bai_viet_noi_bat.json');
  // const bai_viet_moi_nhat = require('./assets/json_file/bai_viet_moi_nhat.json');


  // topview
  const topview = await postModel.getHighlighByView();
  // console.log(topview)
  console.log('----------------------------')

  // topnews
  const topnews = await postModel.getNew();
  // console.log(topnews)


  const d = new Date()
  const miliSencondPerDay = 24 * 60 * 60 * 1000
  const limitTime = 3.5
  // var t = d.getTime() - limitTime * miliSencondPerDay
  var t = 1627794400000
  const inWeek = await postModel.getPostInWeek(t)
  // console.log(inWeek)

  const postPerCat1 = await postModel.getTopOfPostInEachCat1(res.locals.lcCategory);
  // console.log(postPerCat1)

  // post in week
  res.render('home', {
    bai_viet_noi_bat_nhat: inWeek,
    bai_viet_moi_nhat: topnews,
    bai_viet_duoc_xem_nhieu_nhat: topview,
    bai_viet_moi_nhat_theo_tung_chuyen_muc: postPerCat1
  })
})

app.use(function(req, res, next){
  res.render('notFound404')
})

//listening at PORT...
const PORT = 3000
app.listen(PORT, function () {
  console.log(`WebMKD app listening at http://localhost:${PORT}`)
})