const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.use(express.urlencoded({
  extended: true
}));

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`EC Web App listening at http://localhost:${PORT}`);
});