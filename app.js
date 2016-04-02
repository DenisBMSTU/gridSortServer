var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(logger('dev'));

/*app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/!*+json' }))*/

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
/*var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
  mongoose.connect('mongodb://localhost/simple');
}*/
mongoose.connect('mongodb://localhost/simple');
var loadTable = mongoose.Schema({
  "date" : String,
  "name": String,
  "count": Number,
  "typeUrl": String,
  "time": String,
  "countBase": Number,
  "baseUrl": String,
  "countInDay": Number,
  "countBaseInDay": Number,
  "sumCountBaseUrl": Number
});
var db = mongoose.connection;
db.on('error', function (err) {
  console.log('connection error', err);
});
db.once('open', function () {
  console.log('connected.');
});
/*app.get('/', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
});*/

app.get('/loadTable', function(req, res) {
  mongoose.model('urls', loadTable);
  mongoose.model('urls').find(function(err, table) {
  /*  res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");*/
    res.send(table);
  });
});




/*
var firstSchema = mongoose.Schema({
  "baseUrl": String,
  "countBase": Number,
  "dateTime": String
});
var saveFirst = mongoose.model('first', firstSchema);*/

app.post('/saveInTable',function(req, res) {

  var url = 'mongodb://localhost/simple';
  var firstData = req.body.firstTable,
      secondDate = req.body.secondTable,
      thirdDate = req.body.thirdTable;
  db.collection('first').remove();
  db.collection('second').remove();
  db.collection('third').remove();
  console.log(thirdDate)
  firstData.forEach(function(item) {
    var insertDocument = function(db, callback) {
      db.collection('first').insertOne( {
        "baseUrl": item.baseUrl,
        "countBase": item.countBase,
        "dateTime": item.dateTime
      }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the first collection.");
        callback();
      });
    };
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      insertDocument(db, function() {
        db.close();
      });
    });
  });
  secondDate.forEach(function(item) {
    var insertDocument = function(db, callback) {
      db.collection('second').insertOne( {
        "from": item.from,
        "to": item.to,
        "dateTime": item.dateTime,
        "countTransitionAll": item.countTransitionAll
      }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the second collection.");
        callback();
      });
    };
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      insertDocument(db, function() {
        db.close();
      });
    });
  });
  thirdDate.forEach(function(item) {
    var insertDocument = function(db, callback) {
      db.collection('third').insertOne( {
        "from": item.from,
        "to": item.to,
        "dateTime": item.dateTime,
        "countTransitionAll": item.countTransitionAll
      }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the third collection.");
        callback();
      });
    };
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      insertDocument(db, function() {
        db.close();
      });
    });
  });
  res.send('ok');
});




// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
