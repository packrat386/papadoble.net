var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

if (process.env.MONGOHQ_URL != "" && process.env.MONGOHQ_URL != undefined) {
	var PATH = process.env.MONGOHQ_URL;
} else {
	var PATH = "mongodb://localhost:27017/cocktails";
}
console.log(PATH);

var routes = require('./routes/index');

var app = express();

// Body Parsing
var bodyParser = require('body-parser')

// Get our file data
var fs = require('fs');
var cocktailData = fs.readFileSync('./cocktails.json', { "encoding": "utf8" });
cocktailData = JSON.parse(cocktailData);
// console.log(data);

app.set('mongo', (process.env.MONGOHQ_URL || "mongodb://localhost:27017/cocktails"));

// Retrieve
var MongoClient = require('mongodb').MongoClient;
function handleDBErr(err, result) {
	if (err) {
		console.log("DB errored with result: " + result + " and error: " + err);
	} else {
		console.log("Success!");
	}
}

function loadData(err, col) {
	MongoClient.connect(app.get('mongo'), function(err, db) {
		console.log(app.get('mongo'));
		if(!err) {
			// put our data in
			var collection = db.collection('cocktails');
			collection.insert(cocktailData.cocktails, {w:1}, handleDBErr);
		}
	});
}

// Connect to the db
// TODO: fix the URL for heroku!
MongoClient.connect("mongodb://localhost:27017/cocktails", function(err, db) {
	if(!err) {
		console.log("We are connected");
		var collection = db.collection('cocktails');
		collection.drop(function(err, col) {
			col = db.collection('other');
			col.drop(loadData);
		});
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.set('port', (process.env.PORT || 3000))
var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
