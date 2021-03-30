var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var advertisementRouter= require('./routes/advertisements');
var parcelRouter= require('./routes/parcels');
var transactionRouter= require('./routes/transactions');
var app = express();
const mongoose = require('mongoose');
const uri = "mongodb+srv://kou:fisaa@cluster0.qczbh.mongodb.net/fisaa?retryWrites=true&w=majority";
/*
mongoose.connect('mongodb://localhost:27017/Fissa_DB', { useUnifiedTopology: true, useNewUrlParser: true })
  .then((res)=>{
    console.log("mongoDb connected")
  }) 
  .catch((err)=>{
    console.log("an error has occured", err);
  })
  */
 //atlas
 mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
 .then(() => console.log("Atlas Connected Successfully"))
 .catch(err => console.log(err));

  
// view engine setup
 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/advertisements', advertisementRouter);
app.use('/parcels', parcelRouter);
app.use('/transactions', transactionRouter);

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