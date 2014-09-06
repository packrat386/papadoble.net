var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var app = express();
app.set('mongo', (process.env.MONGOHQ_URL || "mongodb://localhost:27017/cocktails"));


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
	if (body.hasOwnProperty("ingredient")) {
		prop = "ingredients." + body["ingredient"].toLowerCase();
		query[prop] = { $exists: true };  
	}
	if (body.hasOwnProperty("id")) {
		try {
			query["_id"] = new ObjectID(body["id"]);
		} catch (err) {
			// give a bogus value if its bad
			query["_id"] = new ObjectID("ffffffffffffffffffffffff");
		}
	}
	return query;
}

function makeRegex(str) {
	// ty StackOverflow
	var regex = new RegExp(["^",str,"$"].join(""),"i");
	return regex;
}

// get the requisite item out of a cursor
function handleCursor(cursor, req, res) {
	if (res.body && res.body.hasOwnProperty('story')) {
		returnHash(hash, cursor, res);
	} else {
		returnRand(cursor, res);
	}
}

// returns the item specified by a specifif hash, returns 404 if empty
function returnHash(hash, cursor, res) {
	cursor.count(function(err, count) {
		if (count == 0) {
			res.status(400).send({"msg": "no match"});
		} else {
			returnObj(hash % count, cursor, res);
		}
	});

}

// return a random item within a cursor, returns 404 if empty
function returnRand (cursor, res) {
	cursor.count(function(err, count) {
		if (count == 0) {
			res.status(404).send({"msg": "no match"});
		} else {
			returnObj(getRandomInt(0, count), cursor, res);
		}
	});
} 

function returnObj (index, cursor, res) {
	cursor.skip(index);
	cursor.nextObject(function(err, item) {
		if (!err) {
			res.status(200).send(item);
		} else {
			res.status(500).send({"msg": "we goofed on the index"});
		}
	});
}

/* GET call to the API */
router.get('/api', function(req, res) {
	console.log(req.body);
	// Connect to the db
	// TODO: fix the URL for heroku!
	MongoClient.connect(app.get('mongo'), function(err, db) {
		console.log(app.get('mongo'));
		if (err) {
			res.status(500).send({"msg": "db is down"});
		}
		if (req.body) {
			var query = makeQuery(req.body);
		} else {
			var query = {};
		}

		if (req.body && req.body.hasOwnProperty("core") && req.body.core == false) { 
			console.log(query);
			var collection = db.collection('other');
		} else {
			var collection = db.collection('cocktails');
		}
		
		var cursor = collection.find(query);
		handleCursor(cursor, req, res);
	});
});

function parseBody(body, res) {
	var recipe = {};
	if (body.hasOwnProperty("name")) {
		recipe.name = "";
		recipe.name += body.name;
	} else {
		res.status(400).send({"msg": "no name"});
		return undefined;
	}

	if (body.hasOwnProperty("ingredients")) {
		recipe.ingredients = {};
		for (var ing in body.ingredients) {
			recipe.ingredients[ing] = "";
			recipe.ingredients[ing] += body.ingredients[ing];
		}
	} else {
		res.status(400).send({"msg": "no ingredients"});
		return undefined;
	}

	if (body.hasOwnProperty("instructions")) {
		recipe.instructions = "";
		recipe.instructions += body.instructions;
	} else {
		res.status(400).send({"msg": "no instructions"});
		return undefined;
	}

	if (body.hasOwnProperty("source")) {
		recipe.source = "";
		recipe.source += body.source;
	} else {
		res.status(400).send({"msg": "no source"});
		return undefined;
	}

	if (body.hasOwnProperty("book")) {
		recipe.book = "";
		recipe.book += body.book;
	} else {
		res.status(400).send({"msg": "no book"});
		return undefined;
	}
	return recipe
}

router.post('/api', function(req, res) {
	MongoClient.connect(app.get('mongo'), function(err, db) {
		console.log(app.get('mongo'));
		if (err) {
			res.status(500).send({"msg": "db is down"});
		}
		if (req.body) {
			try {
				var r = parseBody(req.body, res);
				if (r == undefined) {
					return;
				}
			} catch (err) {
				res.status(500).send({"msg": "couldn't parse that, got err: " + err});
				return;
			}
		} else {
			res.status(400).send("no request");
			return;
		}
		
		var collection = db.collection('other');
		collection.insert(r, {w:1}, function(err, result) {
			if (!err) {
				res.status(200).send({ "msg": "OK!", "result": result});
			}
		});
	});	
});

module.exports = router;
