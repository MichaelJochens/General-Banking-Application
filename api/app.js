var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();
require('./database/connection');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var verifyRouter = require('./routes/verification');
var loginRouter = require('./routes/login');
var checkerRouter = require('./routes/checker');
var getProfileRouter = require('./routes/getProfile');
var updateProfileRouter = require('./routes/updateProfile');
var changecredentialsRouter = require('./routes/changepass');
var transactionRouter = require('./routes/transaction');
var gettransactionRouter = require('./routes/gettransactions');

var app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/register', registerRouter);
app.use('/api/verification', verifyRouter);
app.use('/api/login', loginRouter);
app.use('/api/authentication', checkerRouter);
app.use('/api/getProfile', getProfileRouter);
app.use('/api/updateProfile', updateProfileRouter);
app.use('/api/changecredentials', changecredentialsRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/gettransaction', gettransactionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
