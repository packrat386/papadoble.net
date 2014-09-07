var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('submit', { title: 'Submit Your Own', req: "$ echo $HOWTO", res: "Check out the documentation to see the format of the recipe then submit it"});
});

router.post('/', function(req, res) {
	var obj = JSON.parse(req.body.recipe);
	console.log(obj)
	var reqobj = {
		method: "post",
		json: obj,
		url: "http://papadoble.herokuapp.com/api"
	};
	
	console.log("json is");
	console.log(reqobj.json);

	request(reqobj, function(err, resp, body){
		var statusCode = resp.statusCode;
		// console.log(resp);
		console.log(body);
		res.render('submit', { title: 'Find a Drink', req: "$ curl -XPOST -d '" + JSON.stringify(reqobj.json) + "' -H \"Content-Type:application/json\" http://papadoble.herokuapp.com/api", res: JSON.stringify(body, undefined, 2)});
	});
});

module.exports = router;
