var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request')

/* GET find page. */
router.get('/', function(req, res) {
	var reqobj = {
		method: "get",
		json: {},
		url: "http://papadoble.herokuapp.com/api"
	};
	
	console.log("json is");
	console.log(reqobj.json);

	request(reqobj, function(err, resp, body){
		var statusCode = resp.statusCode;
		// console.log(resp);
		// console.log(body);
		res.render('find', { title: 'Find a Drink', req: "$ curl -XGET -H \"Content-Type:application/json\" http://papadoble.herokuapp.com/api", res: JSON.stringify(body, undefined, 2)});
	});
});

router.post('/', function(req, res) {
	var data = {};
	if (req.body.ingredient && req.body.ingredient != '') {
		data.ingredient = req.body.ingredient;
	}
	if (req.body.book && req.body.book != '') {
		data.book = req.body.book;
	}
	if (req.body.story && req.body.story != '') {
		data.story = req.body.story;
	}
	if (req.body.core && req.body.core == 'on') {
		data.core = false;
	}
	
	var reqobj = {
		method: "get",
		json: data,
		url: "http://papadoble.herokuapp.com/api"
	};
	
	console.log("json is");
	console.log(reqobj.json);

	request(reqobj, function(err, resp, body){
		var statusCode = resp.statusCode;
		// console.log(resp);
		console.log(body);
		res.render('find', { title: 'Find a Drink', req: "$ curl -XGET -d '" + JSON.stringify(reqobj.json) + "' -H \"Content-Type:application/json\" http://papadoble.herokuapp.com/api", res: JSON.stringify(body, undefined, 2)});
	});
});

module.exports = router;
