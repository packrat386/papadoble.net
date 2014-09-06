var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function hash(str) {
	var hash = 0;
	for(i = 0; i < str.lenghth(); i++) {
		hash += str.charCodeAt(i);
	}
	return hash;
}

function handleDBErr(err, result) {
	if (err) {
		console.log("DB errored with result: " + result);
	} else {
		console.log("Success!");
	}
}

function makeQuery(body) {
	var query = {};
	if (body.hasOwnProperty("book")) {
		query["book"] = makeRegex(body["book"]);
	}
}

// get the requisite item out of a cursor
function handleCursor(cursor, req, res) {
	if (res.body.hasOwnProperty('story')) {
		returnHash(hash, cursor, res);
	} else {
		returnRand(cursor, res);
	}
}

// returns the item specified by a specifif hash, returns 404 if empty
function returnHash(hash, cursor, res) {
	cursor.count(function(err, count) {
		if (count == 0) {
			res.send("no match", 404);
		}
		returnObj(hash % count, cursor, res);
	});

}

// return a random item within a cursor, returns 404 if empty
function returnRand (cursor, res) {
	cursor.count(function(err, count) {
		if (count == 0) {
			res.send("no match", 404);
		}
		returnObj(getRandomInt(0, count), cursor, res);
	});
} 

function returnObj (index, cursor, res) {
	cursor.skip(index);
	cursor.nextObject(function(err, item) {
		if (!err) {
			res.send(item, 200);
		} else {
			res.send("we goofed on the index", 500);
		}
	});
}

/* GET call to the API */
router.get('/api', function(req, res) {
	console.log(req.body);
	// Connect to the db
	// TODO: fix the URL for heroku!
	MongoClient.connect("mongodb://localhost:27017/cocktails", function(err, db) {
		if (err) {
			res.send("db is down", 500);
		}
		var collection = db.collection('cocktails');
		var query = {};

		var cursor = collection.find(query);
		handleCursor(cursor, req, res);
	});
});


module.exports = router;


// collection.find().toArray(printFind);
// var drinkQuery  = {
//	"ingredients.Lime Juice": { $exists: true }
// }
// collection.find(drinkQuery).toArray(printFind);
